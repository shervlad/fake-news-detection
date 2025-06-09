from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.models import db, User, ApiKey

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if required fields are present
    if not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    # Create new user
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Check if required fields are present
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            'username': user.username,
            'email': user.email,
            'role': user.role
        },
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/api-keys', methods=['GET'])
@jwt_required()
def get_api_keys():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    api_keys = ApiKey.query.filter_by(user_id=user.id).all()
    
    return jsonify([api_key.to_dict() for api_key in api_keys]), 200

@auth_bp.route('/api-keys', methods=['POST'])
@jwt_required()
def create_api_key():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    data = request.json
    
    # Check if required fields are present
    if 'name' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new API key
    api_key = ApiKey(name=data['name'], user_id=user.id)
    
    db.session.add(api_key)
    db.session.commit()
    
    return jsonify({
        'message': 'API key created successfully',
        'api_key': {
            **api_key.to_dict(),
            'key': api_key.key  # Only return the key when it's first created
        }
    }), 201

@auth_bp.route('/api-keys/<int:api_key_id>', methods=['DELETE'])
@jwt_required()
def delete_api_key(api_key_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    api_key = ApiKey.query.get_or_404(api_key_id)
    
    # Check if the API key belongs to the user
    if api_key.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(api_key)
    db.session.commit()
    
    return '', 204

@auth_bp.route('/validate-api-key', methods=['POST'])
def validate_api_key():
    data = request.json
    
    # Check if required fields are present
    if 'api_key' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Find API key
    api_key = ApiKey.query.filter_by(key=data['api_key'], is_active=True).first()
    
    # Check if API key exists
    if not api_key:
        return jsonify({'error': 'Invalid API key'}), 401
    
    # Update last used time
    api_key.last_used_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'valid': True}), 200

