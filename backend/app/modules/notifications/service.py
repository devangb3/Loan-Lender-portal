from __future__ import annotations

import logging
import smtplib
import ssl
from email.message import EmailMessage

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
        provider = settings.email_provider.strip().lower()
        log = NotificationLog(recipient_email=to_email, subject=subject, provider=provider, status="queued")
        self.repo.create(log)

        try:
            if provider == "gmail":
                self._send_gmail(to_email=to_email, subject=subject, html=html)
                log.status = "sent"
            elif provider == "console":
                logger.info("Console email fallback. To=%s Subject=%s Body=%s", to_email, subject, html)
                log.status = "skipped"
            else:
                logger.warning("Unknown email provider '%s'. Use 'gmail' or 'console'. Falling back to console logging.", provider)
                logger.info("Console email fallback. To=%s Subject=%s Body=%s", to_email, subject, html)
                log.status = "skipped"
        except Exception as exc:
            logger.exception("Failed to send email via provider '%s': %s", provider, exc)
            log.status = "failed"

        self.session.add(log)

    def _build_message(self, to_email: str, subject: str, html: str) -> EmailMessage:
        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = settings.email_from
        message["To"] = to_email
        if settings.email_reply_to:
            message["Reply-To"] = settings.email_reply_to
        message.set_content("This message contains HTML content. Use an HTML-capable email client.")
        message.add_alternative(html, subtype="html")
        return message

    def _send_gmail(self, to_email: str, subject: str, html: str) -> None:
        if not settings.gmail_username or not settings.gmail_app_password:
            raise ValueError("Gmail provider selected but GMAIL_USERNAME or GMAIL_APP_PASSWORD missing")
        message = self._build_message(to_email=to_email, subject=subject, html=html)
        context = ssl.create_default_context()

        with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(settings.gmail_username, settings.gmail_app_password)
            smtp.send_message(message)
