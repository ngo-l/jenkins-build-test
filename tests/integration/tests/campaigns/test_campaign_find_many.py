import requests
from conf.conf import SecData


def test_campaign_find_many(auth_token, gen_campaign_find_many_json):
    path = "campaigns"
    response = requests.get(url=SecData.API_BASE_URL + path, params=gen_campaign_find_many_json,
                            headers=auth_token)
    assert response.json()["pagination"]["totalPages"] <= response.json()["pagination"]["pageSize"]
    assert response.status_code == 200  # Successful Response
