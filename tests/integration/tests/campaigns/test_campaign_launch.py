import requests
from conf.conf import SecData


def test_campaign_launch(auth_token, campaign_version_id):
    path = "campaigns/" + campaign_version_id + "/launch"
    response = requests.post(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    TearDownData.CAMPAIGN_VERSIONS_TESTS_ID_LIST.append(campaign_version_id)
