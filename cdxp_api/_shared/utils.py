import re
from enum import Enum
from functools import partial
from typing import Any, Dict, Type

from pydantic import BaseConfig, create_model
from pydantic.fields import ModelField
from pydantic.main import BaseModel
from sqlmodel import SQLModel


def snake2camel(snake: str, start_lower: bool = False) -> str:
    """
    Converts a snake_case string to camelCase.
    The `start_lower` argument determines whether the first letter in the generated camelcase should
    be lowercase (if `start_lower` is True), or capitalized (if `start_lower` is False).
    """
    camel = snake.title()
    camel = re.sub("([0-9A-Za-z])_(?=[0-9A-Z])", lambda m: m.group(1), camel)
    if start_lower:
        camel = re.sub("(^_*[A-Z])", lambda m: m.group(1).lower(), camel)
    return camel


def camel2snake(camel: str) -> str:
    """
    Converts a camelCase string to snake_case.
    """
    snake = re.sub(r"([a-zA-Z])([0-9])", lambda m: f"{m.group(1)}_{m.group(2)}", camel)
    snake = re.sub(r"([a-z0-9])([A-Z])", lambda m: f"{m.group(1)}_{m.group(2)}", snake)
    return snake.lower().replace(" ", "_")


class APIModel(SQLModel):
    class Config(BaseConfig):
        orm_mode = True
        allow_population_by_field_name = True
        alias_generator = partial(snake2camel, start_lower=True)


class StrEnum(str, Enum):
    def _generate_next_value_(name, start, count, last_values) -> str:  # type: ignore
        return name


def keep_field(field: ModelField):
    return ... if field.required else field.default


def create_api_model(
    __model_name: str, *, __validators__: Dict[str, classmethod] = None, **field_definitions: Any
) -> Type[APIModel]:
    return create_model(__model_name, __base__=APIModel, **field_definitions)


def required(*field_names: str):
    def decorator(Model: Type[APIModel]) -> Type[APIModel]:
        _fields = {
            name: (field.type_, ... if name in field_names else keep_field(field))
            for name, field in Model.__fields__.items()
        }
        _Model = create_api_model(Model.__name__, **_fields)
        return _Model

    return decorator


def required_all(Model: Type[APIModel]) -> Type[APIModel]:
    _fields = {name: (field.type_, ...) for name, field in Model.__fields__.items()}
    _Model = create_api_model(Model.__name__, **_fields)
    return _Model


def optional(*field_names: str):
    def decorator(Model: Type[APIModel]) -> Type[APIModel]:
        _fields = {
            name: (field.type_, None if (name in field_names) else keep_field(field))
            for name, field in Model.__fields__.items()
        }
        _Model = create_api_model(Model.__name__, **_fields)
        return _Model

    return decorator


def optional_all(Model: Type[APIModel]) -> Type[APIModel]:
    _fields = {name: (field.type_, field.default) for name, field in Model.__fields__.items()}
    _Model = create_api_model(Model.__name__, **_fields)
    return _Model


def exclude(*field_names: str):
    def decorator(Model: Type[APIModel]) -> Type[APIModel]:
        _fields = {
            name: (field.type_, keep_field(field))
            for name, field in Model.__fields__.items()
            if name not in field_names
        }
        _Model = create_api_model(Model.__name__, **_fields)
        return _Model

    return decorator


def include(*field_names: str):
    def decorator(Model: Type[APIModel]) -> Type[APIModel]:
        _fields = {
            name: (field.type_, keep_field(field))
            for name, field in Model.__fields__.items()
            if name in field_names
        }
        _Model = create_api_model(Model.__name__, **_fields)
        return _Model

    return decorator


def create_rule_schemas(Model: Type[BaseModel]):
    return {
        field: {
            "title": field,
            "type": content["type"],
            "properties": {
                key: value
                for key, value in content["properties"].items()
                if key not in ["id", "type"]
            },
        }
        for name, content in Model.schema()["definitions"].items()
        if name != Model.__name__
        if (field := content["properties"]["field"]["enum"][0])
    }
