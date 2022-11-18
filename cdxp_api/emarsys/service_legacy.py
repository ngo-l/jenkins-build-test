import logging
import secrets
from datetime import datetime
from typing import Any, List, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from .models import Contact, EdmData, Event, Product
from .settings import EmarsysSettings
from .utils import base64Sha1


class EmarsysService:
    def __init__(self, settings: EmarsysSettings = EmarsysSettings()):
        self.settings = settings

    @property
    def wsse(self):
        nonce = secrets.token_hex(16)
        timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        digest = base64Sha1(nonce + timestamp + self.settings.token.get_secret_value())
        return f'UsernameToken Username="{self.settings.user.get_secret_value()}", PasswordDigest="{digest}", Nonce="{nonce}", Created="{timestamp}"'

    @property
    def header(self):
        return {
            "X-WSSE": self.wsse,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def request(self, method: str, path: str, **kwargs):
        s = requests.Session()
        status_forcelist = tuple(x for x in requests.status_codes._codes if x >= 400)
        retries = Retry(total=5, backoff_factor=1, status_forcelist=status_forcelist)
        s.mount("https://", HTTPAdapter(max_retries=retries))
        logging.info(f"sending to Emarsys, payload: {kwargs}")
        r = s.request(method, f"{self.settings.api_base}{path}", headers=self.header, **kwargs)
        r.raise_for_status()
        return r.json()

    def get(self, path: str, **kwargs):
        return self.request("GET", path, **kwargs)

    def post(self, path: str, **kwargs):
        return self.request("POST", path, **kwargs)

    def trigger_external_event(self, event_id: int, payload: Any) -> dict:
        return self.post(f"/event/{event_id}/trigger", json=payload)

    def list_external_events(self) -> dict:
        return self.get("/event")

    def get_external_event(self, event_id: int) -> dict:
        return self.get(f"/event/{event_id}/usages")

    def get_contact_data(self, payload: Any) -> dict:
        return self.post(f"/contact/getdata", json=payload)


# FIXME idiotic invalid relationship: EDM should be the super class instead of extending Emarsys
class EdmService(EmarsysService):
    def __init__(self, event_id: int, product_length: int):
        super().__init__()
        self.product_length = product_length
        self.event_id = event_id

    def filter_opt_in(self, data: List[dict]) -> List[dict]:
        vip_list = [d["vip_no"] for d in data]
        response = self.get_contact_data(
            {
                "keyId": self.settings.vip_num_field_id,
                "keyValues": vip_list,
                "fields": [self.settings.opt_in_field_id, self.settings.vip_num_field_id],
            }
        )
        opt_in_list = [
            d[self.settings.vip_num_field_id]
            for d in response["data"]["result"]
            if d[self.settings.opt_in_field_id] == "1"
        ]
        return [d for d in data if d["vip_no"] in opt_in_list]

    def construct_event(self, key_field_id: str, data: List[dict]) -> Event[EdmData]:
        return Event(
            key_id=key_field_id,
            contacts=[
                Contact(
                    external_id=row.get("vip_no"),
                    trigger_id=f"{self.event_id}_{row.get('vip_no')}",
                    data=EdmData(
                        subject_line=row.get("Subject_Line"),
                        product=[
                            Product(
                                brand=row.get(f"Brand_{i}"),
                                description=row.get(f"Prod_Desc_{i}"),
                                product_id=row.get(f"ATG_{i}"),
                                global_exclusive="N"
                                if row.get(f"Global_Exclusive_{i}") == "NA"
                                else "Y",
                            )
                            for i in range(1, self.product_length + 1)
                            if row.get(f"Brand_{i}") and row.get(f"ATG_{i}")
                        ],
                    ),
                )
                for row in data
            ],
        )

    def blast(self, data: List[dict]):
        filtered_data = self.filter_opt_in(data)
        event = self.construct_event(self.settings.vip_num_field_id, filtered_data)
        result = self.trigger_external_event(self.event_id, event.dict())
        return result
