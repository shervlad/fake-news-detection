import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Chrome, ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="container">
        <div className="max-w-5xl mx-auto bg-card border rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Image/Graphic */}
            <div className="bg-primary/10 p-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-card border rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Chrome className="h-6 w-6 text-primary" />
                    <h3 className="font-medium">Chrome Extension</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3L4 7L2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm">Real-time alerts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3L4 7L2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm">One-click flagging</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3L4 7L2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm">Works on all platforms</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3L4 7L2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm">Free to use</p>
                    </div>
                  </div>
                  <div className="mt-6 h-8 bg-primary rounded-md w-full"></div>
                </div>
              </div>
            </div>
            
            {/* Right side - Text and CTA */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Fight Against Misinformation?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Install our Chrome extension or use our website to start flagging and receiving alerts about fake news across the web.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/extension">
                  <Button size="lg" className="gap-2">
                    <Chrome className="h-4 w-4" />
                    Get Chrome Extension
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button size="lg" variant="outline" className="gap-2">
                    Submit Content
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500" />
                  <path d="M7.5 10L9.16667 11.6667L12.5 8.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500" />
                </svg>
                <span className="text-sm text-muted-foreground">No account required to get started</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

