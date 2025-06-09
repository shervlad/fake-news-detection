# Fake News Detection System - Database Schema

## Overview

This document provides a detailed specification of the database schema for the Fake News Detection System. The system uses MongoDB as its primary database, taking advantage of its flexibility for storing varied content types and metadata.

## Collections

### 1. Content Collection

Stores information about flagged content across various platforms.

```javascript
{
  _id: ObjectId,                // Unique identifier
  url: String,                  // Full URL of the flagged content
  title: String,                // Title or headline of the content (if available)
  contentSnippet: String,       // Brief excerpt of the content
  fullText: String,             // Full text content (if available)
  screenshotUrl: String,        // URL to stored screenshot
  thumbnailUrl: String,         // URL to thumbnail image
  domain: String,               // Domain of the flagged content
  platformType: {               // Type of platform
    type: String,
    enum: ['social_media', 'news_site', 'blog', 'video_platform', 'other']
  },
  platformName: String,         // Specific platform name (e.g., "Facebook", "Twitter")
  contentType: {                // Type of content
    type: String,
    enum: ['article', 'post', 'comment', 'video', 'image', 'advertisement', 'other']
  },
  flagCount: Number,            // Number of times this content has been flagged
  verifiedStatus: {             // Current verification status
    type: String,
    enum: ['pending', 'verified_fake', 'verified_misleading', 'verified_true', 'inconclusive', 'rejected']
  },
  verificationScore: Number,    // Score from 0-100 indicating likelihood of being fake news
  verificationNotes: String,    // Notes from verification process
  categories: [String],         // Categories of misinformation (e.g., "political", "health")
  tags: [String],               // Tags for the content
  createdAt: Date,              // Timestamp of first submission
  updatedAt: Date,              // Timestamp of last update
  firstFlaggedBy: {             // Reference to user who first flagged
    type: ObjectId,
    ref: 'User'
  },
  metadata: {                   // Additional metadata
    authorName: String,         // Original content author (if available)
    publishDate: Date,          // Original publication date (if available)
    estimatedReach: Number,     // Estimated number of people who saw the content
    shareCount: Number          // Number of shares (if available)
  }
}
```

### 2. Flags Collection

Stores individual flag submissions from users.

```javascript
{
  _id: ObjectId,                // Unique identifier
  contentId: {                  // Reference to Content collection
    type: ObjectId,
    ref: 'Content'
  },
  userId: {                     // Reference to User collection (if authenticated)
    type: ObjectId,
    ref: 'User'
  },
  anonymousId: String,          // Identifier for anonymous submissions (hashed IP or fingerprint)
  reason: {                     // Reason for flagging
    type: String,
    enum: ['fake_news', 'misleading', 'outdated', 'manipulated_media', 'satire_mistaken_as_news', 'other']
  },
  reasonDetails: String,        // Additional details about the reason
  additionalInfo: String,       // Additional information provided by flagger
  source: {                     // Source of the flag
    type: String,
    enum: ['extension', 'website', 'api']
  },
  browserInfo: {                // Browser information
    browser: String,
    version: String,
    os: String
  },
  createdAt: Date,              // Timestamp of flag submission
  status: {                     // Status of this specific flag
    type: String,
    enum: ['pending', 'reviewed', 'helpful', 'unhelpful']
  },
  moderatorNotes: String        // Notes from moderator about this flag
}
```

### 3. Users Collection

Stores user account information.

```javascript
{
  _id: ObjectId,                // Unique identifier
  email: {                      // User email
    type: String,
    unique: true
  },
  passwordHash: String,         // Hashed password
  username: {                   // Username
    type: String,
    unique: true
  },
  role: {                       // User role
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  profile: {                    // User profile information
    displayName: String,
    bio: String,
    avatarUrl: String,
    location: String
  },
  stats: {                      // User statistics
    flagsSubmitted: Number,
    helpfulFlags: Number,
    reputationScore: Number
  },
  preferences: {                // User preferences
    emailNotifications: Boolean,
    extensionAlertLevel: {
      type: String,
      enum: ['all', 'verified_only', 'high_score_only', 'none']
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system']
    }
  },
  createdAt: Date,              // Account creation timestamp
  lastLogin: Date,              // Last login timestamp
  isActive: Boolean,            // Whether account is active
  verificationToken: String,    // Email verification token
  isEmailVerified: Boolean,     // Whether email is verified
  passwordResetToken: String,   // Password reset token
  passwordResetExpires: Date    // Expiration for password reset token
}
```

