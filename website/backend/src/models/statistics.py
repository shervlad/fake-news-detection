from datetime import datetime
from src.models.user import db

class Statistics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, default=datetime.utcnow().date, unique=True)
    total_flags = db.Column(db.Integer, default=0)
    total_users = db.Column(db.Integer, default=0)
    total_verified_fake = db.Column(db.Integer, default=0)
    total_verified_misleading = db.Column(db.Integer, default=0)
    total_verified_true = db.Column(db.Integer, default=0)
    total_pending = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<Statistics {self.date}: {self.total_flags} flags>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'total_flags': self.total_flags,
            'total_users': self.total_users,
            'total_verified_fake': self.total_verified_fake,
            'total_verified_misleading': self.total_verified_misleading,
            'total_verified_true': self.total_verified_true,
            'total_pending': self.total_pending
        }

