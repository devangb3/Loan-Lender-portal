from __future__ import annotations

from app.core.security import get_password_hash, verify_password


def test_hash_and_verify_long_password_over_72_bytes() -> None:
    password = "StrongPass1" + ("x" * 120)

    password_hash = get_password_hash(password)

    assert password_hash.startswith("$pbkdf2-sha256$")
    assert verify_password(password, password_hash) is True


def test_hash_and_verify_long_utf8_password_over_72_bytes() -> None:
    # Multi-byte characters to ensure byte-length handling is safe.
    password = ("Äßçé" * 40) + "StrongPass1"

    password_hash = get_password_hash(password)

    assert verify_password(password, password_hash) is True
    assert verify_password(password + "!", password_hash) is False

