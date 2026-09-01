def test_suspect_list_and_lookup(client):
    records = client.get("/api/v1/suspects").json()
    assert len(records) == 3
    assert "image_path" not in records[0]
    assert client.get("/api/v1/suspects/S001").json()["name"] == "Raj Kumar"
    assert client.get("/api/v1/suspects/none").status_code == 404
