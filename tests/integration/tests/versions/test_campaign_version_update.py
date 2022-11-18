import requests
from conf.conf import SecData


def test_campaign_version_update(auth_token, get_campaign_version_id, gen_campaign_version_successful_update_json):
    path = "versions/" + get_campaign_version_id
    response = requests.put(url=SecData.API_BASE_URL + path,
                            json=gen_campaign_version_successful_update_json,
                            headers=auth_token)
    assert response.status_code == 200  # Successful Response
