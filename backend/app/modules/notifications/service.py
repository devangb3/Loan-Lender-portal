from __future__ import annotations

import logging

import resend
from sqlmodel import Session

from app.core.config import settings
from app.modules.notifications.models import NotificationLog
from app.modules.notifications.repository import NotificationRepository
from app.modules.notifications.validators import sanitize_html

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = NotificationRepository(session)

    def send_email(self, to_email: str, subject: str, html: str) -> None:
        html = sanitize_html(html)
        log = NotificationLog(recipient_email=to_email, subject=subject, status="queued")
        self.repo.create(log)

        if settings.resend_api_key:
            resend.api_key = settings.resend_api_key
            try:
                resend.Emails.send(
                    {
                        "from": settings.email_from,
                        "to": [to_email],
                        "subject": subject,
                        "html": html,
                    }
                )
                log.status = "sent"
            except Exception as exc:
                logger.exception("Failed to send email: %s", exc)
                log.status = "failed"
        else:
            logger.info("Email transport not configured. To=%s Subject=%s Body=%s", to_email, subject, html)
            log.status = "skipped"

        self.session.add(log)
