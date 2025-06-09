# Fake News Detector - Backend API

This is the backend API for the Fake News Detector system, built with Flask and SQLAlchemy.

## Features

- RESTful API for flagging and retrieving fake news content
- User authentication with JWT
- API key authentication for Chrome extension
- Database models for users, flagged content, verifications, and statistics
- File upload for screenshots
- Statistics generation and retrieval

## Prerequisites

- Python 3.8+ and pip
- MySQL database

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/fake-news-detection.git
   cd fake-news-detection/website/backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` and update the values
   - Or set environment variables directly

### Database Setup

1. Create a MySQL database:
   ```
   mysql -u root -p
   CREATE DATABASE mydb;
   exit;
   ```

2. The application will automatically create the tables when it starts.

### Running the API

Start the development server:
```
python src/main.py
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/api-keys` - Get user's API keys
- `POST /api/auth/api-keys` - Create a new API key
- `DELETE /api/auth/api-keys/:id` - Delete an API key
- `POST /api/auth/validate-api-key` - Validate an API key

### Flagged Content

- `GET /api/flagged-content` - Get all flagged content (with pagination and filtering)
- `GET /api/flagged-content/:id` - Get flagged content by ID
- `POST /api/flagged-content` - Flag new content
- `PUT /api/flagged-content/:id` - Update flagged content (moderators only)
- `DELETE /api/flagged-content/:id` - Delete flagged content (moderators only)
- `GET /api/check-url?url=...` - Check if a URL has been flagged

### Verification

- `GET /api/verifications` - Get all verifications (moderators only)
- `GET /api/verifications/:id` - Get verification by ID (moderators only)
- `POST /api/verifications` - Create a new verification (moderators only)
- `PUT /api/verifications/:id` - Update a verification (moderators only)
- `DELETE /api/verifications/:id` - Delete a verification (admins only)

### Statistics

- `GET /api/statistics` - Get statistics over time
- `GET /api/statistics/summary` - Get summary statistics
- `POST /api/statistics/update` - Update statistics

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Authentication

The API uses two authentication methods:

1. **JWT Authentication** - For website users
   - Obtain a token via `/api/auth/login`
   - Include the token in the `Authorization` header: `Bearer <token>`

2. **API Key Authentication** - For Chrome extension
   - Create an API key via `/api/auth/api-keys`
   - Include the key in the `Authorization` header: `ApiKey <key>`

## Project Structure

```
backend/
├── venv/                  # Virtual environment
├── src/
│   ├── models/            # Database models
│   │   ├── __init__.py
│   │   ├── api_key.py
│   │   ├── flagged_content.py
│   │   ├── statistics.py
│   │   ├── user.py
│   │   └── verification.py
│   ├── routes/            # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── flagged_content.py
│   │   ├── statistics.py
│   │   ├── user.py
│   │   └── verification.py
│   ├── static/            # Static files
│   │   └── screenshots/   # Uploaded screenshots
│   └── main.py            # Main entry point
├── .env                   # Environment variables
└── requirements.txt       # Dependencies
```

## Deployment

### Production Setup

1. Update the `.env` file with production settings
2. Use a production WSGI server like Gunicorn:
   ```
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 'src.main:app'
   ```

3. Set up a reverse proxy with Nginx or Apache

### Docker Deployment

1. Build the Docker image:
   ```
   docker build -t fake-news-detector-api .
   ```

2. Run the container:
   ```
   docker run -p 5000:5000 -e DB_HOST=host.docker.internal fake-news-detector-api
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

[MIT License](LICENSE)