### 4. Moderation Collection

Stores moderation actions and decisions.

```javascript
{
  _id: ObjectId,                // Unique identifier
  contentId: {                  // Reference to Content collection
    type: ObjectId,
    ref: 'Content'
  },
  moderatorId: {                // Reference to User collection
    type: ObjectId,
    ref: 'User'
  },
  decision: {                   // Moderation decision
    type: String,
    enum: ['verified_fake', 'verified_misleading', 'verified_true', 'inconclusive', 'rejected']
  },
  confidenceLevel: {            // Moderator's confidence in decision
    type: String,
    enum: ['low', 'medium', 'high']
  },
  notes: String,                // Moderator notes
  evidenceLinks: [String],      // Links to evidence supporting decision
  factCheckSources: [String],   // Sources used for fact checking
  createdAt: Date,              // Timestamp of moderation action
  reviewedFlags: [{             // References to flags that were reviewed
    type: ObjectId,
    ref: 'Flag'
  }],
  isAppealed: Boolean,          // Whether decision has been appealed
  appealStatus: {               // Status of appeal
    type: String,
    enum: ['pending', 'upheld', 'overturned']
  }
}
```

### 5. FactChecks Collection

Stores fact-checking information and sources.

```javascript
{
  _id: ObjectId,                // Unique identifier
  contentId: {                  // Reference to Content collection
    type: ObjectId,
    ref: 'Content'
  },
  title: String,                // Title of fact check
  summary: String,              // Summary of fact check findings
  rating: {                     // Rating of the content
    type: String,
    enum: ['false', 'mostly_false', 'mixed', 'mostly_true', 'true', 'unverified']
  },
  sources: [{                   // Sources used in fact check
    url: String,
    title: String,
    publishDate: Date,
    publisher: String,
    credibilityScore: Number    // Score from 0-100 indicating source credibility
  }],
  explanation: String,          // Detailed explanation of fact check
  authorId: {                   // Reference to User who created fact check
    type: ObjectId,
    ref: 'User'
  },
  createdAt: Date,              // Creation timestamp
  updatedAt: Date,              // Last update timestamp
  isPublished: Boolean          // Whether fact check is published
}
```

### 6. Analytics Collection

Stores analytics data for reporting and insights.

```javascript
{
  _id: ObjectId,                // Unique identifier
  date: Date,                   // Date of analytics record
  metrics: {                    // Various metrics
    newFlags: Number,           // New flags submitted
    newUsers: Number,           // New user registrations
    activeUsers: Number,        // Active users
    moderationActions: Number,  // Moderation actions performed
    apiRequests: Number,        // API requests received
    extensionInstalls: Number,  // New extension installations
    extensionUninstalls: Number // Extension uninstallations
  },
  topFlaggedDomains: [{         // Most flagged domains
    domain: String,
    count: Number
  }],
  topFlaggedCategories: [{      // Most flagged categories
    category: String,
    count: Number
  }],
  geographicDistribution: [{    // Geographic distribution of flags
    country: String,
    count: Number
  }],
  platformDistribution: [{      // Distribution by platform
    platform: String,
    count: Number
  }],
  verificationResults: {        // Distribution of verification results
    verifiedFake: Number,
    verifiedMisleading: Number,
    verifiedTrue: Number,
    inconclusive: Number,
    rejected: Number
  }
}
```

### 7. ExtensionSync Collection

Stores data for Chrome extension synchronization.

