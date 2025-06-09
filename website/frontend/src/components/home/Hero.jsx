import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, Chrome } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
              <AlertTriangle className="h-4 w-4" />
              <span>Community-Driven Fact Checking</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Fight Misinformation Together
            </h1>
            
            <p className="text-xl text-muted-foreground">
              A powerful platform that empowers users to identify, flag, and be warned about fake news and misinformation across the web.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/submit">
                <Button size="lg" className="gap-2">
                  Submit Content
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/extension">
                <Button size="lg" variant="outline" className="gap-2">
                  <Chrome className="h-4 w-4" />
                  Get Chrome Extension
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">JD</div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">MK</div>
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">AL</div>
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">RB</div>
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">+</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-medium text-foreground">5,000+</span> users fighting misinformation
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur-lg opacity-30"></div>
            <div className="relative bg-background border rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium">Warning: Flagged Content</h3>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded-md w-3/4"></div>
                  <div className="h-4 bg-muted rounded-md w-full"></div>
                  <div className="h-4 bg-muted rounded-md w-5/6"></div>
                  <div className="h-4 bg-muted rounded-md w-4/5"></div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted"></div>
                    <div className="h-4 bg-muted rounded-md w-24"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-primary rounded-md w-20"></div>
                    <div className="h-8 bg-muted rounded-md w-20"></div>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            </div>
            
            <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 bg-background border rounded-lg shadow-lg p-4 w-48">
              <div className="flex items-center gap-2 mb-2">
                <Chrome className="h-4 w-4" />
                <div className="h-3 bg-muted rounded-md w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-md w-full"></div>
                <div className="h-2 bg-muted rounded-md w-5/6"></div>
                <div className="h-2 bg-muted rounded-md w-4/5"></div>
              </div>
              <div className="mt-3 h-6 bg-primary rounded-md w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

