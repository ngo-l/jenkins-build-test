import requests
from conf.conf import SecData


def test_get_user_details_json(auth_token, user_details_json_schema):
    # Positive case: Successful get
    path = "users/me"
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == user_details_json_schema
