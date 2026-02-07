from __future__ import annotations

from pathlib import Path
from uuid import UUID, uuid4

from fastapi import UploadFile
from sqlmodel import Session

from app.core.config import settings
from app.modules.files.models import FileAsset
from app.modules.files.repository import FileRepository
from app.modules.files.validators import validate_upload


class FileService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = FileRepository(session)

    async def save_deal_file(self, deal_id: UUID, uploaded_by_user_id: UUID, upload: UploadFile) -> FileAsset:
        raw = await upload.read()
        validate_upload(upload.filename, len(raw))

        extension = Path(upload.filename).suffix.lower()
        storage_name = f"{uuid4()}{extension}"
        uploads_dir = Path(settings.upload_dir)
        uploads_dir.mkdir(parents=True, exist_ok=True)
        target = uploads_dir / storage_name
        target.write_bytes(raw)

        asset = FileAsset(
            deal_id=deal_id,
            uploaded_by_user_id=uploaded_by_user_id,
            original_filename=upload.filename,
            storage_path=str(target),
            size_bytes=len(raw),
        )
        self.repo.create(asset)
        return asset
