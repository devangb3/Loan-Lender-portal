from __future__ import annotations

from app.modules.notifications.validators import sanitize_html


def test_sanitize_html_allows_safe_markup() -> None:
    html = "<p>Hello <strong>team</strong>. <a href='https://example.com/path'>Review</a></p>"

    sanitized = sanitize_html(html)

    assert "<p>" in sanitized
    assert "<strong>team</strong>" in sanitized
    assert 'href="https://example.com/path"' in sanitized
    assert 'rel="noopener noreferrer"' in sanitized


def test_sanitize_html_removes_unsafe_tags_and_attributes() -> None:
    html = "<script>alert('xss')</script><a href='javascript:alert(1)' onclick='evil()'>Click</a>"

    sanitized = sanitize_html(html)

    assert "<script" not in sanitized
    assert "onclick=" not in sanitized
    assert "javascript:" not in sanitized
    assert "<a>Click</a>" in sanitized
