from flask import Blueprint, request, redirect, url_for, jsonify, current_app, session
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_oauthlib.client import OAuth
import os
from datetime import datetime, timedelta
from src.models.user import db, User

google_auth_bp = Blueprint('google_auth', __name__)

# Initialize OAuth
oauth = OAuth()

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
GOOGLE_CALLBACK_URL = os.environ.get('GOOGLE_CALLBACK_URL', 'http://localhost:5000/api/auth/google/callback')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:80')

# Configure Google OAuth client
google = oauth.remote_app(
    'google',
    consumer_key=GOOGLE_CLIENT_ID,
    consumer_secret=GOOGLE_CLIENT_SECRET,
    request_token_params={
        'scope': 'email profile'
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

@google_auth_bp.route('/google/login')
def google_login():
    """
    Initiates the Google OAuth flow
    """
    # Store the next URL for redirection after authentication
    session['next_url'] = request.args.get('next') or FRONTEND_URL
    
    # Generate a unique state token to prevent CSRF
    state = os.urandom(16).hex()
    session['oauth_state'] = state
    
    # Redirect to Google's OAuth page
    callback_url = GOOGLE_CALLBACK_URL
    return jsonify({
        "auth_url": google.authorize(callback=callback_url, state=state)
    })

@google_auth_bp.route('/google/callback')
def google_callback():
    """
    Handles the callback from Google OAuth
    """
    # Verify state token to prevent CSRF
    state = request.args.get('state')
    stored_state = session.pop('oauth_state', None)
    
    if not state or state != stored_state:
        return redirect(f"{FRONTEND_URL}/login?error=Invalid authentication state")
    
    # Get the response from Google
    resp = google.authorized_response()
    
    if resp is None or resp.get('access_token') is None:
        error_reason = request.args.get('error', 'Unknown error')
        return redirect(f"{FRONTEND_URL}/login?error={error_reason}")
    
    # Store the token in the session
    session['google_token'] = (resp['access_token'], '')
    
    # Get user info from Google
    user_info = google.get('userinfo')
    if user_info.status != 200:
        return redirect(f"{FRONTEND_URL}/login?error=Failed to get user info from Google")
    
    user_data = user_info.data
    
    # Get user info
    email = user_data.get('email')
    if not email:
        return redirect(f"{FRONTEND_URL}/login?error=No email provided by Google")
    
    # Check if email is verified
    if not user_data.get('verified_email', False):
        return redirect(f"{FRONTEND_URL}/login?error=Email not verified with Google")
    
    name = user_data.get('name', email.split('@')[0])
    picture = user_data.get('picture')
    
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create a new user
        user = User(
            username=name,
            email=email,
            password_hash="google_oauth_user",  # No password for OAuth users
            role="user",
            profile_image=picture
        )
        db.session.add(user)
        db.session.commit()
    
    # Create JWT tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    # Redirect to frontend with tokens
    return redirect(f"{FRONTEND_URL}/oauth-callback?access_token={access_token}&refresh_token={refresh_token}")

@google.tokengetter
def get_google_oauth_token():
    """
    Returns the OAuth token
    """
    return session.get('google_token')

