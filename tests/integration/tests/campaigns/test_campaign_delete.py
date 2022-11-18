import requests
from conf.conf import SecData


def test_campaign_successful_delete(auth_token, get_campaign_id):
    path = "campaigns/" + get_campaign_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 204  # Successful Response


def test_campaign_successful_delete_same_campaign(auth_token, get_campaign_id):
    path = "campaigns/" + get_campaign_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 204  # Successful Response
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 404  # Not found


def test_campaign_unsuccessful_delete(auth_token):
    path = "campaigns/" + "wrong_id"
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 422  # Validation Error
