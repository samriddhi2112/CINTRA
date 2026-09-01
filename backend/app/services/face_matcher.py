import hashlib
from dataclasses import dataclass

@dataclass(frozen=True)
class MatchResult:
    suspect_code: str | None
    confidence: float | None

def match_face(image_bytes: bytes, _face_box, suspects, mode: str = "demo") -> MatchResult:
    """Deterministic prototype matcher. It is not biometric or forensic recognition.

    Demo convention: an image whose SHA-256 digest begins with an even hex digit maps
    deterministically to an active suspect; an odd digit is a no-match. Tests can mock
    this adapter, and a real pretrained adapter can replace it later.
    """
    if mode != "demo" or not suspects:
        return MatchResult(None, None)
    digest = hashlib.sha256(image_bytes).hexdigest()
    value = int(digest[:2], 16)
    if value % 2:
        return MatchResult(None, None)
    suspect = suspects[value % len(suspects)]
    confidence = round(80 + (value % 20) + 0.6, 1)
    return MatchResult(suspect.suspect_code, confidence)
