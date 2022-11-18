import requests
from conf.conf import SecData, TearDownData


def test_campaign_successful_retrieve_one(auth_token, get_campaign_id, campaign_successful_create_json_schema):
    path = "campaigns/" + get_campaign_id
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == campaign_successful_create_json_schema
    TearDownData.CAMPAIGN_TESTS_ID_LIST.append(get_campaign_id)  # for teardown


def test_campaign_unsuccessful_retrieve_one(auth_token):
    path = "campaigns/" + "wrong_id"
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 422  # Validation Error
