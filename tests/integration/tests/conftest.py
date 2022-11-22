from pytest_cases import fixture

"""Session/Common Fixtures"""


@fixture(autouse=True, scope='session')
def setup_teardown():
    # setup
    yield
    # teardown
