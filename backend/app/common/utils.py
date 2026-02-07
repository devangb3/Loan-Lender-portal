from __future__ import annotations

import csv
import io
from typing import Iterable

from fastapi.responses import StreamingResponse


def to_csv_response(filename: str, rows: Iterable[dict[str, object]]) -> StreamingResponse:
    rows = list(rows)
    headers = rows[0].keys() if rows else []
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)
    buffer.seek(0)

    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


def paginate(page: int = 1, page_size: int = 20) -> tuple[int, int]:
    safe_page = max(page, 1)
    safe_page_size = max(min(page_size, 200), 1)
    offset = (safe_page - 1) * safe_page_size
    return offset, safe_page_size
