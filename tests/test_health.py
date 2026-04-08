from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_api_root():
    r = client.get("/api/")
    assert r.status_code == 200
    assert "service" in r.json()
