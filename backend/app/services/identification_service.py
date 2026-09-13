from ..config import MATCHING_MODE
from .face_matcher import match_face
from .suspect_service import get_suspect, list_suspects


def reset_scan_counter():
    """Kept for compatibility with existing callers."""
    pass


def identify_image(image_bytes, decoded_image, db):
    """
    Identify a face using the local consented-demo YuNet + SFace matcher.

    The face matcher is responsible for:
        - YuNet face detection
        - selecting the largest detected face
        - SFace alignment
        - SFace embedding
        - comparing against enrollment images
        - applying the similarity threshold
    """

    # Get all enrolled demo suspects.
    suspects = list_suspects(db)

    # Run the actual face matcher.
    result = match_face(
        decoded_image,
        None,
        suspects,
        MATCHING_MODE,
    )

    # -----------------------------------------------------
    # Match found
    # -----------------------------------------------------

    if result.suspect_code:

        suspect = get_suspect(
            db,
            result.suspect_code,
        )

        if suspect:
            return {
                "match": True,
                "suspect": {
                    "suspect_id": suspect.suspect_code,
                    "name": suspect.name,
                    "role": suspect.role,
                    "confidence": result.confidence,
                    "wanted": suspect.wanted,
                },
                "message": "Match Found",
            }

    # -----------------------------------------------------
    # No match
    # -----------------------------------------------------

    return {
        "match": False,
        "suspect": None,
        "message": "No Match Found",
    }