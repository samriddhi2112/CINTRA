"""
Local, consented-demo face matching using OpenCV YuNet and SFace models.

This module is limited to the fictional demo records. It is not a forensic or
production identity system and must not be used for decisions about real people.
"""

from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np

from ..config import (
    BASE_DIR,
    DEMO_MATCH_THRESHOLD,
    SFACE_MODEL_PATH,
    YUNET_MODEL_PATH,
)


@dataclass(frozen=True)
class MatchResult:
    suspect_code: str | None
    confidence: float | None


# =========================================================
# ENROLLMENT IMAGES
# =========================================================

def _enrollment_paths(suspect) -> list[Path]:
    """
    Return all valid enrollment images for a suspect.

    Example:
        S001-1.png
        S001-2.png
        S001-3.png

    Files such as S001.jpg are intentionally not included
    because the existing enrollment convention uses
    <suspect_code>-<number>.<extension>.
    """

    demo_dir = BASE_DIR / "data" / "demo"

    return sorted(
        path
        for path in demo_dir.glob(
            f"{suspect.suspect_code}-*.*"
        )
        if path.suffix.lower()
        in {".jpg", ".jpeg", ".png"}
    )


# =========================================================
# MODEL AVAILABILITY
# =========================================================

def _models_available() -> bool:
    return (
        YUNET_MODEL_PATH.is_file()
        and SFACE_MODEL_PATH.is_file()
    )


# =========================================================
# FACE DETECTION
# =========================================================

def _detect_one(detector, image):
    """
    Detect exactly one face.

    Returns:
        YuNet face representation if exactly one face exists.
        None if there is no face or multiple faces.
    """

    detector.setInputSize(
        (image.shape[1], image.shape[0])
    )

    _status, faces = detector.detect(image)

    if faces is None or len(faces) == 0:
        return None

    # Do NOT arbitrarily choose the largest face.
    #
    # If an enrollment image contains multiple faces,
    # it is ambiguous and should not be used.
    if len(faces) > 1:
        return None

    return faces[0]


# =========================================================
# FEATURE EXTRACTION
# =========================================================

def _feature(recognizer, image, face):
    """
    Align the detected face using YuNet's facial landmarks
    and extract the SFace embedding.
    """

    aligned = recognizer.alignCrop(
        image,
        face
    )

    return recognizer.feature(
        aligned
    ).astype(np.float32)


# =========================================================
# EMBEDDING NORMALIZATION
# =========================================================

def _normalize(feature):
    """
    L2-normalize an embedding.
    """

    norm = np.linalg.norm(feature)

    if norm == 0:
        return feature

    return feature / norm


# =========================================================
# MULTI-IMAGE IDENTITY TEMPLATE
# =========================================================

def _build_template(
    recognizer,
    detector,
    suspect,
):
    """
    Build one identity template from all valid enrollment images.

    Each enrollment image produces an SFace embedding.

    The embeddings are:
        1. individually normalized
        2. averaged
        3. normalized again

    This makes the identity representation less dependent
    on any single enrollment image.
    """

    features = []

    for path in _enrollment_paths(suspect):

        reference = cv2.imread(
            str(path)
        )

        if reference is None:
            continue

        reference_face = _detect_one(
            detector,
            reference
        )

        if reference_face is None:
            # No face OR multiple faces.
            continue

        feature = _feature(
            recognizer,
            reference,
            reference_face
        )

        features.append(
            _normalize(feature)
        )

    if not features:
        return None

    # Average all enrollment embeddings.
    template = np.mean(
        features,
        axis=0
    )

    # Normalize the resulting identity template.
    template = _normalize(
        template
    )

    return template.astype(
        np.float32
    )


# =========================================================
# FACE MATCHING
# =========================================================

def match_face(
    query_image,
    _query_face_box,
    suspects,
    mode: str = "demo",
) -> MatchResult:
    """
    Match one live query face against the local consented
    enrollment set.

    Recognition strategy:

        Query image
             |
             v
        YuNet detection
             |
             v
        SFace embedding
             |
             v
        Compare against identity templates
             |
             v
        Highest cosine similarity
    """

    # -----------------------------------------------------
    # Safety / mode checks
    # -----------------------------------------------------

    if (
        mode != "demo"
        or not suspects
        or not _models_available()
    ):
        return MatchResult(
            None,
            None
        )

    # -----------------------------------------------------
    # Create models
    # -----------------------------------------------------

    detector = cv2.FaceDetectorYN.create(
        str(YUNET_MODEL_PATH),
        "",
        (320, 320),
        0.10,
        0.3,
        5000,
    )

    recognizer = cv2.FaceRecognizerSF.create(
        str(SFACE_MODEL_PATH),
        "",
    )

    # -----------------------------------------------------
    # Detect query face
    # -----------------------------------------------------

    query_face = _detect_one(
        detector,
        query_image
    )

    if query_face is None:
        return MatchResult(
            None,
            None
        )

    # -----------------------------------------------------
    # Extract query embedding
    # -----------------------------------------------------

    query_feature = _feature(
        recognizer,
        query_image,
        query_face
    )

    query_feature = _normalize(
        query_feature
    )

    # -----------------------------------------------------
    # Compare query against each suspect template
    # -----------------------------------------------------

    best_suspect = None
    best_score = None

    for suspect in suspects:

        template = _build_template(
            recognizer,
            detector,
            suspect
        )

        if template is None:
            continue

        score = float(
            recognizer.match(
                query_feature,
                template,
                cv2.FaceRecognizerSF_FR_COSINE,
            )
        )

        # Keep the highest-scoring identity.
        if (
            best_score is None
            or score > best_score
        ):
            best_score = score
            best_suspect = suspect.suspect_code

    # -----------------------------------------------------
    # No usable enrollment templates
    # -----------------------------------------------------

    if best_suspect is None or best_score is None:
        return MatchResult(
            None,
            None
        )

    # -----------------------------------------------------
    # Threshold decision
    # -----------------------------------------------------

    if best_score < DEMO_MATCH_THRESHOLD:
        return MatchResult(
            None,
            None
        )

    # -----------------------------------------------------
    # Convert cosine score to percentage
    # -----------------------------------------------------

    confidence = round(
        best_score * 100,
        1
    )

    return MatchResult(
        best_suspect,
        confidence
    )