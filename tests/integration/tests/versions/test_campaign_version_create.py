import requests
from conf.conf import SecData


def test_campaign_version_create(auth_token, gen_create_campaign_version_json):
    path = "versions"
    response = requests.post(url=SecData.API_BASE_URL + path, json=gen_create_campaign_version_json,
                             headers=auth_token)
    assert response.status_code == 200  # Successful Response
