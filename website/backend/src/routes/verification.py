import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.models import db, Verification, FlaggedContent, User

verification_bp = Blueprint('verification', __name__)

@verification_bp.route('/verifications', methods=['GET'])
@jwt_required()
def get_verifications():
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)  # Limit to 100 items per page
    flagged_content_id = request.args.get('flagged_content_id', type=int)
    
    # Build query
    query = Verification.query
    
    # Apply filters
    if flagged_content_id:
        query = query.filter(Verification.flagged_content_id == flagged_content_id)
    
    # Order by created_at (newest first)
    query = query.order_by(Verification.created_at.desc())
    
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

@verification_bp.route('/verifications/<int:verification_id>', methods=['GET'])
@jwt_required()
def get_verification_by_id(verification_id):
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    verification = Verification.query.get_or_404(verification_id)
    
    return jsonify(verification.to_dict()), 200

@verification_bp.route('/verifications', methods=['POST'])
@jwt_required()
def create_verification():
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    
    # Check if required fields are present
    if not all(k in data for k in ['flagged_content_id', 'status']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if flagged content exists
    flagged_content = FlaggedContent.query.get_or_404(data['flagged_content_id'])
    
    # Get moderator ID
    moderator_id = get_jwt_identity()
    
    # Process evidence links
    evidence_links = None
    if 'evidence_links' in data and data['evidence_links']:
        if isinstance(data['evidence_links'], list):
            evidence_links = json.dumps(data['evidence_links'])
        else:
            evidence_links = data['evidence_links']
    
    # Create verification
    verification = Verification(
        status=data['status'],
        notes=data.get('notes'),
        evidence_links=evidence_links,
        flagged_content_id=data['flagged_content_id'],
        moderator_id=moderator_id
    )
    
    # Update flagged content status
    flagged_content.verification_status = data['status']
    
    db.session.add(verification)
    db.session.commit()
    
    return jsonify({
        'message': 'Verification created successfully',
        'verification': verification.to_dict()
    }), 201

@verification_bp.route('/verifications/<int:verification_id>', methods=['PUT'])
@jwt_required()
def update_verification(verification_id):
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    verification = Verification.query.get_or_404(verification_id)
    data = request.json
    
    # Update fields
    if 'status' in data:
        verification.status = data['status']
        
        # Update flagged content status
        flagged_content = FlaggedContent.query.get(verification.flagged_content_id)
        if flagged_content:
            flagged_content.verification_status = data['status']
    
    if 'notes' in data:
        verification.notes = data['notes']
    
    if 'evidence_links' in data:
        if isinstance(data['evidence_links'], list):
            verification.evidence_links = json.dumps(data['evidence_links'])
        else:
            verification.evidence_links = data['evidence_links']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Verification updated successfully',
        'verification': verification.to_dict()
    }), 200

@verification_bp.route('/verifications/<int:verification_id>', methods=['DELETE'])
@jwt_required()
def delete_verification(verification_id):
    # Check user role
    claims = get_jwt()
    if claims.get('role') not in ['admin']:  # Only admins can delete verifications
        return jsonify({'error': 'Unauthorized'}), 403
    
    verification = Verification.query.get_or_404(verification_id)
    
    db.session.delete(verification)
    db.session.commit()
    
    return '', 204

