import requests
from conf.conf import SecData


def test_campaign_version_successful_retrieve_one(auth_token, get_campaign_version_id):
    path = "versions/" + get_campaign_version_id
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response


def test_campaign_version_unsuccessful_retrieve_one(auth_token):
    path = "versions/" + "wrong_id"
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 422  # Validation Error
