from datetime import datetime
import os
import uuid
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from src.models import db, FlaggedContent, Flag, User, ApiKey

flagged_content_bp = Blueprint('flagged_content', __name__)

# Helper function to check if API key is valid
def validate_api_key():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('ApiKey '):
        return None
    
    api_key_value = auth_header.split(' ')[1]
    api_key = ApiKey.query.filter_by(key=api_key_value, is_active=True).first()
    
    if api_key:
        # Update last used time
        api_key.last_used_at = datetime.utcnow()
        db.session.commit()
        return api_key
    
    return None

# Helper function to save screenshot
def save_screenshot(file):
    if not file:
        return None
    
    # Create screenshots directory if it doesn't exist
    screenshots_dir = os.path.join(current_app.static_folder, 'screenshots')
    os.makedirs(screenshots_dir, exist_ok=True)
    
    # Generate unique filename
    filename = str(uuid.uuid4()) + secure_filename(file.filename)
    file_path = os.path.join(screenshots_dir, filename)
    
    # Save file
    file.save(file_path)
    
    # Return relative path
    return os.path.join('screenshots', filename)

@flagged_content_bp.route('/flagged-content', methods=['GET'])
def get_flagged_content():
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)  # Limit to 100 items per page
    content_type = request.args.get('content_type')
    verification_status = request.args.get('verification_status')
    search_query = request.args.get('q')
    
    # Build query
    query = FlaggedContent.query
    
    # Apply filters
    if content_type:
        query = query.filter(FlaggedContent.content_type == content_type)
    
    if verification_status:
        query = query.filter(FlaggedContent.verification_status == verification_status)
    
    if search_query:
        query = query.filter(
            (FlaggedContent.url.ilike(f'%{search_query}%')) |
            (FlaggedContent.title.ilike(f'%{search_query}%')) |
            (FlaggedContent.description.ilike(f'%{search_query}%'))
        )
    
    # Order by created_at (newest first)
    query = query.order_by(FlaggedContent.created_at.desc())
    
    # Paginate results
    paginated_results = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Prepare response
    return jsonify({
        'items': [item.to_dict() for item in paginated_results.items],
        'total': paginated_results.total,
        'pages': paginated_results.pages,
        'page': page,
        'per_page': per_page
    }), 200

@flagged_content_bp.route('/flagged-content/<int:content_id>', methods=['GET'])
def get_flagged_content_by_id(content_id):
    flagged_content = FlaggedContent.query.get_or_404(content_id)
    
    # Get flags for this content
    flags = Flag.query.filter_by(flagged_content_id=content_id).all()
    
    # Prepare response
    response = flagged_content.to_dict()
    response['flags'] = [flag.to_dict() for flag in flags]
    
    return jsonify(response), 200

@flagged_content_bp.route('/flagged-content', methods=['POST'])
def create_flagged_content():
    # Check if request has JSON data or form data
    if request.is_json:
        data = request.json
    else:
        data = request.form.to_dict()
    
    # Check if required fields are present
    if 'url' not in data or 'content_type' not in data or 'reason' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if API key is provided
    api_key = validate_api_key()
    user_id = None
    
    # If API key is valid and associated with a user, use that user
    if api_key and api_key.user_id:
        user_id = api_key.user_id
    
    # Check if content already exists
    existing_content = FlaggedContent.query.filter_by(url=data['url']).first()
    
    if existing_content:
        # Content already exists, add a new flag
        flag = Flag(
            reason=data['reason'],
            details=data.get('details'),
            flagged_content_id=existing_content.id,
            user_id=user_id
        )
        
        # Increment flag count
        existing_content.flag_count += 1
        
        db.session.add(flag)
        db.session.commit()
        
        return jsonify({
            'message': 'Content already flagged, added your flag',
            'flagged_content': existing_content.to_dict(),
            'flag': flag.to_dict()
        }), 200
    
    # Process screenshot if provided
    screenshot_path = None
    if 'screenshot' in request.files:
        screenshot_path = save_screenshot(request.files['screenshot'])
    
    # Create new flagged content
    flagged_content = FlaggedContent(
        url=data['url'],
        title=data.get('title'),
        content_type=data['content_type'],
        platform=data.get('platform'),
        description=data.get('description'),
        screenshot_path=screenshot_path
    )
    
    db.session.add(flagged_content)
    db.session.flush()  # Get ID without committing
    
    # Create flag
    flag = Flag(
        reason=data['reason'],
        details=data.get('details'),
        flagged_content_id=flagged_content.id,
        user_id=user_id
    )
    
    db.session.add(flag)
    db.session.commit()
    
    return jsonify({
        'message': 'Content flagged successfully',
        'flagged_content': flagged_content.to_dict(),
        'flag': flag.to_dict()
    }), 201

@flagged_content_bp.route('/flagged-content/<int:content_id>', methods=['PUT'])
@jwt_required()
def update_flagged_content(content_id):
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    flagged_content = FlaggedContent.query.get_or_404(content_id)
    data = request.json
    
    # Update fields
    if 'title' in data:
        flagged_content.title = data['title']
    
    if 'content_type' in data:
        flagged_content.content_type = data['content_type']
    
    if 'platform' in data:
        flagged_content.platform = data['platform']
    
    if 'description' in data:
        flagged_content.description = data['description']
    
    if 'verification_status' in data:
        flagged_content.verification_status = data['verification_status']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Content updated successfully',
        'flagged_content': flagged_content.to_dict()
    }), 200

@flagged_content_bp.route('/flagged-content/<int:content_id>', methods=['DELETE'])
@jwt_required()
def delete_flagged_content(content_id):
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    flagged_content = FlaggedContent.query.get_or_404(content_id)
    
    # Delete screenshot if exists
    if flagged_content.screenshot_path:
        screenshot_path = os.path.join(current_app.static_folder, flagged_content.screenshot_path)
        if os.path.exists(screenshot_path):
            os.remove(screenshot_path)
    
    db.session.delete(flagged_content)
    db.session.commit()
    
    return '', 204

@flagged_content_bp.route('/check-url', methods=['GET'])
def check_url():
    url = request.args.get('url')
    
    if not url:
        return jsonify({'error': 'URL parameter is required'}), 400
    
    # Find content by URL
    flagged_content = FlaggedContent.query.filter_by(url=url).first()
    
    if not flagged_content:
        return jsonify({'flagged': False}), 200
    
    return jsonify({
        'flagged': True,
        'content': flagged_content.to_dict()
    }), 200