```javascript
{
  _id: ObjectId,                // Unique identifier
  extensionId: String,          // Unique identifier for extension instance
  userId: {                     // Reference to User (if authenticated)
    type: ObjectId,
    ref: 'User'
  },
  anonymousId: String,          // Identifier for anonymous users
  lastSyncTime: Date,           // Last synchronization timestamp
  syncData: {                   // Data from last sync
    flaggedDomains: [{          // Domains with flagged content
      domain: String,
      flagCount: Number,
      verifiedFakeCount: Number
    }],
    flaggedUrls: [{             // Specific flagged URLs
      url: String,
      contentId: ObjectId,
      verificationStatus: String,
      verificationScore: Number
    }]
  },
  syncStats: {                  // Synchronization statistics
    totalSyncs: Number,
    lastSyncSize: Number,       // Size of last sync in bytes
    averageSyncInterval: Number // Average time between syncs in minutes
  },
  settings: {                   // Extension settings
    alertLevel: String,
    autoSync: Boolean,
    syncInterval: Number        // Sync interval in minutes
  }
}
```

### 8. Notifications Collection

Stores notifications for users.

```javascript
{
  _id: ObjectId,                // Unique identifier
  userId: {                     // Reference to User
    type: ObjectId,
    ref: 'User'
  },
  type: {                       // Notification type
    type: String,
    enum: ['flag_verified', 'content_updated', 'moderation_needed', 'system_announcement']
  },
  title: String,                // Notification title
  message: String,              // Notification message
  relatedContentId: {           // Reference to related Content (if applicable)
    type: ObjectId,
    ref: 'Content'
  },
  isRead: Boolean,              // Whether notification has been read
  createdAt: Date,              // Creation timestamp
  expiresAt: Date               // Expiration timestamp
}
```

## Indexes

To optimize query performance, the following indexes should be created:

### Content Collection
- `url`: For quick lookups by URL
- `domain`: For filtering by domain
- `verifiedStatus`: For filtering by verification status
- `createdAt`: For sorting by creation date
- `flagCount`: For sorting by flag count
- Compound index on `domain` and `verifiedStatus`: For filtering by both domain and status

### Flags Collection
- `contentId`: For finding all flags for a specific content
- `userId`: For finding all flags by a specific user
- `createdAt`: For sorting by creation date
- Compound index on `contentId` and `status`: For finding flags with specific status for a content

### Users Collection
- `email`: For user lookup by email (unique)
- `username`: For user lookup by username (unique)
- `role`: For filtering users by role

### Moderation Collection
- `contentId`: For finding moderation actions for specific content
- `moderatorId`: For finding actions by specific moderator
- `createdAt`: For sorting by creation date

### ExtensionSync Collection
- `extensionId`: For finding sync data by extension instance
- `userId`: For finding sync data by user
- `lastSyncTime`: For sorting by last sync time

## Data Relationships

The following diagram illustrates the relationships between collections:

```
User ──────┬───> Flags <───── Content <───── FactChecks
           │       │            │
           │       │            │
           └───> Moderation <───┘
                   │
                   │
                   v
               Analytics
```

## Data Validation

MongoDB schema validation will be implemented to ensure data integrity:

1. Required fields: `url` in Content, `contentId` in Flags, `email` and `passwordHash` in Users
2. Enum validation for fields with predefined values
3. Type checking for all fields
4. Custom validation for URLs, emails, and other formatted strings

## Data Migration Strategy

For future schema changes, a migration strategy will be implemented:

1. Version field in each document to track schema version
2. Migration scripts to update documents to latest schema
3. Backward compatibility for reading older document versions

## Backup and Recovery

Regular backups will be performed:

1. Daily full database backups
2. Hourly incremental backups
3. Backup retention policy: 7 daily backups, 4 weekly backups, 3 monthly backups
4. Regular backup restoration tests

## Security Considerations

1. Sensitive user data (passwords) will be hashed using bcrypt
2. Database access will be restricted by IP and user credentials
3. Regular security audits of database configuration
4. Encryption of sensitive data at rest
5. Proper handling of user deletion requests (GDPR compliance)

