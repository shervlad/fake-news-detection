import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const GoogleAuthButton = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/google/login');
      
      if (response.data && response.data.auth_url) {
        // Redirect to Google's OAuth page
        window.location.href = response.data.auth_url;
      } else {
        throw new Error('Failed to get authentication URL');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Authentication Error',
        description: 'Failed to initiate Google login. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <FaGoogle className="h-4 w-4" />
      {isLoading ? 'Connecting...' : 'Sign in with Google'}
    </Button>
  );
};

export default GoogleAuthButton;

