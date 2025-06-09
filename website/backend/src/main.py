import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import timedelta
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from src.models import db
from src.routes import user_bp, auth_bp, flagged_content_bp, verification_bp, statistics_bp
from src.routes.google_auth import google_auth_bp, oauth

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure session
app.secret_key = os.getenv('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Initialize OAuth
oauth.init_app(app)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(flagged_content_bp, url_prefix='/api')
app.register_blueprint(verification_bp, url_prefix='/api')
app.register_blueprint(statistics_bp, url_prefix='/api')
app.register_blueprint(google_auth_bp, url_prefix='/api/auth')

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'fake_news_detector')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()
    
    # Create screenshots directory
    screenshots_dir = os.path.join(app.static_folder, 'screenshots')
    os.makedirs(screenshots_dir, exist_ok=True)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

