from typing import Generic, List, Literal, Optional, TypeVar

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


class ProductData(BaseModel):
    brand: str
    description: Optional[str]
    product_id: Optional[str]


class EdmData(BaseModel):
    subject_line: Optional[str]
    product: List[ProductData]


