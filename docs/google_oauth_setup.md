# Setting Up Google OAuth for Fake News Detection System

This guide walks you through setting up Google OAuth authentication for the Fake News Detection System.

## 1. Create Google OAuth Credentials

First, you need to create OAuth credentials in the Google Cloud Console:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Fake News Detector
   - User support email: your-email@example.com
   - Developer contact information: your-email@example.com
   - Authorized domains: your-domain.com
6. Return to "Create OAuth client ID" and select:
   - Application type: Web application
   - Name: Fake News Detector Web Client
   - Authorized JavaScript origins:
     - http://localhost:80 (for development)
     - https://your-domain.com (for production)
   - Authorized redirect URIs:
     - http://localhost:5000/api/auth/google/callback (for development)
     - https://api.your-domain.com/api/auth/google/callback (for production)
7. Click "Create"
8. Note your Client ID and Client Secret

## 2. Configure Environment Variables

Add the following variables to your `.env` file:

```
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

For Docker deployment, update the `docker-compose.yml` file to include these environment variables in the backend service.

## 3. Backend Implementation

The backend implementation will use Flask-OAuthlib to handle Google OAuth authentication. Follow the implementation steps in the backend code section of this guide.

## 4. Frontend Implementation

The frontend implementation will provide a "Sign in with Google" button and handle the OAuth flow. Follow the implementation steps in the frontend code section of this guide.

## 5. Testing

Test the Google OAuth implementation:
1. Start the application
2. Click "Sign in with Google"
3. Authorize the application
4. Verify that you are redirected back to the application and logged in

## 6. Production Considerations

For production deployment:
1. Use HTTPS for all URLs
2. Update the authorized origins and redirect URIs in the Google Cloud Console
3. Ensure the OAuth consent screen is properly configured
4. Consider implementing additional security measures like CSRF protection

