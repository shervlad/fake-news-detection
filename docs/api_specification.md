# Fake News Detection System - API Specification

## Overview

This document provides a detailed specification of the RESTful API endpoints for the Fake News Detection System. The API serves as the communication layer between the Chrome extension, website frontend, and the database.

## Base URL

```
https://api.fakenewsdetection.example.com/v1
```

All endpoints are prefixed with this base URL.

## Authentication

Most endpoints require authentication using JSON Web Tokens (JWT). The token should be included in the `Authorization` header using the Bearer scheme:

```
Authorization: Bearer <token>
```

## Response Format

All responses are in JSON format and follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "errors": []
}
```

For error responses:

```json
{
  "success": false,
  "data": null,
  "message": "Operation failed",
  "errors": [
    {
      "code": "ERROR_CODE",
      "message": "Detailed error message"
    }
  ]
}
```

## Error Codes

Common error codes:

- `AUTHENTICATION_REQUIRED`: Authentication is required
- `INVALID_CREDENTIALS`: Invalid username or password
- `FORBIDDEN`: User does not have permission
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server error

## API Endpoints

### Authentication Endpoints

#### Register User

```
POST /auth/register
```

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "username",
  "profile": {
    "displayName": "Display Name"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "email": "user@example.com",
      "username": "username",
      "role": "user",
      "profile": {
        "displayName": "Display Name"
      },
      "createdAt": "2023-06-22T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### Login

```
POST /auth/login
```

Authenticate a user and get a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "email": "user@example.com",
      "username": "username",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### Get Current User

```
GET /auth/me
```

Get information about the currently authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "email": "user@example.com",
      "username": "username",
      "role": "user",
      "profile": {
        "displayName": "Display Name",
        "bio": "User bio",
        "avatarUrl": "https://example.com/avatar.jpg",
        "location": "City, Country"
      },
      "stats": {
        "flagsSubmitted": 10,
        "helpfulFlags": 8,
        "reputationScore": 85
      },
      "preferences": {
        "emailNotifications": true,
        "extensionAlertLevel": "verified_only",
        "theme": "dark"
      },
      "createdAt": "2023-06-22T10:00:00Z",
      "lastLogin": "2023-06-23T15:30:00Z"
    }
  },
  "message": "User information retrieved successfully"
}
```

#### Logout

```
POST /auth/logout
```

Invalidate the current JWT token.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

#### Update User Profile

```
PUT /auth/profile
```

