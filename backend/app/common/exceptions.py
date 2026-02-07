from __future__ import annotations

from fastapi import HTTPException, status


class AppHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(AppHTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ForbiddenException(AppHTTPException):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class BadRequestException(AppHTTPException):
    def __init__(self, detail: str = "Invalid request"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
