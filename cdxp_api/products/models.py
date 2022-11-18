from .._shared.utils import APIModel
from .._shared.utils import include, optional_all
from ..products.rules import ProductSegmentRuleGroup


class ProductSegment(APIModel):
    id: str
    name: str
    filters: ProductSegmentRuleGroup


class ProductSegmentRead(ProductSegment):
    ...


@include("name", "filters")
class ProductSegmentCreate(ProductSegment):
    ...


@optional_all
class ProductSegmentUpdate(ProductSegmentCreate):
    ...


@include("name")
class ProductSegmentFilter(ProductSegmentUpdate):
    ...