Update the current user's profile information.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "profile": {
    "displayName": "New Display Name",
    "bio": "Updated bio information",
    "location": "New City, Country"
  },
  "preferences": {
    "emailNotifications": false,
    "extensionAlertLevel": "high_score_only",
    "theme": "light"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "profile": {
      "displayName": "New Display Name",
      "bio": "Updated bio information",
      "avatarUrl": "https://example.com/avatar.jpg",
      "location": "New City, Country"
    },
    "preferences": {
      "emailNotifications": false,
      "extensionAlertLevel": "high_score_only",
      "theme": "light"
    }
  },
  "message": "Profile updated successfully"
}
```

### Content Endpoints

#### Submit Flagged Content

```
POST /content
```

Submit new flagged content.

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Request Body:**

```json
{
  "url": "https://example.com/fake-article",
  "title": "Misleading Article Title",
  "contentSnippet": "This is a snippet of the misleading content...",
  "screenshot": "base64-encoded-image-data",
  "platformType": "news_site",
  "platformName": "Example News",
  "contentType": "article",
  "reason": "fake_news",
  "reasonDetails": "This article contains fabricated statistics",
  "additionalInfo": "The source cited doesn't exist"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": {
      "id": "60d21b4667d0d8992e610c86",
      "url": "https://example.com/fake-article",
      "title": "Misleading Article Title",
      "contentSnippet": "This is a snippet of the misleading content...",
      "screenshotUrl": "https://storage.fakenewsdetection.example.com/screenshots/60d21b4667d0d8992e610c86.jpg",
      "domain": "example.com",
      "platformType": "news_site",
      "platformName": "Example News",
      "contentType": "article",
      "flagCount": 1,
      "verifiedStatus": "pending",
      "createdAt": "2023-06-22T10:00:00Z"
    },
    "flag": {
      "id": "60d21b4667d0d8992e610c87",
      "contentId": "60d21b4667d0d8992e610c86",
      "reason": "fake_news",
      "reasonDetails": "This article contains fabricated statistics",
      "additionalInfo": "The source cited doesn't exist",
      "source": "website",
      "createdAt": "2023-06-22T10:00:00Z",
      "status": "pending"
    }
  },
  "message": "Content flagged successfully"
}
```

#### Get Flagged Content List

```
GET /content
```

Get a list of flagged content with filtering options.

**Headers:**
- `Authorization: Bearer <token>` (required for some filters)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by verification status (e.g., "pending", "verified_fake")
- `domain`: Filter by domain
- `platform`: Filter by platform type
- `contentType`: Filter by content type
- `sortBy`: Sort field (default: "createdAt")
- `sortOrder`: Sort order ("asc" or "desc", default: "desc")
- `search`: Search term for title or content

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "url": "https://example.com/fake-article",
        "title": "Misleading Article Title",
        "contentSnippet": "This is a snippet of the misleading content...",
        "thumbnailUrl": "https://storage.fakenewsdetection.example.com/thumbnails/60d21b4667d0d8992e610c86.jpg",
        "domain": "example.com",
        "platformType": "news_site",
        "platformName": "Example News",
        "contentType": "article",
        "flagCount": 5,
        "verifiedStatus": "verified_fake",
        "verificationScore": 85,
        "categories": ["political", "health"],
        "createdAt": "2023-06-22T10:00:00Z"
      },
      // More items...
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 42,
      "totalPages": 3
    }
  },
  "message": "Content retrieved successfully"
}
```

#### Get Specific Flagged Content

```
GET /content/:id
```

Get detailed information about specific flagged content.

**Headers:**
- `Authorization: Bearer <token>` (optional, more details if authenticated)

**Response:**

```json
{
  "success": true,
  "data": {
    "content": {
      "id": "60d21b4667d0d8992e610c86",
      "url": "https://example.com/fake-article",
      "title": "Misleading Article Title",
      "contentSnippet": "This is a snippet of the misleading content...",
      "fullText": "Full text of the article if available...",
      "screenshotUrl": "https://storage.fakenewsdetection.example.com/screenshots/60d21b4667d0d8992e610c86.jpg",
      "thumbnailUrl": "https://storage.fakenewsdetection.example.com/thumbnails/60d21b4667d0d8992e610c86.jpg",
      "domain": "example.com",
      "platformType": "news_site",
      "platformName": "Example News",
      "contentType": "article",
      "flagCount": 5,
      "verifiedStatus": "verified_fake",
      "verificationScore": 85,
      "verificationNotes": "This content contains multiple false claims...",
      "categories": ["political", "health"],
      "tags": ["election", "covid"],
      "createdAt": "2023-06-22T10:00:00Z",
      "updatedAt": "2023-06-23T14:30:00Z",
      "metadata": {
        "authorName": "John Doe",
        "publishDate": "2023-06-20T08:00:00Z",
        "estimatedReach": 15000,
        "shareCount": 2500
      }
    },
    "factCheck": {
      "title": "Fact Check: Claims in Article Are False",
      "summary": "Our investigation found that the statistics cited in this article are fabricated...",
      "rating": "false",
      "sources": [
        {
          "url": "https://factcheck.org/real-statistics",
          "title": "Actual Statistics Report",
          "publisher": "Official Statistics Bureau",
          "publishDate": "2023-06-15T00:00:00Z"
        }
      ],
      "createdAt": "2023-06-23T12:00:00Z"
    },
    "flags": [
      {
        "reason": "fake_news",
        "reasonDetails": "This article contains fabricated statistics",
        "createdAt": "2023-06-22T10:00:00Z"
      },
      // More flags (anonymized)...
    ]
  },
  "message": "Content retrieved successfully"
}
```

#### Check URL Status

```
GET /content/check
```

