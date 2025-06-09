# Fake News Detector API Documentation

## Overview

The Fake News Detector API provides programmatic access to the fake news detection system, allowing developers to integrate with the platform, submit content for verification, and retrieve information about flagged content.

This RESTful API uses standard HTTP methods and returns responses in JSON format. Authentication is handled via JWT tokens.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.fakenewsdetector.example.com/api
```

## Authentication

Most endpoints require authentication using JSON Web Tokens (JWT).

### Obtaining a Token

To obtain a JWT token, make a POST request to the `/auth/login` endpoint with valid credentials.

### Using the Token

Include the token in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

Tokens expire after 24 hours. To get a new token without re-authenticating, use the `/auth/refresh` endpoint with a valid refresh token.

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- Authenticated requests: 100 requests per minute
- Unauthenticated requests: 20 requests per minute

When a rate limit is exceeded, the API will return a 429 Too Many Requests response.

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error_code": "ERROR_CODE",
  "details": {
    // Additional error details (optional)
  }
}
```

### Pagination

List endpoints return paginated results with the following structure:

```json
{
  "success": true,
  "items": [
    // Array of items
  ],
  "page": 1,
  "per_page": 10,
  "total": 42,
  "pages": 5
}
```

## API Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

Creates a new user account.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| username | string | Username (3-50 characters) |
| email | string | Valid email address |
| password | string | Password (min 8 characters) |

**Example Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Example Response:**
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

**Status Codes:**
- 201: Created
- 400: Bad Request (validation error)
- 409: Conflict (username or email already exists)

#### Login

```
POST /auth/login
```

Authenticates a user and returns a JWT token.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| email | string | User's email address |
| password | string | User's password |

**Example Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Example Response:**
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- 200: OK
- 400: Bad Request (missing fields)
- 401: Unauthorized (invalid credentials)
- 429: Too Many Requests (too many failed attempts)

#### Refresh Token

```
POST /auth/refresh
```

Generates a new JWT token using a refresh token.

**Request Headers:**
- Authorization: Bearer \<refresh_token\>

