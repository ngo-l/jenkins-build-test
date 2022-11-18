from typing import Optional

from cdxp_api._shared.utils import (
    APIModel,
    exclude,
    include,
    optional,
    optional_all,
    required,
    required_all,
)


class MyModel(APIModel):
    foo: int
    bar: int = 100
    baz: Optional[int]
    qux: Optional[int] = ...  # type: ignore


def test_original():
    assert MyModel.__fields__["foo"].default == None
    assert MyModel.__fields__["foo"].required == True

    assert MyModel.__fields__["bar"].default == 100
    assert MyModel.__fields__["bar"].required == False

    assert MyModel.__fields__["baz"].default == None
    assert MyModel.__fields__["baz"].required == False

    assert MyModel.__fields__["qux"].default == None
    assert MyModel.__fields__["qux"].required == True


def test_required():
    M = required("baz")(MyModel)
    assert M.__fields__["foo"].default == None
    assert M.__fields__["foo"].required == True

    assert M.__fields__["bar"].default == 100
    assert M.__fields__["bar"].required == False

    assert M.__fields__["baz"].default == None
    assert M.__fields__["baz"].required == True

    assert M.__fields__["qux"].default == None
    assert M.__fields__["qux"].required == True


def test_required_all():
    M = required_all(MyModel)
    assert M.__fields__["foo"].default == None
    assert M.__fields__["foo"].required == True

    assert M.__fields__["bar"].default == None
    assert M.__fields__["bar"].required == True

    assert M.__fields__["baz"].default == None
    assert M.__fields__["baz"].required == True

    assert M.__fields__["qux"].default == None
    assert M.__fields__["qux"].required == True


def test_optional():
    M = optional("qux")(MyModel)
    assert M.__fields__["foo"].default == None
    assert M.__fields__["foo"].required == True

    assert M.__fields__["bar"].default == 100
    assert M.__fields__["bar"].required == False

    assert M.__fields__["baz"].default == None
    assert M.__fields__["baz"].required == False

    assert M.__fields__["qux"].default == None
    assert M.__fields__["qux"].required == False


def test_optional_all():
    M = optional_all(MyModel)
    assert M.__fields__["foo"].default == None
    assert M.__fields__["foo"].required == False

    assert M.__fields__["bar"].default == 100
    assert M.__fields__["bar"].required == False

    assert M.__fields__["baz"].default == None
    assert M.__fields__["baz"].required == False

    assert M.__fields__["qux"].default == None
    assert M.__fields__["qux"].required == False


def test_exclude():
    M = exclude("foo", "baz")(MyModel)
    assert M.__fields__.get("foo", None) == None
    assert M.__fields__.get("baz", None) == None

    assert M.__fields__["bar"].default == 100
    assert M.__fields__["bar"].required == False

    assert M.__fields__["qux"].default == None
    assert M.__fields__["qux"].required == True


def test_include():
    M = include("foo", "baz")(MyModel)
    assert M.__fields__.get("bar", None) == None
    assert M.__fields__.get("qux", None) == None

    assert M.__fields__["foo"].default == None
    assert M.__fields__["foo"].required == True

    assert M.__fields__["baz"].default == None
    assert M.__fields__["baz"].required == False
