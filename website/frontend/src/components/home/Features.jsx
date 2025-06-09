import { Flag, Shield, Search, Users, BarChart, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Flag className="h-8 w-8 text-primary" />,
      title: 'Flag Misinformation',
      description: 'Easily report fake news or misinformation from any website or social media platform with just a few clicks.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Real-time Alerts',
      description: 'Receive instant notifications when browsing content that has been flagged by our community as potentially misleading.'
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: 'Browse Flagged Content',
      description: 'Search and explore a comprehensive database of content that has been identified as fake news or misinformation.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community Moderation',
      description: 'Our trusted moderators review flagged content to verify its accuracy and provide additional context.'
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Detailed Analytics',
      description: 'Access statistics and trends about misinformation sources, categories, and distribution patterns.'
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Cross-Platform Support',
      description: 'Works across all major social media platforms and websites to provide comprehensive protection.'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features to Combat Misinformation</h2>
          <p className="text-xl text-muted-foreground">
            Our comprehensive solution provides the tools you need to identify, report, and avoid fake news across the web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </section>
  );
};

export default Features;

