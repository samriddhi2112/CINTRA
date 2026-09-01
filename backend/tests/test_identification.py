import numpy as np

def _jpeg():
    import cv2
    ok, buf = cv2.imencode(".jpg", np.zeros((60, 60, 3), dtype=np.uint8))
    assert ok
    return buf.tobytes()

def test_no_and_multiple_faces(client, monkeypatch):
    import app.services.identification_service as service
    monkeypatch.setattr(service, "detect_faces", lambda image: [])
    response = client.post("/api/v1/identify", files={"image": ("x.jpg", _jpeg(), "image/jpeg")})
    assert response.json()["message"] == "No face detected"
    monkeypatch.setattr(service, "detect_faces", lambda image: [(1, 1, 2, 2), (2, 2, 3, 3)])
    response = client.post("/api/v1/identify", files={"image": ("x.jpg", _jpeg(), "image/jpeg")})
    assert "Multiple faces" in response.json()["message"]

def test_demo_match_and_no_match(client, monkeypatch):
    import app.services.identification_service as service
    from app.services.face_matcher import MatchResult
    monkeypatch.setattr(service, "detect_faces", lambda image: [(1, 1, 2, 2)])
    monkeypatch.setattr(service, "match_face", lambda *args: MatchResult("S001", 94.6))
    matched = client.post("/api/v1/identify", files={"image": ("x.jpg", _jpeg(), "image/jpeg")}).json()
    assert matched["match"] is True and matched["suspect"]["confidence"] == 94.6
    monkeypatch.setattr(service, "match_face", lambda *args: MatchResult(None, None))
    response = client.post("/api/v1/identify", files={"image": ("x.jpg", _jpeg(), "image/jpeg")})
    assert response.json() == {"match": False, "suspect": None, "message": "No Match Found"}
