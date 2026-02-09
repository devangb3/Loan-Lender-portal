from __future__ import annotations

from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

ALLOWED_TAGS = {"a", "b", "br", "em", "i", "li", "ol", "p", "strong", "u", "ul"}
ALLOWED_SCHEMES = {"http", "https", "mailto"}
ALLOWED_LINK_ATTRIBUTES = {"href", "target", "rel", "title"}


def _sanitize_href(value: str) -> str | None:
    href = value.strip()
    if not href:
        return None
    parsed = urlparse(href)
    if parsed.scheme and parsed.scheme.lower() not in ALLOWED_SCHEMES:
        return None
    return href


class _EmailHTMLSanitizer(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        normalized_tag = tag.lower()
        if normalized_tag not in ALLOWED_TAGS:
            return

        if normalized_tag == "br":
            self.parts.append("<br>")
            return

        safe_attrs: list[str] = []
        if normalized_tag == "a":
            for key, value in attrs:
                if value is None:
                    continue
                attr_name = key.lower()
                if attr_name not in ALLOWED_LINK_ATTRIBUTES:
                    continue
                if attr_name == "href":
                    cleaned_href = _sanitize_href(value)
                    if not cleaned_href:
                        continue
                    safe_attrs.append(f'href="{escape(cleaned_href, quote=True)}"')
                    continue
                safe_attrs.append(f'{attr_name}="{escape(value, quote=True)}"')

            has_href = any(attr.startswith("href=") for attr in safe_attrs)
            if has_href and not any(attr.startswith("rel=") for attr in safe_attrs):
                safe_attrs.append('rel="noopener noreferrer"')

        attrs_block = f" {' '.join(safe_attrs)}" if safe_attrs else ""
        self.parts.append(f"<{normalized_tag}{attrs_block}>")

    def handle_endtag(self, tag: str) -> None:
        normalized_tag = tag.lower()
        if normalized_tag in ALLOWED_TAGS and normalized_tag != "br":
            self.parts.append(f"</{normalized_tag}>")

    def handle_data(self, data: str) -> None:
        self.parts.append(escape(data))


def sanitize_html(html: str) -> str:
    sanitizer = _EmailHTMLSanitizer()
    sanitizer.feed(html or "")
    sanitizer.close()
    return "".join(sanitizer.parts).strip()
