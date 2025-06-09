from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.flagged_content import flagged_content_bp
from src.routes.verification import verification_bp
from src.routes.statistics import statistics_bp
from src.routes.google_auth import google_auth_bp

__all__ = [
    'user_bp',
    'auth_bp',
    'flagged_content_bp',
    'verification_bp',
    'statistics_bp',
    'google_auth_bp'
]

