import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

