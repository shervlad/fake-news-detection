from datetime import datetime
from src.models.user import db

class FlaggedContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2048), nullable=False)
    title = db.Column(db.String(255), nullable=True)
    content_type = db.Column(db.String(50), nullable=False)  # article, social_post, video, image, advertisement
    platform = db.Column(db.String(100), nullable=True)  # Facebook, Twitter, etc.
    description = db.Column(db.Text, nullable=True)
    screenshot_path = db.Column(db.String(255), nullable=True)
    verification_status = db.Column(db.String(50), default='pending')  # pending, verified_fake, verified_misleading, verified_true
    flag_count = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    flags = db.relationship('Flag', backref='flagged_content', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<FlaggedContent {self.id}: {self.url}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'title': self.title,
            'content_type': self.content_type,
            'platform': self.platform,
            'description': self.description,
            'screenshot_path': self.screenshot_path,
            'verification_status': self.verification_status,
            'flag_count': self.flag_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Flag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reason = db.Column(db.String(100), nullable=False)  # fake_news, misleading, outdated, etc.
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    flagged_content_id = db.Column(db.Integer, db.ForeignKey('flagged_content.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Can be null for anonymous flags
    
    def __repr__(self):
        return f'<Flag {self.id}: {self.reason}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'reason': self.reason,
            'details': self.details,
            'flagged_content_id': self.flagged_content_id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