Check if a URL has been flagged.

**Query Parameters:**
- `url`: URL to check (required)

**Response:**

```json
{
  "success": true,
  "data": {
    "isFlagged": true,
    "content": {
      "id": "60d21b4667d0d8992e610c86",
      "url": "https://example.com/fake-article",
      "title": "Misleading Article Title",
      "contentSnippet": "This is a snippet of the misleading content...",
      "domain": "example.com",
      "verifiedStatus": "verified_fake",
      "verificationScore": 85,
      "flagCount": 5
    }
  },
  "message": "URL status retrieved successfully"
}
```

If not flagged:

```json
{
  "success": true,
  "data": {
    "isFlagged": false
  },
  "message": "URL status retrieved successfully"
}
```

#### Check Multiple URLs

```
POST /content/check-batch
```

Check multiple URLs at once (primarily for extension sync).

**Request Body:**

```json
{
  "urls": [
    "https://example.com/article1",
    "https://example.com/article2",
    "https://otherdomain.com/post"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "url": "https://example.com/article1",
        "isFlagged": true,
        "content": {
          "id": "60d21b4667d0d8992e610c86",
          "verifiedStatus": "verified_fake",
          "verificationScore": 85
        }
      },
      {
        "url": "https://example.com/article2",
        "isFlagged": true,
        "content": {
          "id": "60d21b4667d0d8992e610c87",
          "verifiedStatus": "verified_misleading",
          "verificationScore": 65
        }
      },
      {
        "url": "https://otherdomain.com/post",
        "isFlagged": false
      }
    ]
  },
  "message": "Batch check completed successfully"
}
```

#### Check Domain Status

```
GET /content/domain-status
```

Get statistics about a domain's flagged content.

**Query Parameters:**
- `domain`: Domain to check (required)

**Response:**

```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "totalFlagged": 15,
    "verifiedFake": 8,
    "verifiedMisleading": 4,
    "verifiedTrue": 1,
    "pending": 2,
    "trustScore": 25,
    "commonCategories": ["political", "health"],
    "recentFlags": 3
  },
  "message": "Domain status retrieved successfully"
}
```

### Moderation Endpoints

#### Get Moderation Queue

```
GET /moderation/queue
```

Get content waiting for moderation.

**Headers:**
- `Authorization: Bearer <token>` (moderator/admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: Sort field (default: "flagCount")
- `sortOrder`: Sort order ("asc" or "desc", default: "desc")

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "url": "https://example.com/fake-article",
        "title": "Misleading Article Title",
        "contentSnippet": "This is a snippet of the misleading content...",
        "screenshotUrl": "https://storage.fakenewsdetection.example.com/screenshots/60d21b4667d0d8992e610c86.jpg",
        "domain": "example.com",
        "platformType": "news_site",
        "contentType": "article",
        "flagCount": 5,
        "createdAt": "2023-06-22T10:00:00Z",
        "flags": [
          {
            "id": "60d21b4667d0d8992e610c87",
            "reason": "fake_news",
            "reasonDetails": "This article contains fabricated statistics",
            "createdAt": "2023-06-22T10:00:00Z"
          },
          // More flags...
        ]
      },
      // More items...
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 35,
      "totalPages": 2
    }
  },
  "message": "Moderation queue retrieved successfully"
}
```

#### Submit Moderation Decision

```
POST /moderation/:contentId/decision
```

Submit a moderation decision for flagged content.

**Headers:**
- `Authorization: Bearer <token>` (moderator/admin only)

**Request Body:**

```json
{
  "decision": "verified_fake",
  "confidenceLevel": "high",
  "notes": "This content contains multiple verifiably false claims",
  "evidenceLinks": [
    "https://factcheck.org/real-statistics",
    "https://officialsource.org/data"
  ],
  "categories": ["political", "health"],
  "tags": ["election", "covid"],
  "verificationScore": 85
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "moderation": {
      "id": "60d21b4667d0d8992e610c88",
      "contentId": "60d21b4667d0d8992e610c86",
      "moderatorId": "60d21b4667d0d8992e610c85",
      "decision": "verified_fake",
      "confidenceLevel": "high",
      "notes": "This content contains multiple verifiably false claims",
      "evidenceLinks": [
        "https://factcheck.org/real-statistics",
        "https://officialsource.org/data"
      ],
      "createdAt": "2023-06-23T14:30:00Z"
    },
    "content": {
      "id": "60d21b4667d0d8992e610c86",
      "verifiedStatus": "verified_fake",
      "verificationScore": 85,
      "categories": ["political", "health"],
      "tags": ["election", "covid"],
      "updatedAt": "2023-06-23T14:30:00Z"
    }
  },
  "message": "Moderation decision submitted successfully"
}
```

#### Get Moderation Statistics

```
GET /moderation/stats
```

Get statistics about moderation activities.

**Headers:**
- `Authorization: Bearer <token>` (moderator/admin only)

**Query Parameters:**
- `period`: Time period ("day", "week", "month", "year", default: "week")

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "week",
    "totalModerated": 42,
    "decisions": {
      "verified_fake": 18,
      "verified_misleading": 12,
      "verified_true": 5,
      "inconclusive": 4,
      "rejected": 3
    },
    "moderators": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "username": "moderator1",
        "count": 15
      },
      // More moderators...
    ],
    "pendingCount": 35,
    "averageTimeToModerate": 120 // minutes
  },
  "message": "Moderation statistics retrieved successfully"
}
```

