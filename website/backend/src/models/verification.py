from datetime import datetime
from src.models.user import db

class Verification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50), nullable=False)  # pending, verified_fake, verified_misleading, verified_true
    notes = db.Column(db.Text, nullable=True)
    evidence_links = db.Column(db.Text, nullable=True)  # JSON array of links to evidence
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    flagged_content_id = db.Column(db.Integer, db.ForeignKey('flagged_content.id'), nullable=False)
    moderator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    flagged_content = db.relationship('FlaggedContent', backref='verifications')
    moderator = db.relationship('User')
    
    def __repr__(self):
        return f'<Verification {self.id}: {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'notes': self.notes,
            'evidence_links': self.evidence_links,
            'flagged_content_id': self.flagged_content_id,
            'moderator_id': self.moderator_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

