from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from src.models import db, Statistics, FlaggedContent, User, Flag

statistics_bp = Blueprint('statistics', __name__)

@statistics_bp.route('/statistics', methods=['GET'])
def get_statistics():
    # Get query parameters
    days = request.args.get('days', 30, type=int)
    
    # Limit days to prevent excessive queries
    days = min(days, 365)
    
    # Calculate start date
    start_date = datetime.utcnow().date() - timedelta(days=days)
    
    # Get statistics for the specified period
    stats = Statistics.query.filter(Statistics.date >= start_date).order_by(Statistics.date).all()
    
    # If no statistics are available, generate them
    if not stats:
        # Get the latest statistics
        latest_stats = Statistics.query.order_by(Statistics.date.desc()).first()
        
        if not latest_stats:
            # If no statistics exist, create initial statistics
            update_statistics()
            stats = Statistics.query.filter(Statistics.date >= start_date).order_by(Statistics.date).all()
    
    return jsonify([stat.to_dict() for stat in stats]), 200

@statistics_bp.route('/statistics/summary', methods=['GET'])
def get_statistics_summary():
    # Get the latest statistics
    latest_stats = Statistics.query.order_by(Statistics.date.desc()).first()
    
    if not latest_stats:
        # If no statistics exist, create initial statistics
        update_statistics()
        latest_stats = Statistics.query.order_by(Statistics.date.desc()).first()
    
    # Calculate growth rates (last 7 days)
    seven_days_ago = datetime.utcnow().date() - timedelta(days=7)
    old_stats = Statistics.query.filter(Statistics.date <= seven_days_ago).order_by(Statistics.date.desc()).first()
    
    growth_rates = {}
    if old_stats:
        growth_rates = {
            'flags_growth': calculate_growth_rate(old_stats.total_flags, latest_stats.total_flags),
            'users_growth': calculate_growth_rate(old_stats.total_users, latest_stats.total_users),
            'verified_fake_growth': calculate_growth_rate(old_stats.total_verified_fake, latest_stats.total_verified_fake),
            'verified_misleading_growth': calculate_growth_rate(old_stats.total_verified_misleading, latest_stats.total_verified_misleading)
        }
    
    # Get platform distribution
    platforms = db.session.query(
        FlaggedContent.platform,
        func.count(FlaggedContent.id).label('count')
    ).group_by(FlaggedContent.platform).all()
    
    platform_distribution = {platform: count for platform, count in platforms if platform}
    
    # Get content type distribution
    content_types = db.session.query(
        FlaggedContent.content_type,
        func.count(FlaggedContent.id).label('count')
    ).group_by(FlaggedContent.content_type).all()
    
    content_type_distribution = {content_type: count for content_type, count in content_types}
    
    # Get verification status distribution
    verification_statuses = db.session.query(
        FlaggedContent.verification_status,
        func.count(FlaggedContent.id).label('count')
    ).group_by(FlaggedContent.verification_status).all()
    
    verification_status_distribution = {status: count for status, count in verification_statuses}
    
    return jsonify({
        'latest_stats': latest_stats.to_dict() if latest_stats else None,
        'growth_rates': growth_rates,
        'platform_distribution': platform_distribution,
        'content_type_distribution': content_type_distribution,
        'verification_status_distribution': verification_status_distribution
    }), 200

@statistics_bp.route('/statistics/update', methods=['POST'])
def update_statistics_endpoint():
    update_statistics()
    return jsonify({'message': 'Statistics updated successfully'}), 200

def calculate_growth_rate(old_value, new_value):
    if old_value == 0:
        return 100 if new_value > 0 else 0
    
    return ((new_value - old_value) / old_value) * 100

def update_statistics():
    today = datetime.utcnow().date()
    
    # Check if statistics for today already exist
    existing_stats = Statistics.query.filter_by(date=today).first()
    
    if existing_stats:
        stats = existing_stats
    else:
        stats = Statistics(date=today)
    
    # Update statistics
    stats.total_flags = Flag.query.count()
    stats.total_users = User.query.count()
    stats.total_verified_fake = FlaggedContent.query.filter_by(verification_status='verified_fake').count()
    stats.total_verified_misleading = FlaggedContent.query.filter_by(verification_status='verified_misleading').count()
    stats.total_verified_true = FlaggedContent.query.filter_by(verification_status='verified_true').count()
    stats.total_pending = FlaggedContent.query.filter_by(verification_status='pending').count()
    
    db.session.add(stats)
    db.session.commit()
    
    return stats

