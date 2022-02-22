from fastapi.testclient import TestClient
from service import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 204