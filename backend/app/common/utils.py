from __future__ import annotations

import csv
import io
from collections.abc import Iterable, Iterator

from fastapi.responses import StreamingResponse


def _iter_csv_chunks(headers: list[str], rows: Iterable[dict[str, object]]) -> Iterator[str]:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=headers, extrasaction="ignore")
    writer.writeheader()
    yield buffer.getvalue()
    buffer.seek(0)
    buffer.truncate(0)

    for row in rows:
        writer.writerow(row)
        yield buffer.getvalue()
        buffer.seek(0)
        buffer.truncate(0)


def to_csv_response(filename: str, headers: list[str], rows: Iterable[dict[str, object]]) -> StreamingResponse:
    stream = _iter_csv_chunks(headers=headers, rows=rows)

    return StreamingResponse(
        stream,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


def paginate(page: int = 1, page_size: int = 20) -> tuple[int, int]:
    safe_page = max(page, 1)
    safe_page_size = max(min(page_size, 200), 1)
    offset = (safe_page - 1) * safe_page_size
    return offset, safe_page_size
