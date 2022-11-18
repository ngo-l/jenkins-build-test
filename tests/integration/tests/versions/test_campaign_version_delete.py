import requests
from conf.conf import SecData


def test_campaign_version_successful_delete(auth_token, get_campaign_version_id):
    path = "versions/" + get_campaign_version_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 204  # Successful Response


def test_campaign_version_successful_delete_the_same_campaign_version(auth_token, get_campaign_version_id):
    path = "versions/" + get_campaign_version_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 204  # Successful Response
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 404  # Not found


def test_campaign_version_unsuccessful_delete(auth_token):
    path = "versions/" + "wrong_id"
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 422  # Validation Error
