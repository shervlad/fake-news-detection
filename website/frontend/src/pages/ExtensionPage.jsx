import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chrome, AlertTriangle, CheckCircle, Flag, Bell, Shield, Download, Code, Monitor } from 'lucide-react';

const ExtensionPage = () => {
  const features = [
    {
      icon: <Flag className="h-6 w-6 text-primary" />,
      title: 'Flag Content',
      description: 'Easily report fake news or misinformation from any website or social media platform with just a few clicks.'
    },
    {
      icon: <Bell className="h-6 w-6 text-primary" />,
      title: 'Real-time Alerts',
      description: 'Receive instant notifications when browsing content that has been flagged by our community.'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Cross-Platform',
      description: 'Works across all major social media platforms and websites to provide comprehensive protection.'
    }
  ];

  const platforms = [
    'Facebook',
    'Twitter/X',
    'Instagram',
    'TikTok',
    'YouTube',
    'Reddit',
    'LinkedIn',
    'News Websites',
    'Blogs',
    'Forums'
  ];

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Chrome className="h-4 w-4" />
            <span>Chrome Extension</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Detect Fake News Anywhere on the Web</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Our powerful Chrome extension helps you identify and avoid misinformation across all websites and social media platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Add to Chrome
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Code className="h-4 w-4" />
              View on GitHub
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Free</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Open Source</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Privacy-Focused</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur-lg opacity-30"></div>
          <Card className="relative border shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-zinc-800 text-white p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs flex-grow text-center">Chrome Browser</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <h3 className="font-medium text-red-800">Warning: Flagged Content</h3>
                    <p className="text-xs text-red-700">This article has been identified as containing misinformation.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Flag className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-card border rounded-lg shadow-lg p-4 w-48">
            <div className="flex items-center gap-2 mb-2">
              <Chrome className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Fake News Detector</div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="text-xs text-muted-foreground">This content has been flagged 128 times and verified as false.</div>
            </div>
            <div className="h-6 bg-primary rounded-md w-full text-xs text-white flex items-center justify-center">
              View Details
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground">
            Our extension provides powerful tools to help you identify and avoid misinformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Platform Support */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Works Everywhere</h2>
          <p className="text-xl text-muted-foreground">
            Our extension works across all major platforms and websites.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {platforms.map((platform, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-lg p-4 text-center hover:border-primary transition-colors"
            >
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium">{platform}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* How It Works */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            See how our extension helps you identify and avoid misinformation.
          </p>
        </div>
        
        <Tabs defaultValue="flag" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flag">Flag Content</TabsTrigger>
            <TabsTrigger value="alert">Receive Alerts</TabsTrigger>
            <TabsTrigger value="browse">Browse Safely</TabsTrigger>
          </TabsList>
          <TabsContent value="flag" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-medium mb-4">Flag Suspicious Content</h3>
                <p className="text-muted-foreground mb-6">
                  When you encounter content you believe to be fake or misleading, simply click the extension icon or use the right-click context menu to report it.
                </p>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-medium">Click the extension icon</p>
                      <p className="text-sm text-muted-foreground">Or right-click and select "Flag as Fake News"</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-medium">Select a reason for flagging</p>
                      <p className="text-sm text-muted-foreground">Choose from options like "Fake News", "Misleading", etc.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-medium">Add additional details (optional)</p>
                      <p className="text-sm text-muted-foreground">Provide context or evidence for why you believe it's fake</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                    <div>
                      <p className="font-medium">Submit your report</p>
                      <p className="text-sm text-muted-foreground">Our community moderators will review it</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="bg-card border rounded-lg shadow-md p-4">
                <div className="bg-zinc-800 text-white p-2 flex items-center gap-2 rounded-t-md">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs flex-grow text-center">Flag Content</div>
                </div>
                <div className="p-4 bg-white rounded-b-md">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Report Fake News</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Reason for flagging</label>
                        <div className="h-10 bg-gray-100 rounded-md w-full"></div>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Additional details</label>
                        <div className="h-20 bg-gray-100 rounded-md w-full"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 rounded"></div>
                        <span className="text-sm">Include screenshot</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                    <div className="h-8 w-20 bg-primary rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="alert" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-medium mb-4">Receive Real-time Alerts</h3>
                <p className="text-muted-foreground mb-6">
                  When browsing content that has been flagged by our community, you'll receive an alert warning you about potential misinformation.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-red-100 text-red-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Verified Fake News</p>
                      <p className="text-sm text-muted-foreground">Content that has been verified as false by fact-checkers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-yellow-100 text-yellow-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Misleading Content</p>
                      <p className="text-sm text-muted-foreground">Content that contains partial truths but is presented in a deceptive way</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Pending Review</p>
                      <p className="text-sm text-muted-foreground">Content that has been flagged but not yet verified</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-card border rounded-lg shadow-md overflow-hidden">
                <div className="bg-zinc-800 text-white p-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs flex-grow text-center">Example Website</div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium text-red-800">Warning: Verified Fake News</h3>
                      <p className="text-xs text-red-700">This article has been verified as false by fact-checkers.</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View Details
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-medium mb-4">Browse Safely</h3>
                <p className="text-muted-foreground mb-6">
                  Our extension works in the background to protect you from misinformation as you browse the web.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-1 flex-shrink-0 mt-0.5">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Works on all websites</p>
                      <p className="text-sm text-muted-foreground">Protection across news sites, social media, and more</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-1 flex-shrink-0 mt-0.5">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Privacy-focused</p>
                      <p className="text-sm text-muted-foreground">We don't track your browsing history or personal data</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-1 flex-shrink-0 mt-0.5">
                      <Chrome className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Lightweight</p>
                      <p className="text-sm text-muted-foreground">Minimal impact on browser performance</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-card border rounded-lg shadow-md p-4">
                <div className="bg-zinc-800 text-white p-2 flex items-center gap-2 rounded-t-md">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs flex-grow text-center">Extension Settings</div>
                </div>
                <div className="p-4 bg-white rounded-b-md">
                  <h4 className="font-medium mb-4">Fake News Detector Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Alert Level</label>
                        <div className="h-6 w-32 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Auto-sync</label>
                        <div className="h-6 w-12 bg-primary rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Sync Interval</label>
                        <div className="h-6 w-24 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="h-8 w-full bg-primary rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Download CTA */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of users who are already fighting misinformation with our Chrome extension.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Add to Chrome
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Code className="h-4 w-4" />
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPage;

