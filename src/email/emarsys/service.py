import json
import logging
from typing import Any, List

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from src._shared.singleton import Singleton

from .models import Contact, EdmData, ExternalEvent, Product
from .settings import EmarsysSettings, emarsys_settings
from .auth import generate_wsse_signature

# Codes copied from edm-blast project as a compromise for development progress
# FIXME: should not be bound by Emarsys
# FIXME: failed classifying constant vs config
# FIXME: inappropriate interfaces

logger = logging.getLogger(__name__)


class EmarsysService(metaclass=Singleton):
    def __init__(self, settings: EmarsysSettings = emarsys_settings):
        self.settings = settings

    # FIXME replace by singleton request instance OR session

    def request(self, method: str, path: str, **kwargs):
        # FIXME: none of the following relates to Emarsys, should be wrapped in another class
        s = requests.Session()

        status_forcelist = tuple(
            x for x in requests.status_codes._codes if x >= 500)
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=status_forcelist)

        s.mount("https://", HTTPAdapter(max_retries=retries))

        r = s.request(
            method, f"{self.settings.api_base}{path}", headers={
                "X-WSSE": generate_wsse_signature(self.settings.username, self.settings.token),
                "Content-Type": "application/json",
                "Accept": "application/json",
            }, **kwargs)
        r.raise_for_status()
        return r.json()

    def trigger_external_event(self, event_id: int, payload: Any) -> dict:
        # Ref: https://dev.emarsys.com/docs/emarsys-api/b3A6MjQ4OTk5MDU-trigger-an-external-event
        logger.debug(f'trigger emarsys event:{payload}')
        return self.request("POST", f"/event/{event_id}/trigger", json=payload)

    def list_external_events(self) -> dict:
        return self.request("GET", "/event")

    # def get_external_event(self, event_id: int) -> dict:
    #     return self.request("GET", f"/event/{event_id}/usages")

    def get_contact_data(self, payload: Any) -> dict:
        return self.request("POST", f"/contact/getdata", json=payload)

    def filter_opt_in(self, data: List[dict]) -> List[dict]:
        vip_list = [d["vip_no"] for d in data]
        payload = {
            "keyId": self.settings.user_id_field_key,
            "keyValues": vip_list,
            "fields": [self.settings.opt_in_field_key, self.settings.user_id_field_key]
        }

        logger.debug(f"get_contact_data payload:  {payload}")
        response = self.get_contact_data(payload)
        logger.debug(f"contact_data response: {response}")

        opt_in_list = [
            d[self.settings.user_id_field_key]
            for d in response["data"]["result"]
            if d[self.settings.opt_in_field_key] == "1"
        ]

        result = [d for d in data if str(d["vip_no"]) in opt_in_list]
        logger.debug(
            f'data: {data}, opt-in list:{opt_in_list},  result:{result}')
        return result

    def construct_event(self,
                        data: List[dict],
                        event_id: int,
                        product_list_length: int,
                        email_subject: str) -> ExternalEvent[EdmData]:
        # FIXME: tangled codes - break them to differnt parts
        return ExternalEvent(
            key_id=self.settings.user_id_field_key,
            contacts=[
                Contact(
                    external_id=row.get("vip_no"),
                    trigger_id=f"{event_id}_{row.get('vip_no')}",
                    data=EdmData(
                        subject_line=email_subject,
                        product=[
                            Product(
                                brand=row.get(f"brand_{i}"),
                                description=row.get(f"description_{i}"),
                                product_id=row.get(f"product_id_{i}"),
                                global_exclusive="N"
                                if row.get(f"Global_Exclusive_{i}") == "NA"
                                else "Y",
                            )
                            for i in range(1, product_list_length + 1)
                            if row.get(f"brand_{i}") and row.get(f"description_{i}") and row.get(f"product_id_{i}")
                        ],
                    ),
                )
                for row in data
            ],
        )

    def blast(self, data: List[dict], event_id: int, product_list_length: int, email_subject: str):
        if (len(data) <= 0):
            logger.info('no data to blast')
            return {"message": "no data to blast"}

        opt_in_user_with_data = self.filter_opt_in(data)
        event = self.construct_event(
            opt_in_user_with_data, event_id, product_list_length, email_subject)
        result = self.trigger_external_event(event_id, event.dict())

        return result
