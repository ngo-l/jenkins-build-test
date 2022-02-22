from typing import Generic, List, Literal, TypeVar

from pydantic import BaseModel
from pydantic.generics import GenericModel

DataT = TypeVar("DataT")


class Contact(GenericModel, Generic[DataT]):
    external_id: str
    trigger_id: str
    data: DataT


class ExternalEvent(GenericModel, Generic[DataT]):
    key_id: int
    contacts: List[Contact[DataT]]

class AbandonedCartEvent(ExternalEvent):
    ...

class WishListEvent(ExternalEvent):
    ...
class Product(BaseModel):
    brand: str
    description: str
    product_id: str
    global_exclusive: Literal["Y", "N"]


class EdmData(BaseModel):
    subject_line: str
    product: List[Product]
