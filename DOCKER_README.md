# Docker Deployment for Fake News Detection System

This guide explains how to deploy the entire Fake News Detection System using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0.0 or higher)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/example/fake-news-detection.git
   cd fake-news-detection
   ```

2. (Optional) Modify the `.env` file to customize environment variables:
   ```bash
   # Edit the .env file with your preferred settings
   nano .env
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. Initialize the database (first time only):
   ```bash
   docker-compose exec backend python src/seed_db.py
   ```

5. Access the services:
   - Website Frontend: http://localhost:80
   - Backend API: http://localhost:5000
   - PgAdmin (Database Management): http://localhost:5050
     - Login with email: admin@example.com, password: admin (or as configured in .env)

## Services

The Docker Compose setup includes the following services:

### Backend API

- Built from `./website/backend/Dockerfile`
- Runs the Flask API server
- Exposes port 5000
- Connects to the PostgreSQL database
- Stores uploaded files in a persistent volume

### Website Frontend

- Built from `./website/frontend/Dockerfile`
- Serves the React application using Nginx
- Exposes port 80
- Configured to work with the Backend API

### Database

- Uses PostgreSQL 14 Alpine image
- Stores data in a persistent volume
- Exposes port 5432 (can be restricted in production)

### PgAdmin (Optional)

- Web-based PostgreSQL administration tool
- Useful for database management and debugging
- Can be removed in production if not needed

## Environment Variables

The following environment variables can be configured in the `.env` file:

- `DB_USERNAME`: PostgreSQL username (default: root)
- `DB_PASSWORD`: PostgreSQL password (default: password)
- `DB_NAME`: PostgreSQL database name (default: fake_news_detector)
- `JWT_SECRET_KEY`: Secret key for JWT token generation (change in production!)
- `PGADMIN_EMAIL`: PgAdmin login email (default: admin@example.com)
- `PGADMIN_PASSWORD`: PgAdmin login password (default: admin)

## Production Deployment

For production deployment, make the following changes:

1. Update the `.env` file with secure credentials:
   ```
   DB_USERNAME=secure_username
   DB_PASSWORD=strong_secure_password
   JWT_SECRET_KEY=random_secure_string
   ```

2. Configure proper SSL/TLS:
   - Add a reverse proxy like Nginx or Traefik
   - Set up SSL certificates (Let's Encrypt recommended)

3. Restrict database access:
   - Remove the port mapping for the database in `docker-compose.yml`
   - Use a more restrictive network configuration

4. Set up proper logging and monitoring

## Troubleshooting

### Container Logs

View logs for a specific service:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Database Connection Issues

If the backend can't connect to the database:
```bash
# Check if database container is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Connect to database directly
docker-compose exec db psql -U root -d fake_news_detector
```

### Rebuilding Services

If you make changes to the code:
```bash
# Rebuild and restart a specific service
docker-compose build backend
docker-compose up -d backend

# Or rebuild all services
docker-compose build
docker-compose up -d
```

### Data Persistence

Data is stored in Docker volumes:
- `postgres_data`: Database files
- `backend_uploads`: Uploaded files (screenshots, etc.)

List volumes:
```bash
docker volume ls
```

## Chrome Extension

The Chrome extension is not included in the Docker setup as it runs in the browser. To use the Chrome extension:

1. Build the extension:
   ```bash
   cd chrome-extension
   npm install
   npm run build
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

3. Update the API URL in the extension to point to your deployed backend API.

