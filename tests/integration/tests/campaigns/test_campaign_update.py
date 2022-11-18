import requests
from conf.conf import SecData, TearDownData


def test_campaign_successful_update(auth_token, get_campaign_id, gen_campaign_successful_update_json,
                                    campaign_successful_update_json_schema):
    path = "campaigns/" + get_campaign_id
    response = requests.put(url=SecData.API_BASE_URL + path,
                            json=gen_campaign_successful_update_json,
                            headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == campaign_successful_update_json_schema  # verify schema and expected value
    TearDownData.CAMPAIGN_TESTS_ID_LIST.append(get_campaign_id)  # for teardown


def test_campaign_unsuccessful_update(auth_token, get_campaign_id, gen_campaign_unsuccessful_update_json,
                                      campaign_unsuccessful_update_json_schema):
    path = "campaigns/" + get_campaign_id
    response = requests.put(url=SecData.API_BASE_URL + path,
                            json=gen_campaign_unsuccessful_update_json,
                            headers=auth_token)
    assert response.status_code == 422  # Validation Error
    assert response.json() == campaign_unsuccessful_update_json_schema  # verify schema and expected value
    TearDownData.CAMPAIGN_TESTS_ID_LIST.append(get_campaign_id)  # for teardown