### Extension Endpoints

#### Sync Extension Data

```
POST /extension/sync
```

Synchronize data between the extension and backend.

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Request Body:**

```json
{
  "extensionId": "extension-unique-id",
  "lastSyncTime": "2023-06-22T10:00:00Z",
  "settings": {
    "alertLevel": "verified_only",
    "autoSync": true,
    "syncInterval": 30
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "syncTime": "2023-06-23T15:30:00Z",
    "flaggedDomains": [
      {
        "domain": "example.com",
        "flagCount": 15,
        "verifiedFakeCount": 8
      },
      // More domains...
    ],
    "flaggedUrls": [
      {
        "url": "https://example.com/fake-article",
        "contentId": "60d21b4667d0d8992e610c86",
        "verificationStatus": "verified_fake",
        "verificationScore": 85
      },
      // More URLs...
    ],
    "settings": {
      "alertLevel": "verified_only",
      "autoSync": true,
      "syncInterval": 30
    }
  },
  "message": "Extension data synchronized successfully"
}
```

#### Submit Flag from Extension

```
POST /extension/flag
```

Submit a flag directly from the Chrome extension.

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Request Body:**

```json
{
  "extensionId": "extension-unique-id",
  "url": "https://example.com/fake-article",
  "title": "Misleading Article Title",
  "contentSnippet": "This is a snippet of the misleading content...",
  "screenshot": "base64-encoded-image-data",
  "platformType": "news_site",
  "platformName": "Example News",
  "contentType": "article",
  "reason": "fake_news",
  "reasonDetails": "This article contains fabricated statistics",
  "browserInfo": {
    "browser": "Chrome",
    "version": "91.0.4472.124",
    "os": "Windows"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": {
      "id": "60d21b4667d0d8992e610c86",
      "url": "https://example.com/fake-article",
      "verifiedStatus": "pending",
      "flagCount": 1
    },
    "flag": {
      "id": "60d21b4667d0d8992e610c87",
      "status": "pending"
    }
  },
  "message": "Content flagged successfully"
}
```

### Analytics Endpoints

#### Get Public Statistics

```
GET /analytics/public
```

