# Fake News Detection System - Deployment Instructions

This document provides comprehensive instructions for deploying the Fake News Detection System, including the Chrome extension, website frontend, and backend API.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Website Frontend Deployment](#website-frontend-deployment)
4. [Chrome Extension Deployment](#chrome-extension-deployment)
5. [Database Setup](#database-setup)
6. [SSL Configuration](#ssl-configuration)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before beginning deployment, ensure you have the following:

### Server Requirements
- Linux server (Ubuntu 20.04 LTS or newer recommended)
- Minimum 2GB RAM, 1 CPU core
- 20GB storage
- Root or sudo access

### Software Requirements
- Docker and Docker Compose
- Nginx
- Let's Encrypt Certbot
- Git

### Domain and DNS
- Registered domain name
- DNS configured with the following records:
  - A record for main domain (e.g., `fakenewsdetector.example.com`)
  - A record for API subdomain (e.g., `api.fakenewsdetector.example.com`)

### Third-Party Services
- Email service provider (for user notifications)
- (Optional) Cloud storage service for screenshots and media

## Backend Deployment

### 1. Clone the Repository

```bash
# Create project directory
mkdir -p /var/www/fake-news-detection
cd /var/www/fake-news-detection

# Clone the repository
git clone https://github.com/example/fake-news-detection.git .
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Update the following variables in the `.env` file:

```
# Database configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_password
DB_HOST=db
DB_PORT=5432
DB_NAME=fake_news_detector

# JWT configuration
JWT_SECRET_KEY=your_secure_random_string
JWT_ACCESS_TOKEN_EXPIRES=86400  # 24 hours in seconds
JWT_REFRESH_TOKEN_EXPIRES=2592000  # 30 days in seconds

# Email configuration
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email_username
MAIL_PASSWORD=your_email_password
MAIL_DEFAULT_SENDER=noreply@fakenewsdetector.example.com

# API configuration
API_URL=https://api.fakenewsdetector.example.com
FRONTEND_URL=https://fakenewsdetector.example.com
```

### 3. Configure Docker Compose

Create or edit the `docker-compose.yml` file:

```yaml
version: '3'

services:
  backend:
    build: ./website/backend
    restart: always
    environment:
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=${DB_NAME}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - JWT_ACCESS_TOKEN_EXPIRES=${JWT_ACCESS_TOKEN_EXPIRES}
      - JWT_REFRESH_TOKEN_EXPIRES=${JWT_REFRESH_TOKEN_EXPIRES}
      - MAIL_SERVER=${MAIL_SERVER}
      - MAIL_PORT=${MAIL_PORT}
      - MAIL_USE_TLS=${MAIL_USE_TLS}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - MAIL_DEFAULT_SENDER=${MAIL_DEFAULT_SENDER}
      - API_URL=${API_URL}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads
    networks:
      - app-network

  frontend:
    build: ./website/frontend
    restart: always
    environment:
      - VITE_API_URL=${API_URL}
    depends_on:
      - backend
    networks:
      - app-network

  db:
    image: postgres:14
    restart: always
    environment:
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  nginx:
    image: nginx:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
      - frontend
    networks:
      - app-network

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

### 4. Configure Nginx

Create the Nginx configuration files:

```bash
mkdir -p nginx
```

Create `nginx/api.conf`:

```nginx
server {
    listen 80;
    server_name api.fakenewsdetector.example.com;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.fakenewsdetector.example.com;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/api.fakenewsdetector.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.fakenewsdetector.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase max upload size for screenshots
    client_max_body_size 10M;
}
```

Create `nginx/frontend.conf`:

```nginx
server {
    listen 80;
    server_name fakenewsdetector.example.com;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name fakenewsdetector.example.com;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/fakenewsdetector.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fakenewsdetector.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Initialize SSL Certificates

```bash
# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Start nginx temporarily
docker-compose up -d nginx

# Get SSL certificates
docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d fakenewsdetector.example.com -d api.fakenewsdetector.example.com \
  --email admin@fakenewsdetector.example.com --agree-tos --no-eff-email

# Stop nginx
docker-compose down
```

### 6. Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# Check if services are running
docker-compose ps
```

### 7. Initialize the Database

```bash
# Run database migrations and seed data
docker-compose exec backend python src/seed_db.py
```

## Website Frontend Deployment

The website frontend is deployed as part of the Docker Compose setup above. However, if you need to deploy it separately:

### 1. Build the Frontend

```bash
cd /var/www/fake-news-detection/website/frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=https://api.fakenewsdetector.example.com" > .env

# Build the project
npm run build
```

### 2. Deploy to Web Server

```bash
# Copy build files to web server directory
cp -r dist/* /var/www/html/
```

### 3. Configure Web Server

If using Nginx directly (without Docker):

```nginx
server {
    listen 80;
    server_name fakenewsdetector.example.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Chrome Extension Deployment

### 1. Build the Extension

```bash
cd /var/www/fake-news-detection/chrome-extension

# Install dependencies
npm install

# Update API URL in config
sed -i 's|https://api.fakenewsdetection.example.com|https://api.fakenewsdetector.example.com|g' background/background.js

# Build the extension
npm run build
```

### 2. Package the Extension

```bash
# Create a zip file for the Chrome Web Store
npm run package
```

This will create a `fake-news-detector.zip` file in the `dist` directory.

### 3. Upload to Chrome Web Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Click "New Item"
4. Upload the `fake-news-detector.zip` file
5. Fill in the required information:
   - Store listing (name, description, screenshots)
   - Privacy practices
   - Distribution settings
6. Submit for review

### 4. Alternative: Local Installation for Testing

For testing or internal use, the extension can be installed locally:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `dist` directory of the built extension

## Database Setup

The database is automatically set up when using Docker Compose. However, for manual setup:

### 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Create Database and User

```bash
sudo -u postgres psql

# In PostgreSQL prompt
CREATE DATABASE fake_news_detector;
CREATE USER your_db_username WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE fake_news_detector TO your_db_username;
\q
```

### 3. Configure Database Connection

Update the `.env` file with your database credentials:

```
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fake_news_detector
```

### 4. Run Migrations

```bash
cd /var/www/fake-news-detection/website/backend
source venv/bin/activate
python src/seed_db.py
```

## SSL Configuration

SSL certificates are managed by Certbot in the Docker Compose setup. For manual setup:

### 1. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificates

```bash
sudo certbot --nginx -d fakenewsdetector.example.com -d api.fakenewsdetector.example.com
```

### 3. Auto-Renewal

Certbot automatically creates a renewal cron job. Verify with:

```bash
sudo systemctl list-timers
```

## Monitoring and Maintenance

### 1. Log Monitoring

```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

### 2. Database Backup

```bash
# Create a backup script
cat > /var/www/fake-news-detection/backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/www/fake-news-detection/backups"
mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec -T db pg_dump -U $DB_USERNAME $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Uploads backup
tar -czf $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz -C /var/www/fake-news-detection uploads

# Rotate backups (keep last 7 days)
find $BACKUP_DIR -name "db_backup_*" -type f -mtime +7 -delete
find $BACKUP_DIR -name "uploads_backup_*" -type f -mtime +7 -delete
EOF

# Make the script executable
chmod +x /var/www/fake-news-detection/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/fake-news-detection/backup.sh") | crontab -
```

### 3. System Updates

```bash
# Update the codebase
cd /var/www/fake-news-detection
git pull

# Rebuild and restart services
docker-compose build
docker-compose up -d
```

### 4. SSL Certificate Renewal

SSL certificates are automatically renewed by Certbot. To manually trigger renewal:

```bash
docker-compose run --rm certbot renew
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if database container is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Connect to database directly
docker-compose exec db psql -U your_db_username -d fake_news_detector
```

### API Not Responding

```bash
# Check API logs
docker-compose logs backend

# Restart API service
docker-compose restart backend

# Check if API is accessible
curl -I https://api.fakenewsdetector.example.com/api/statistics/summary
```

### Frontend Issues

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### SSL Certificate Issues

```bash
# Check Nginx configuration
docker-compose exec nginx nginx -t

# Check certificate expiration
docker-compose exec nginx openssl x509 -dates -in /etc/letsencrypt/live/fakenewsdetector.example.com/fullchain.pem
```

### Container Resource Issues

```bash
# Check container resource usage
docker stats

# Increase container resources if needed (edit docker-compose.yml)
```

---

For additional support, please contact the development team at support@fakenewsdetector.example.com or open an issue on the project's GitHub repository.

