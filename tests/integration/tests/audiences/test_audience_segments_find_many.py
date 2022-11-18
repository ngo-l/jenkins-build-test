import requests
from conf.conf import SecData


def test_audiences_segment_find_many(auth_token, gen_audience_segments_find_many_pagination_json):
    path = "audiences/segments"
    response = requests.get(url=SecData.API_BASE_URL + path, params=gen_audience_segments_find_many_pagination_json,
                            headers=auth_token)
    assert response.json()["pagination"]["totalPages"] <= response.json()["pagination"]["pageSize"]
    assert response.status_code == 200  # Successful Response
