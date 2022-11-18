import os
import json
import pytest
from pathlib import Path
from datetime import datetime
from pytest_schema import schema


# json
# generate test_audience_segments_create json (high priority filters)
@pytest.fixture(scope='function')
@pytest.parametrize("transaction_value_operator", ["less_than", "greater_than"])
@pytest.parametrize("gender_value", ["Female", "Male", "Unspecified"])
@pytest.parametrize("nationality_value", ["HKC", "HKL", "NA"])
@pytest.parametrize("card_tier_value", ["Beauty+", "Diamond", "Gold", "Platinum", "Privilege"])
@pytest.parametrize("preferred_channel_value", ["SMS", "Email"])
@pytest.parametrize("card_organization_value", ["Lane Crawford Hong Kong", "Lane Crawford Beijing"])
@pytest.parametrize("mail_group_value", ["HK", "SHG", "BJ"])
@pytest.parametrize("customer_type_value", ["China", "Hong Kong", "Overseas", "Unspecified"])
def gen_audience_segments_create_json(gender_value, nationality_value, card_tier_value, preferred_channel_value,
                                      card_organization_value, mail_group_value,
                                      customer_type_value):
    create_json = {
        "name": "integration_test_" + datetime.now().strftime("%d/%m/%Y_%H:%M:%S"),
        "filters": {
            "id": "string",
            "type": "group",
            "level": 4,
            "conjunction": "and",
            "rules": [
                {
                    "id": "string",
                    "type": "rule",
                    "field": "gender",
                    "operator": "in",
                    "value": gender_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "nationality",
                    "operator": "in",
                    "value": nationality_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "card_tier",
                    "operator": "in",
                    "value": card_tier_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "preferred_channel",
                    "operator": "in",
                    "value": preferred_channel_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "card_organization",
                    "operator": "in",
                    "value": card_organization_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "mail_group",
                    "operator": "in",
                    "value": mail_group_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "customer_type",
                    "operator": "in",
                    "value": customer_type_value
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "is_achieved",
                    "operator": "is",
                    "value": "true"
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "opened_email",
                    "operator": "is",
                    "value": "true",
                    "groupBy": "AnyEmail_P1M"
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "clicked_email",
                    "operator": "is",
                    "value": "true",
                    "groupBy": "AnyEmail_P1M"
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "email_subscriber",
                    "operator": "is",
                    "value": "true"
                }
            ]
        }
    }
    return create_json


# generate test_audience_segments_find_many parameters
@pytest.fixture(scope="function")
@pytest.parametrize("page_size_value", [10, 11, 20, 30, 40, 50, 60, 70, 80, 90, 99, 100])
@pytest.parametrize("sort_by_value", ["id", "name", "createdAt", "updatedAt", "size", "estimationState"])  # TBC
@pytest.parametrize("sort_order_value", ["asc", "desc"])
def gen_audience_segments_find_many_pagination_json(page_size_value, sort_by_value, sort_order_value):
    find_many_json = {
        "name": "integration_test_",  # find all audience segments created by integration test
        "currentPage": "1",
        "pageSize": page_size_value,
        "sortBy": sort_by_value,
        "sortOrder": sort_order_value
    }
    return find_many_json


@pytest.fixture(scope="function")
@pytest.parametrize("rule", ["gender"])
@pytest.parametrize("value", ["Female"])
def gen_audience_segments_successful_update_json(rule, value):
    update_json = {
        "name": "integration_test_update_" + datetime.now().strftime("%d/%m/%Y_%H:%M:%S"),
        "filters": {
            "id": "string",
            "type": "group",
            "level": 4,
            "conjunction": "and",
            "rules": [
                {
                    "id": "string",
                    "type": "rule",
                    "field": rule,
                    "operator": "in",
                    "value": [value]
                }
            ]
        }
    }
    return update_json


@pytest.fixture(scope="function")
@pytest.parametrize("rule", ["Wrong Rule", ""])
@pytest.parametrize("value", ["Wrong Value", ""])
def gen_audience_segments_unsuccessful_update_json(rule, value):
    update_json = {
        "name": "integration_test_update_" + datetime.now().strftime("%d/%m/%Y_%H:%M:%S"),
        "filters": {
            "id": "string",
            "type": "group",
            "level": 4,
            "conjunction": "and",
            "rules": [
                {
                    "id": "string",
                    "type": "rule",
                    "field": rule,
                    "operator": "in",
                    "value": [value]
                }
            ]
        }
    }
    return update_json


# schema
@pytest.fixture(scope="function")
def audience_segment_successful_create_json_schema():
    create_schema = {
        "id": str,
        "createdAt": str,
        "updatedAt": str,
        "name": "integration_test",
        "filters": {
            "id": "string",
            "type": "group",
            "level": 4,
            "conjunction": "and",
            "rules": [
                {
                    "id": "string",
                    "type": "rule",
                    "field": "gender",
                    "operator": "in",
                    "value": ["Female"]
                },
                {
                    "id": "string",
                    "type": "rule",
                    "field": "nationality",
                    "operator": "in",
                    "value": ["HKC"]
                }
            ]
        }
    }
    return schema(create_schema)


@pytest.fixture(scope="function")
def audience_segments_successful_update_json_schema():
    update_schema = {
        "name": str,
        "filters": {
            "id": str,
            "type": "group",
            "level": 4,
            "conjunction": "and",
            "rules": [
                {
                    "id": str,
                    "type": "rule",
                    "field": "gender",
                    "operator": "in",
                    "value": ["Female"]
                }
            ]
        }
    }
    return schema(update_schema)


@pytest.fixture(scope="function")
def audience_segments_unsuccessful_update_json_schema():
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
    AUDIENCE_SEGMENT_STATIC_JSON = json.load(open(
        os.path.join(Path(__file__).parent.parent, "static_test_data", "audiences", "audience_segment_static.json")))
