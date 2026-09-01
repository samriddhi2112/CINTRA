from ..config import MATCHING_MODE
from .face_detector import detect_faces
from .face_matcher import match_face
from .suspect_service import get_suspect, list_suspects

def identify_image(image_bytes, decoded_image, db):
    faces = detect_faces(decoded_image)
    if not faces:
        return {"match": False, "suspect": None, "message": "No face detected"}
    if len(faces) > 1:
        return {"match": False, "suspect": None, "message": "Multiple faces detected. Please scan one person at a time."}
    result = match_face(image_bytes, faces[0], list_suspects(db), MATCHING_MODE)
    if not result.suspect_code:
        return {"match": False, "suspect": None, "message": "No Match Found"}
    suspect = get_suspect(db, result.suspect_code)
    if not suspect:
        return {"match": False, "suspect": None, "message": "No Match Found"}
    return {"match": True, "suspect": {"suspect_id": suspect.suspect_code, "name": suspect.name, "role": suspect.role, "confidence": result.confidence, "wanted": suspect.wanted}, "message": "Match Found"}
