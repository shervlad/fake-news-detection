# Fake News Detection System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Chrome Extension](#chrome-extension)
4. [Website Frontend](#website-frontend)
5. [Backend API](#backend-api)
6. [Database Schema](#database-schema)
7. [Authentication and Security](#authentication-and-security)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)
10. [Performance Considerations](#performance-considerations)
11. [Future Enhancements](#future-enhancements)

## System Overview

The Fake News Detection System is a comprehensive solution designed to combat misinformation online through community participation and expert verification. The system consists of three main components:

1. **Chrome Extension**: Allows users to flag potentially misleading content from any website or social media platform and receive real-time alerts about previously flagged content.

2. **Website Frontend**: Provides a platform for content submission, browsing flagged content, user account management, and system administration.

3. **Backend API**: Handles data storage, content verification workflows, authentication, and serves as the central hub connecting the extension and website.

These components work together to create a robust ecosystem for identifying, verifying, and alerting users about online misinformation.

## Architecture

### High-Level Architecture

The system follows a modern, scalable architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Chrome         │     │  Website        │     │  Admin          │
│  Extension      │     │  Frontend       │     │  Dashboard      │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        REST API Layer                           │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      Application Logic                          │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        Database Layer                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

The system is built using the following technologies:

**Chrome Extension:**
- Manifest V3
- HTML/CSS/JavaScript
- Chrome Extension APIs

**Website Frontend:**
- React.js
- React Router for navigation
- Shadcn UI components
- Tailwind CSS for styling

**Backend API:**
- Flask (Python)
- SQLAlchemy ORM
- JWT for authentication
- RESTful API design

**Database:**
- SQLite (development)
- PostgreSQL (production)

**Deployment:**
- Docker containers
- Nginx as reverse proxy
- HTTPS with Let's Encrypt

## Chrome Extension

### Directory Structure

```
chrome-extension/
├── manifest.json        # Extension configuration
├── background/          # Background service worker
│   └── background.js    # Main background script
├── content/             # Content scripts
│   ├── content.js       # Main content script
│   └── content.css      # Content styles
├── popup/               # Popup UI
│   ├── popup.html       # Popup HTML
│   ├── popup.js         # Popup logic
│   └── popup.css        # Popup styles
├── options/             # Options page
│   ├── options.html     # Options HTML
│   ├── options.js       # Options logic
│   └── options.css      # Options styles
└── images/              # Extension icons and images
```

### Key Components

#### Manifest.json

The manifest.json file defines the extension's metadata, permissions, and components:

```json
{
  "manifest_version": 3,
  "name": "Fake News Detector",
  "version": "1.0.0",
  "description": "Detect and flag fake news and misinformation across the web",
  "permissions": [
    "storage",
    "activeTab",
    "contextMenus",
    "alarms"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background/background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content.js"],
      "css": ["content/content.css"]
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "options_page": "options/options.html",
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}
```

#### Background Service Worker

The background service worker (background.js) handles:
- API communication with the backend
- Database synchronization
- URL checking against flagged content
- Alert triggering
- Context menu creation
- Alarm scheduling for periodic sync

#### Content Script

The content script (content.js) is injected into web pages to:
- Display alerts for flagged content
- Add UI elements for flagging
- Highlight specific misleading content
- Communicate with the background service worker

#### Popup UI

The popup UI provides:
- Current page status
- Quick flagging interface
- Recent activity summary
- Settings access
- Account management

### Communication Flow

1. **Content Detection**:
   - Background worker checks URLs against local cache
   - If not in cache, queries backend API
   - Sends message to content script if flagged

2. **User Flagging**:
   - User flags content via popup or context menu
   - Data sent to background worker
   - Background worker sends to backend API
   - Response updates local cache

3. **Synchronization**:
   - Periodic sync via alarms API
   - Fetches latest flagged content from API
   - Updates local cache
   - Refreshes active tabs if needed

## Website Frontend

### Directory Structure

```
website/frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # UI components
│   │   ├── home/        # Home page components
│   │   └── submission/  # Submission form components
│   ├── contexts/        # React contexts
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

### Key Components

#### Page Components

The website consists of several key pages:

- **HomePage**: Landing page with project overview and key statistics
- **SubmissionPage**: Form for submitting potentially misleading content
- **BrowsePage**: Interface for searching and browsing flagged content
- **AboutPage**: Information about the project and methodology
- **ExtensionPage**: Information and download link for the Chrome extension
- **AccountPages**: Login, registration, and profile management

#### Context Providers

- **AuthContext**: Manages authentication state and user information
- **ThemeContext**: Handles theme preferences (light/dark mode)
- **NotificationContext**: Manages system notifications

#### Services

- **api.js**: Central service for API communication
- **auth.js**: Authentication service
- **storage.js**: Local storage service

### Routing

The application uses React Router for navigation:

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="submit" element={<SubmissionPage />} />
    <Route path="browse" element={<BrowsePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="extension" element={<ExtensionPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="*" element={<NotFoundPage />} />
    
    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="profile" element={<ProfilePage />} />
      <Route path="submissions" element={<UserSubmissionsPage />} />
    </Route>
    
    {/* Admin routes */}
    <Route element={<AdminRoute />}>
      <Route path="admin/*" element={<AdminRoutes />} />
    </Route>
  </Route>
</Routes>
```

### State Management

The application uses React's Context API for global state management:

- User authentication state
- Theme preferences
- Notifications
- Form state (for multi-step forms)

For component-specific state, React's useState and useReducer hooks are used.

## Backend API

### Directory Structure

```
website/backend/
├── src/
│   ├── models/          # Database models
│   │   ├── user.py
│   │   ├── flagged_content.py
│   │   ├── verification.py
│   │   ├── statistics.py
│   │   └── api_key.py
│   ├── routes/          # API routes
│   │   ├── auth.py
│   │   ├── flagged_content.py
│   │   ├── verification.py
│   │   ├── statistics.py
│   │   └── user.py
│   ├── static/          # Static files
│   ├── main.py          # Application entry point
│   └── seed_db.py       # Database seeding script
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

### API Design

The backend follows RESTful API design principles:

- Resource-based URLs
- Appropriate HTTP methods (GET, POST, PUT, DELETE)
- Consistent error handling
- Pagination for list endpoints
- Filtering and sorting options
- JWT authentication

### Key Endpoints

#### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate and receive JWT token
- `POST /api/auth/refresh`: Refresh JWT token
- `POST /api/auth/logout`: Invalidate JWT token

#### Flagged Content

- `GET /api/flagged-content`: List flagged content with pagination and filters
- `GET /api/flagged-content/{id}`: Get details of specific flagged content
- `POST /api/flagged-content`: Submit new potentially misleading content
- `PUT /api/flagged-content/{id}`: Update flagged content (admin only)
- `DELETE /api/flagged-content/{id}`: Delete flagged content (admin only)

#### Verification

- `POST /api/flagged-content/{id}/verify`: Submit verification for content
- `GET /api/verification/{id}`: Get verification details
- `PUT /api/verification/{id}`: Update verification (admin only)

#### User Management

- `GET /api/user/profile`: Get current user profile
- `PUT /api/user/profile`: Update user profile
- `GET /api/user/submissions`: List current user's submissions

#### Statistics

- `GET /api/statistics/summary`: Get overall system statistics
- `GET /api/statistics/history`: Get historical statistics with date range

### Middleware

The API uses several middleware components:

- **Authentication**: Validates JWT tokens and sets user context
- **Rate Limiting**: Prevents abuse by limiting request frequency
- **CORS**: Configures Cross-Origin Resource Sharing
- **Error Handling**: Centralizes error responses
- **Logging**: Records API activity for monitoring

## Database Schema

### Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     User      │       │  FlaggedContent│       │ Verification  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ username      │       │ url           │       │ content_id    │
│ email         │       │ title         │       │ verifier_id   │
│ password_hash │       │ content_type  │       │ status        │
│ role          │       │ platform      │       │ notes         │
│ created_at    │◄──┐   │ description   │   ┌──►│ sources       │
│ updated_at    │   │   │ reason        │   │   │ created_at    │
└───────────────┘   │   │ submitter_id  │───┘   │ updated_at    │
                    │   │ flag_count    │       └───────────────┘
                    │   │ created_at    │
                    └───│ updated_at    │
                        └───────────────┘
                               ▲
                               │
                        ┌──────┴──────┐
                        │  Screenshot │
                        ├─────────────┤
                        │ id          │
                        │ content_id  │
                        │ file_path   │
                        │ created_at  │
                        └─────────────┘
```

### Key Tables

#### User

```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    reputation INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### FlaggedContent

```sql
CREATE TABLE flagged_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    description TEXT,
    reason VARCHAR(50) NOT NULL,
    submitter_id INTEGER,
    verification_status VARCHAR(50) DEFAULT 'pending',
    flag_count INTEGER DEFAULT 1,
    has_screenshot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submitter_id) REFERENCES user(id)
);
```

#### Verification

```sql
CREATE TABLE verification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    verifier_id INTEGER,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    sources TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES flagged_content(id),
    FOREIGN KEY (verifier_id) REFERENCES user(id)
);
```

#### Screenshot

```sql
CREATE TABLE screenshot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES flagged_content(id)
);
```

#### ApiKey

```sql
CREATE TABLE api_key (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

#### Statistics

```sql
CREATE TABLE statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    submissions_count INTEGER DEFAULT 0,
    verified_fake_count INTEGER DEFAULT 0,
    verified_misleading_count INTEGER DEFAULT 0,
    verified_true_count INTEGER DEFAULT 0,
    pending_count INTEGER DEFAULT 0,
    active_users_count INTEGER DEFAULT 0
);
```

## Authentication and Security

### Authentication Flow

The system uses JWT (JSON Web Tokens) for authentication:

1. **Registration**:
   - User submits registration form
   - Server validates input
   - Password is hashed using bcrypt
   - User record created in database
   - JWT token generated and returned

2. **Login**:
   - User submits credentials
   - Server validates credentials
   - JWT token generated and returned
   - Token includes user ID and role

3. **Token Usage**:
   - Client includes token in Authorization header
   - Server validates token signature and expiration
   - User information extracted from token
   - Access granted based on user role

### Security Measures

The system implements several security measures:

- **Password Security**:
  - Passwords hashed using bcrypt
  - Minimum password strength requirements
  - Account lockout after failed attempts

- **API Security**:
  - Rate limiting to prevent abuse
  - Input validation for all endpoints
  - Parameterized queries to prevent SQL injection
  - HTTPS for all communications

- **CORS Configuration**:
  - Restricted to specific origins
  - Appropriate headers for secure cross-origin requests

- **Content Security**:
  - Uploaded files scanned for malware
  - File type and size restrictions
  - Content stored separately from application

- **Admin Security**:
  - Two-factor authentication for admin accounts
  - IP restriction for admin access
  - Comprehensive audit logging

## API Reference

### Authentication Endpoints

#### Register a new user

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 123,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2025-06-05T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 123,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Flagged Content Endpoints

#### Get all flagged content

```
GET /api/flagged-content
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `search`: Search term for title or URL
- `content_type`: Filter by content type
- `platform`: Filter by platform
- `verification_status`: Filter by verification status

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "url": "https://example.com/article",
      "title": "Misleading Article Title",
      "content_type": "article",
      "platform": "News Website",
      "description": "This article contains false information about...",
      "reason": "false_information",
      "verification_status": "verified_fake",
      "flag_count": 15,
      "created_at": "2025-06-01T14:30:00Z",
      "updated_at": "2025-06-02T09:15:00Z"
    },
    // More items...
  ],
  "page": 1,
  "per_page": 10,
  "total": 42,
  "pages": 5
}
```

#### Submit new flagged content

```
POST /api/flagged-content
```

**Request Body:**
```json
{
  "url": "https://example.com/suspicious-article",
  "title": "Suspicious Article Title",
  "content_type": "article",
  "platform": "News Website",
  "description": "This article makes false claims about...",
  "reason": "false_information",
  "has_screenshot": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content submitted successfully",
  "content": {
    "id": 43,
    "url": "https://example.com/suspicious-article",
    "title": "Suspicious Article Title",
    "content_type": "article",
    "platform": "News Website",
    "description": "This article makes false claims about...",
    "reason": "false_information",
    "verification_status": "pending",
    "flag_count": 1,
    "created_at": "2025-06-05T15:45:00Z",
    "updated_at": "2025-06-05T15:45:00Z"
  },
  "screenshot_upload_url": "https://api.fakenewsdetector.example.com/upload/screenshot/43"
}
```

### Complete API Documentation

For the complete API documentation, refer to the [API Documentation](api_documentation.md) file.

## Deployment

### Prerequisites

- Docker and Docker Compose
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- Server with at least 2GB RAM and 1 CPU core

### Deployment Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/example/fake-news-detection.git
   cd fake-news-detection
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build Docker images**:
   ```bash
   docker-compose build
   ```

4. **Initialize the database**:
   ```bash
   docker-compose run --rm backend python src/seed_db.py
   ```

5. **Start the services**:
   ```bash
   docker-compose up -d
   ```

6. **Configure Nginx**:
   ```bash
   # Copy Nginx configuration
   cp nginx/fake-news-detector.conf /etc/nginx/sites-available/
   ln -s /etc/nginx/sites-available/fake-news-detector.conf /etc/nginx/sites-enabled/
   
   # Test and reload Nginx
   nginx -t
   systemctl reload nginx
   ```

7. **Set up SSL with Certbot**:
   ```bash
   certbot --nginx -d fakenewsdetector.example.com
   ```

### Docker Compose Configuration

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
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads
    networks:
      - app-network

  frontend:
    build: ./website/frontend
    restart: always
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

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

## Performance Considerations

### Database Optimization

- Indexes on frequently queried columns:
  - `flagged_content.url`
  - `flagged_content.verification_status`
  - `flagged_content.content_type`
  - `flagged_content.platform`
  - `flagged_content.created_at`

- Query optimization:
  - Pagination for large result sets
  - Selective column retrieval
  - Prepared statements

### Caching Strategy

- **Browser Extension**:
  - Local cache of frequently accessed flagged URLs
  - Periodic sync with backend (configurable frequency)
  - Cache invalidation on new submissions

- **Website Frontend**:
  - React Query for data fetching and caching
  - Local storage for user preferences
  - Service worker for offline capabilities

- **Backend API**:
  - Redis cache for frequently accessed data
  - Cache invalidation on content updates
  - Cached aggregate statistics

### Scaling Considerations

- **Horizontal Scaling**:
  - Stateless API design allows multiple instances
  - Load balancing across API instances
  - Database read replicas for scaling reads

- **Vertical Scaling**:
  - Database optimization for larger datasets
  - Memory allocation for caching layers
  - CPU allocation for verification processing

## Future Enhancements

### Planned Features

1. **Machine Learning Integration**:
   - Automated content classification
   - Sentiment analysis
   - Pattern recognition for repeat offenders

2. **Browser Extension Enhancements**:
   - Support for additional browsers (Firefox, Safari)
   - Enhanced content analysis
   - Offline mode with larger local database

3. **Website Enhancements**:
   - Community discussion forums
   - Expert verification portal
   - Educational resources on media literacy

4. **API Enhancements**:
   - GraphQL API for more efficient data fetching
   - Webhook notifications for content status changes
   - Enhanced analytics and reporting

### Development Roadmap

| Phase | Feature | Timeline | Priority |
|-------|---------|----------|----------|
| 1 | Machine learning classification | Q3 2025 | High |
| 1 | Firefox extension port | Q3 2025 | Medium |
| 2 | Community forums | Q4 2025 | Medium |
| 2 | Enhanced analytics dashboard | Q4 2025 | High |
| 3 | Mobile applications | Q1 2026 | Low |
| 3 | API v2 with GraphQL | Q1 2026 | Medium |

---

This technical documentation provides a comprehensive overview of the Fake News Detection System. For specific implementation details, please refer to the code comments and additional documentation files in the repository.

