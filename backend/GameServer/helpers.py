from typing import Iterable, TypeVar, Callable

T = TypeVar("T")


def find(iterable: Iterable[T], validator: Callable[[T], bool]) -> T | None:
    for item in iterable:
        if validator(item):
            return item
    return None
