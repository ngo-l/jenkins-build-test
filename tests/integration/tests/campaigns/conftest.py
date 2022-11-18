import os
import json
import pytest
from pathlib import Path
from datetime import datetime
from pytest_schema import schema


# json
# generate test_campaign_create json
@pytest.fixture(scope="function")
@pytest.parametrize("campaign_type_value", ["Small Campaigns", "New In", "Enewsletter", "On:Anniversary", "On:Birthday",
                                            "On:Birthday Reminder", "On:Downgrade", "On:Downgrade opt-out", "On:FPRP",
                                            "On:PointReminder", "On:Pre-downgrade", "On:Pre-downgrade opt-out",
                                            "On:Retention",
                                            "On:Upgrade", "On:Upgrade opt-out", "Survey", "Replenishment", "Welcome",
                                            "Second Purchase"])
def gen_campaign_create_json(campaign_type_value):
    create_json = {
        "name": "integration_test_" + datetime.now().strftime("%d/%m/%Y_%H:%M:%S"),
        "type": campaign_type_value,
    }
    return create_json


# generate test_campaign_find_many parameters
@pytest.fixture(scope="function")
@pytest.parametrize("campaign_type_value", ["Small Campaigns", "New In", "Enewsletter", "On:Anniversary", "On:Birthday",
                                            "On:Birthday Reminder", "On:Downgrade", "On:Downgrade opt-out", "On:FPRP",
                                            "On:PointReminder", "On:Pre-downgrade", "On:Pre-downgrade opt-out",
                                            "On:Retention",
                                            "On:Upgrade", "On:Upgrade opt-out", "Survey", "Replenishment", "Welcome",
                                            "Second Purchase"])
@pytest.parametrize("page_size_value", [10, 11, 20, 30, 40, 50, 60, 70, 80, 90, 99, 100])
@pytest.parametrize("sort_by_value", ["id", "name", "createdAt", "updatedAt", "size", "estimationState"])  # TBC
@pytest.parametrize("sort_order_value", ["asc", "desc"])
def gen_campaign_find_many_json(campaign_type_value, page_size_value, sort_by_value, sort_order_value):
    find_many_json = {
        "name": "integration_test_",  # find all campaigns created by integration test
        "type": campaign_type_value,
        "currentPage": "1",
        "pageSize": page_size_value,
        "sortBy": sort_by_value,
        "sortOrder": sort_order_value
    }
    return find_many_json


# generate test_campaign_successful_update json
@pytest.fixture(scope="function")
@pytest.parametrize("campaign_type_value", ["New In"])
def gen_campaign_successful_update_json(campaign_type_value):
    update_json = {
        "name": "integration_test_update_" + datetime.now().strftime("%d/%m/%Y_%H:%M:%S"),
        "type": campaign_type_value,
    }
    return update_json


@pytest.fixture(scope="function")
@pytest.parametrize("campaign_type_value", ["Wrong Value", ""])
def gen_campaign_unsuccessful_update_json(campaign_type_value):
    update_json = {
        "name": "integration_test_update_" + datetime.now().strftime("%d/%m/%Y_%H:%M:%S"),
        "type": campaign_type_value,
    }
    return update_json


# schema
@pytest.fixture(scope="function")
def campaign_successful_create_json_schema():
    create_schema = {
        "id": str,
        "createdAt": str,
        "updatedAt": str,
        "name": "integration_test",
        "type": "Small Campaigns",
        "state": "Drafted",
        "creator": {
            "id": str,
            "fullName": str,
            "email": str
        }
    }
    return schema(create_schema)


@pytest.fixture(scope="function")
def campaign_successful_update_json_schema():
    update_schema = {
        "id": str,
        "createdAt": str,
        "updatedAt": str,
        "name": str,
        "type": str,
        "state": "Drafted",
        "creator": {
            "id": str,
            "fullName": str,
            "email": str
        }
    }
    return schema(update_schema)


@pytest.fixture(scope="function")
def campaign_unsuccessful_update_json_schema():
    update_schema = {
        "detail": [
            {
                "loc": [
                    "string"
                ],
                "msg": str,
                "type": str
            }
        ]
    }
    return schema(update_schema)


class TestData:
    CAMPAIGN_STATIC_JSON = json.load(open(
        os.path.join(Path(__file__).parent.parent, "static_test_data", "campaigns", "campaign_static.json")))