**Example Response:**
```json
{
  "success": true,
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized (invalid or expired refresh token)

#### Logout

```
POST /auth/logout
```

Invalidates the current JWT token.

**Request Headers:**
- Authorization: Bearer \<token\>

**Example Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized (invalid token)

### Flagged Content

#### Get all flagged content

```
GET /flagged-content
```

Retrieves a paginated list of flagged content with optional filters.

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number | 1 |
| per_page | integer | Items per page | 10 |
| search | string | Search term for title or URL | null |
| content_type | string | Filter by content type | null |
| platform | string | Filter by platform | null |
| verification_status | string | Filter by verification status | null |
| sort_by | string | Field to sort by | created_at |
| sort_order | string | Sort order (asc or desc) | desc |

**Example Response:**
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

**Status Codes:**
- 200: OK
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (if authentication required)

#### Get flagged content by ID

```
GET /flagged-content/{id}
```

Retrieves detailed information about a specific flagged content item.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the flagged content |

**Example Response:**
```json
{
  "success": true,
  "content": {
    "id": 1,
    "url": "https://example.com/article",
    "title": "Misleading Article Title",
    "content_type": "article",
    "platform": "News Website",
    "description": "This article contains false information about...",
    "reason": "false_information",
    "submitter": {
      "id": 123,
      "username": "factchecker"
    },
    "verification_status": "verified_fake",
    "flag_count": 15,
    "has_screenshot": true,
    "screenshot_url": "https://api.fakenewsdetector.example.com/screenshots/1.jpg",
    "verifications": [
      {
        "id": 5,
        "status": "verified_fake",
        "notes": "This content contains demonstrably false claims...",
        "sources": "https://factcheck.org/article123, https://truthchecker.com/verify/456",
        "created_at": "2025-06-02T09:15:00Z"
      }
    ],
    "created_at": "2025-06-01T14:30:00Z",
    "updated_at": "2025-06-02T09:15:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 404: Not Found (content doesn't exist)

#### Submit new flagged content

```
POST /flagged-content
```

Submits new potentially misleading content for verification.

**Request Headers:**
- Authorization: Bearer \<token\> (optional, for authenticated submissions)

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| url | string | URL of the content |
| title | string | Title or headline of the content |
| content_type | string | Type of content (article, social_post, video, image, advertisement) |
| platform | string | Platform where the content was found |
| description | string | Description of why the content is misleading |
| reason | string | Reason for flagging (false_information, misleading_content, etc.) |
| has_screenshot | boolean | Whether a screenshot will be uploaded |

**Example Request:**
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

**Example Response:**
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

**Status Codes:**
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (if authentication required)
- 429: Too Many Requests (rate limit exceeded)

#### Upload screenshot for flagged content

```
POST /flagged-content/{id}/screenshot
```

Uploads a screenshot for previously submitted flagged content.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the flagged content |

**Request Headers:**
- Authorization: Bearer \<token\> (if authenticated)
- Content-Type: multipart/form-data

**Request Body:**
- Form field `screenshot`: Image file (JPEG, PNG, WebP, max 5MB)

**Example Response:**
```json
{
  "success": true,
  "message": "Screenshot uploaded successfully",
  "screenshot_url": "https://api.fakenewsdetector.example.com/screenshots/43.jpg"
}
```

**Status Codes:**
- 200: OK
- 400: Bad Request (invalid file)
- 401: Unauthorized (if authentication required)
- 404: Not Found (content doesn't exist)
- 413: Payload Too Large (file too big)

#### Update flagged content (Admin only)

```
PUT /flagged-content/{id}
```

Updates information about flagged content. Admin access required.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the flagged content |

**Request Headers:**
- Authorization: Bearer \<token\>

**Request Body:**
Fields to update (all optional)

| Field | Type | Description |
|-------|------|-------------|
| title | string | Title or headline of the content |
| content_type | string | Type of content |
| platform | string | Platform where the content was found |
| description | string | Description of why the content is misleading |
| reason | string | Reason for flagging |
| verification_status | string | Status (pending, verified_fake, verified_misleading, verified_true) |

**Example Request:**
```json
{
  "title": "Updated Article Title",
  "verification_status": "verified_fake"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Content updated successfully",
  "content": {
    "id": 43,
    "url": "https://example.com/suspicious-article",
    "title": "Updated Article Title",
    "content_type": "article",
    "platform": "News Website",
    "description": "This article makes false claims about...",
    "reason": "false_information",
    "verification_status": "verified_fake",
    "flag_count": 1,
    "created_at": "2025-06-05T15:45:00Z",
    "updated_at": "2025-06-05T16:30:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Not Found (content doesn't exist)

#### Delete flagged content (Admin only)

```
DELETE /flagged-content/{id}
```

Deletes flagged content from the system. Admin access required.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the flagged content |

**Request Headers:**
- Authorization: Bearer \<token\>

**Example Response:**
```json
{
  "success": true,
  "message": "Content deleted successfully"
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Not Found (content doesn't exist)

### Verification

#### Submit verification for content

```
POST /flagged-content/{id}/verify
```

Submits a verification assessment for flagged content. Requires verifier role.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the flagged content |

**Request Headers:**
- Authorization: Bearer \<token\>

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| status | string | Verification status (verified_fake, verified_misleading, verified_true) |
| notes | string | Detailed notes about the verification |
| sources | string | Comma-separated list of source URLs used for verification |

**Example Request:**
```json
{
  "status": "verified_fake",
  "notes": "This content contains demonstrably false claims about COVID-19 vaccines. The study cited does not exist.",
  "sources": "https://factcheck.org/article123, https://truthchecker.com/verify/456"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Verification submitted successfully",
  "verification": {
    "id": 78,
    "content_id": 43,
    "verifier_id": 456,
    "status": "verified_fake",
    "notes": "This content contains demonstrably false claims about COVID-19 vaccines. The study cited does not exist.",
    "sources": "https://factcheck.org/article123, https://truthchecker.com/verify/456",
    "created_at": "2025-06-05T17:15:00Z"
  }
}
```

**Status Codes:**
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden (not a verifier)
- 404: Not Found (content doesn't exist)

#### Get verification details

```
GET /verification/{id}
```

Retrieves detailed information about a specific verification.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the verification |

**Example Response:**
```json
{
  "success": true,
  "verification": {
    "id": 78,
    "content_id": 43,
    "verifier": {
      "id": 456,
      "username": "expert_verifier"
    },
    "status": "verified_fake",
    "notes": "This content contains demonstrably false claims about COVID-19 vaccines. The study cited does not exist.",
    "sources": "https://factcheck.org/article123, https://truthchecker.com/verify/456",
    "created_at": "2025-06-05T17:15:00Z",
    "updated_at": "2025-06-05T17:15:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 404: Not Found (verification doesn't exist)

### User Management

#### Get current user profile

```
GET /user/profile
```

Retrieves the profile information of the currently authenticated user.

**Request Headers:**
- Authorization: Bearer \<token\>

**Example Response:**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user",
    "reputation": 75,
    "submissions_count": 12,
    "created_at": "2025-06-01T10:30:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

#### Update user profile

```
PUT /user/profile
```

Updates the profile information of the currently authenticated user.

**Request Headers:**
- Authorization: Bearer \<token\>

**Request Body:**
Fields to update (all optional)

| Field | Type | Description |
|-------|------|-------------|
| username | string | New username |
| email | string | New email address |
| current_password | string | Current password (required for password change) |
| new_password | string | New password |

**Example Request:**
```json
{
  "username": "updated_username",
  "email": "newemail@example.com"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 123,
    "username": "updated_username",
    "email": "newemail@example.com",
    "role": "user",
    "reputation": 75,
    "created_at": "2025-06-01T10:30:00Z",
    "updated_at": "2025-06-05T18:20:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 400: Bad Request (validation error)
- 401: Unauthorized
- 409: Conflict (username or email already exists)

#### Get user submissions

```
GET /user/submissions
```

Retrieves a paginated list of content submissions made by the current user.

**Request Headers:**
- Authorization: Bearer \<token\>

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number | 1 |
| per_page | integer | Items per page | 10 |
| status | string | Filter by verification status | null |

**Example Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": 43,
      "url": "https://example.com/suspicious-article",
      "title": "Suspicious Article Title",
      "content_type": "article",
      "platform": "News Website",
      "verification_status": "verified_fake",
      "created_at": "2025-06-05T15:45:00Z"
    },
    // More items...
  ],
  "page": 1,
  "per_page": 10,
  "total": 12,
  "pages": 2
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized

### Statistics

#### Get summary statistics

```
GET /statistics/summary
```

Retrieves summary statistics about the fake news detection system.

**Example Response:**
```json
{
  "success": true,
  "statistics": {
    "total_submissions": 1542,
    "verified_fake": 876,
    "verified_misleading": 324,
    "verified_true": 156,
    "pending": 186,
    "total_users": 5280,
    "total_verifications": 1356,
    "most_flagged_platforms": [
      {
        "platform": "Facebook",
        "count": 487
      },
      {
        "platform": "Twitter/X",
        "count": 356
      },
      {
        "platform": "News Websites",
        "count": 298
      }
    ],
    "most_common_content_types": [
      {
        "type": "article",
        "count": 623
      },
      {
        "type": "social_post",
        "count": 512
      },
      {
        "type": "image",
        "count": 245
      }
    ],
    "last_updated": "2025-06-05T18:30:00Z"
  }
}
```

**Status Codes:**
- 200: OK

#### Get historical statistics

```
GET /statistics/history
```

Retrieves historical statistics over time.

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| days | integer | Number of days of history to retrieve | 30 |
| interval | string | Interval for data points (day, week, month) | day |

**Example Response:**
```json
{
  "success": true,
  "interval": "day",
  "data": [
    {
      "date": "2025-06-05",
      "submissions": 42,
      "verified_fake": 18,
      "verified_misleading": 12,
      "verified_true": 5,
      "pending": 7,
      "active_users": 156
    },
    // More data points...
  ]
}
```

**Status Codes:**
- 200: OK
- 400: Bad Request (invalid parameters)

### Admin Endpoints

#### Get all users (Admin only)

```
GET /admin/users
```

Retrieves a paginated list of all users. Admin access required.

**Request Headers:**
- Authorization: Bearer \<token\>

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number | 1 |
| per_page | integer | Items per page | 10 |
| search | string | Search by username or email | null |
| role | string | Filter by role | null |

**Example Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": 123,
      "username": "user123",
      "email": "user123@example.com",
      "role": "user",
      "reputation": 75,
      "submissions_count": 12,
      "created_at": "2025-06-01T10:30:00Z",
      "last_login": "2025-06-05T14:20:00Z"
    },
    // More users...
  ],
  "page": 1,
  "per_page": 10,
  "total": 5280,
  "pages": 528
}
```

**Status Codes:**
- 200: OK
- 401: Unauthorized
- 403: Forbidden (not an admin)

#### Update user role (Admin only)

```
PUT /admin/users/{id}/role
```

Updates a user's role. Admin access required.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | ID of the user |

**Request Headers:**
- Authorization: Bearer \<token\>

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| role | string | New role (user, verifier, admin) |

**Example Request:**
```json
{
  "role": "verifier"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "id": 123,
    "username": "user123",
    "email": "user123@example.com",
    "role": "verifier",
    "updated_at": "2025-06-05T19:15:00Z"
  }
}
```

**Status Codes:**
- 200: OK
- 400: Bad Request (invalid role)
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Not Found (user doesn't exist)

## Error Codes

| Error Code | Description |
|------------|-------------|
| AUTH_INVALID_CREDENTIALS | Invalid username or password |
| AUTH_TOKEN_EXPIRED | JWT token has expired |
| AUTH_TOKEN_INVALID | JWT token is invalid |
| AUTH_INSUFFICIENT_PERMISSIONS | User doesn't have required permissions |
| VALIDATION_ERROR | Request validation failed |
| RESOURCE_NOT_FOUND | Requested resource not found |
| RESOURCE_ALREADY_EXISTS | Resource already exists (e.g., duplicate username) |
| RATE_LIMIT_EXCEEDED | Too many requests |
| SERVER_ERROR | Internal server error |

## Webhooks

The API supports webhooks for real-time notifications about content status changes.

### Registering a Webhook

```
POST /webhooks
```

Registers a new webhook endpoint.

**Request Headers:**
- Authorization: Bearer \<token\>

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| url | string | Webhook URL to receive notifications |
| events | array | Array of event types to subscribe to |
| secret | string | Secret key for webhook signature verification |

**Example Request:**
```json
{
  "url": "https://your-app.example.com/webhooks/fake-news-detector",
  "events": ["content.verified", "content.flagged"],
  "secret": "your_webhook_secret"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Webhook registered successfully",
  "webhook_id": "wh_123456789",
  "url": "https://your-app.example.com/webhooks/fake-news-detector",
  "events": ["content.verified", "content.flagged"]
}
```

### Webhook Events

| Event | Description |
|-------|-------------|
| content.flagged | New content has been flagged |
| content.verified | Content verification status has changed |
| user.registered | New user has registered |

### Webhook Payload

```json
{
  "event": "content.verified",
  "timestamp": "2025-06-05T19:30:00Z",
  "webhook_id": "wh_123456789",
  "data": {
    "content_id": 43,
    "url": "https://example.com/suspicious-article",
    "title": "Suspicious Article Title",
    "verification_status": "verified_fake",
    "updated_at": "2025-06-05T19:30:00Z"
  }
}
```

## SDK Libraries

We provide official SDK libraries for easy integration:

- [JavaScript/TypeScript SDK](https://github.com/fake-news-detector/javascript-sdk)
- [Python SDK](https://github.com/fake-news-detector/python-sdk)
- [PHP SDK](https://github.com/fake-news-detector/php-sdk)

## API Versioning

The API uses URL versioning. The current version is v1:

```
https://api.fakenewsdetector.example.com/api/v1/...
```

When a new version is released, the previous version will be supported for at least 12 months.

## Support

For API support, please contact:

- Email: api-support@fakenewsdetector.example.com
- Developer Forum: https://developers.fakenewsdetector.example.com
- GitHub Issues: https://github.com/fake-news-detector/api/issues

