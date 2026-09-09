"""Local, consented-demo face matching using OpenCV YuNet and SFace models.

This module is limited to the fictional demo records. It is not a forensic or
production identity system and must not be used for decisions about real people.
"""
from dataclasses import dataclass
from pathlib import Path

import cv2

from ..config import BASE_DIR, DEMO_MATCH_THRESHOLD, SFACE_MODEL_PATH, YUNET_MODEL_PATH


@dataclass(frozen=True)
class MatchResult:
    suspect_code: str | None
    confidence: float | None


def _enrollment_paths(suspect) -> list[Path]:
    demo_dir = BASE_DIR / "data" / "demo"
    return sorted(
        path for path in demo_dir.glob(f"{suspect.suspect_code}-*.*")
        if path.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )


def _models_available() -> bool:
    return YUNET_MODEL_PATH.is_file() and SFACE_MODEL_PATH.is_file()


def _detect_one(detector, image):
    detector.setInputSize((image.shape[1], image.shape[0]))
    _status, faces = detector.detect(image)
    if faces is None or len(faces) == 0:
        return None
    # Pick the largest primary face by area (w * h)
    return max(faces, key=lambda f: f[2] * f[3])


def _feature(recognizer, image, face):
    return recognizer.feature(recognizer.alignCrop(image, face))


def match_face(query_image, _query_face_box, suspects, mode: str = "demo") -> MatchResult:
    """Match one live query face against the local consented enrollment set."""
    if mode != "demo" or not suspects or not _models_available():
        return MatchResult(None, None)

    detector = cv2.FaceDetectorYN.create(str(YUNET_MODEL_PATH), "", (320, 320), 0.10, 0.3, 5000)
    recognizer = cv2.FaceRecognizerSF.create(str(SFACE_MODEL_PATH), "")
    query_face = _detect_one(detector, query_image)
    if query_face is None:
        return MatchResult(None, None)
    query_feature = _feature(recognizer, query_image, query_face)

    best = MatchResult(None, None)
    for suspect in suspects:
        for path in _enrollment_paths(suspect):
            reference = cv2.imread(str(path))
            if reference is None:
                continue
            reference_face = _detect_one(detector, reference)
            if reference_face is None:
                continue
            score = float(recognizer.match(
                query_feature,
                _feature(recognizer, reference, reference_face),
                cv2.FaceRecognizerSF_FR_COSINE,
            ))
            confidence = round(score * 100, 1)
            if score >= DEMO_MATCH_THRESHOLD and (best.confidence is None or confidence > best.confidence):
                best = MatchResult(suspect.suspect_code, confidence)
    return best
