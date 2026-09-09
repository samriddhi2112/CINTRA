import numpy as np

def _jpeg():
    import cv2
    ok, buf = cv2.imencode(".jpg", np.zeros((60, 60, 3), dtype=np.uint8))
    assert ok
    return buf.tobytes()

def test_demo_match_and_no_match(client, monkeypatch):
    import app.services.identification_service as service
    service.reset_scan_counter()

    # 1st scan returns No Match Found
    res1 = client.post("/api/v1/identify", files={"image": ("x.jpg", _jpeg(), "image/jpeg")}).json()
    assert res1["match"] is False and res1["message"] == "No Match Found"

    # 2nd scan returns Match Found (S004 Anvi Mishra)
    res2 = client.post("/api/v1/identify", files={"image": ("x.jpg", _jpeg(), "image/jpeg")}).json()
    assert res2["match"] is True and res2["suspect"]["suspect_id"] == "S004" and res2["suspect"]["name"] == "Anvi Mishra"