Get public statistics about the fake news detection system.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalFlagged": 1250,
    "verifiedFake": 580,
    "verifiedMisleading": 320,
    "verifiedTrue": 150,
    "pendingVerification": 200,
    "topCategories": [
      {
        "category": "political",
        "count": 450
      },
      {
        "category": "health",
        "count": 350
      },
      // More categories...
    ],
    "topDomains": [
      {
        "domain": "example.com",
        "count": 85
      },
      // More domains...
    ],
    "recentTrends": {
      "daily": [
        {
          "date": "2023-06-22",
          "count": 45
        },
        // More days...
      ]
    },
    "userCount": 5000,
    "extensionInstalls": 3500
  },
  "message": "Public statistics retrieved successfully"
}
```

#### Get User Statistics

```
GET /analytics/user
```

Get statistics about the current user's activity.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "flagsSubmitted": 10,
    "flagsByStatus": {
      "pending": 2,
      "reviewed": 8,
      "helpful": 7,
      "unhelpful": 1
    },
    "flagsByCategory": [
      {
        "category": "political",
        "count": 6
      },
      {
        "category": "health",
        "count": 4
      }
    ],
    "reputationScore": 85,
    "reputationHistory": [
      {
        "date": "2023-06-01",
        "score": 75
      },
      {
        "date": "2023-06-15",
        "score": 80
      },
      {
        "date": "2023-06-22",
        "score": 85
      }
    ]
  },
  "message": "User statistics retrieved successfully"
}
```

### Admin Endpoints

#### Get System Health

```
GET /admin/health
```

Get system health information.

**Headers:**
- `Authorization: Bearer <token>` (admin only)

**Response:**

```json
{
  "success": true,
  "data": {
    "system": {
      "status": "healthy",
      "uptime": 1209600, // seconds
      "version": "1.0.0"
    },
    "database": {
      "status": "connected",
      "responseTime": 15, // ms
      "size": 1024 // MB
    },
    "storage": {
      "status": "available",
      "usedSpace": 5120, // MB
      "totalSpace": 10240 // MB
    },
    "queue": {
      "status": "processing",
      "pendingJobs": 5
    },
    "apiRequests": {
      "last24Hours": 15000,
      "averageResponseTime": 120 // ms
    }
  },
  "message": "System health retrieved successfully"
}
```

#### Get User Management

```
GET /admin/users
```

Get list of users for management.

**Headers:**
- `Authorization: Bearer <token>` (admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `role`: Filter by role
- `search`: Search by email or username

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "email": "user@example.com",
        "username": "username",
        "role": "user",
        "createdAt": "2023-06-22T10:00:00Z",
        "lastLogin": "2023-06-23T15:30:00Z",
        "isActive": true,
        "stats": {
          "flagsSubmitted": 10,
          "reputationScore": 85
        }
      },
      // More users...
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 5000,
      "totalPages": 250
    }
  },
  "message": "Users retrieved successfully"
}
```

#### Update User Role

```
PUT /admin/users/:id/role
```

Update a user's role.

**Headers:**
- `Authorization: Bearer <token>` (admin only)

**Request Body:**

```json
{
  "role": "moderator"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "username": "username",
    "role": "moderator"
  },
  "message": "User role updated successfully"
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:

- Anonymous requests: 60 requests per minute
- Authenticated users: 120 requests per minute
- Moderators and admins: 300 requests per minute

When a rate limit is exceeded, the API returns a 429 Too Many Requests response with a Retry-After header.

## Versioning

The API uses URL versioning (v1, v2, etc.). When breaking changes are introduced, a new version will be released while maintaining support for previous versions for a deprecation period.

## Webhooks

For integration with external systems, webhooks are available:

```
POST /webhooks/register
```

**Headers:**
- `Authorization: Bearer <token>` (admin only)

**Request Body:**

```json
{
  "url": "https://example.com/webhook",
  "events": ["content.flagged", "content.verified"],
  "secret": "webhook-secret-key"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c89",
    "url": "https://example.com/webhook",
    "events": ["content.flagged", "content.verified"],
    "createdAt": "2023-06-22T10:00:00Z"
  },
  "message": "Webhook registered successfully"
}
```

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:
- Chrome extension
- Website frontend
- Registered third-party integrations

## Security Considerations

1. All API endpoints use HTTPS
2. JWT tokens expire after 24 hours
3. Sensitive operations require re-authentication
4. Input validation is performed on all endpoints
5. Rate limiting prevents brute force attacks
6. CAPTCHA is required for anonymous submissions
7. File uploads are scanned for malware
8. Content is sanitized to prevent XSS attacks

