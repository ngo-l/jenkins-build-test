from datetime import date
from typing import List, Literal, Set, TypeAlias, Union

from pydantic.types import PositiveFloat, conint

from ..audiences.rules import (
    BaseRuleGroupModel,
    BaseRuleModel,
    # BooleanOperator,
    # DateOperator,
    EnumOperator,
    NumericOperator,
)
from .product_tree_data import (
    ProductBrandGroup,
    ProductCategory,
    ProductDepartment,
    ProductSubcategory,
    ProductSubdepartment,
)


class ProductDepartmentRule(BaseRuleModel):
    field: Literal["department"]
    operator: EnumOperator
    value: Set[ProductDepartment]


class ProductSubdepartmentRule(BaseRuleModel):
    field: Literal["subdepartment"]
    operator: EnumOperator
    value: Set[ProductSubdepartment]


class ProductCategoryRule(BaseRuleModel):
    field: Literal["category"]
    operator: EnumOperator
    value: Set[ProductCategory]


class ProductSubcategoryRule(BaseRuleModel):
    field: Literal["subcategory"]
    operator: EnumOperator
    value: Set[ProductSubcategory]


class ProductBandStyleRule(BaseRuleModel):
    field: Literal["brand_style"]
    operator: EnumOperator
    value: Set[ProductBrandGroup]


class ProductSkuRule(BaseRuleModel):
    field: Literal["sku"]
    operator: EnumOperator
    value: Set[str]


class ProductPriceRule(BaseRuleModel):
    field: Literal["price"]
    operator: NumericOperator
    value: PositiveFloat


Percentage: TypeAlias = conint(ge=0, le=100)


class ProductDiscountPercentageRule(BaseRuleModel):
    field: Literal["discount_percentage"]
    operator: NumericOperator
    value: Percentage


class ProductSeasonRule(BaseRuleModel):
    field: Literal["season"]
    operator: EnumOperator
    value: Set[str]


# class ProductStartDateRule(BaseRuleModel):
#     field: Literal["start_date"]
#     operator: DateOperator
#     value: date


# class ProductExclusiveFlagRule(BaseRuleModel):
#     field: Literal["exclusive_flag"]
#     operator: BooleanOperator
#     value: bool


ProductSegmentRule: TypeAlias = Union[
    ProductDepartmentRule,
    ProductSubdepartmentRule,
    ProductCategoryRule,
    ProductSubcategoryRule,
    ProductBandStyleRule,
    ProductSkuRule,
    ProductPriceRule,
    ProductDiscountPercentageRule,
    ProductSeasonRule,
    # ProductStartDateRule,
    # ProductExclusiveFlagRule,
]


class ProductSegmentRuleGroup(BaseRuleGroupModel):
    rules: List[Union[ProductSegmentRule, "ProductSegmentRuleGroup"]]


ProductSegmentRuleGroup.update_forward_refs()
