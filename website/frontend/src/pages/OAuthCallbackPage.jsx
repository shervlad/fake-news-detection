import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const OAuthCallbackPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Parse query parameters
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const errorMessage = params.get('error');

        if (errorMessage) {
          setError(errorMessage);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!accessToken || !refreshToken) {
          setError('Authentication failed. Missing tokens.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Store tokens and update auth state
        login(accessToken, refreshToken);
        
        // Redirect to home page
        navigate('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processOAuthCallback();
  }, [location, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Completing Authentication</h2>
          <p>Please wait while we complete the authentication process...</p>
        </div>
      )}
    </div>
  );
};

export default OAuthCallbackPage;

