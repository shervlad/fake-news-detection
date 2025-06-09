import { Flag, Search, CheckCircle, AlertTriangle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Flag className="h-10 w-10 text-primary" />,
      title: 'Flag Suspicious Content',
      description: 'Use our Chrome extension or website to report potentially fake news or misinformation you encounter online.',
      number: '01'
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Community Review',
      description: 'Our community and trusted moderators review the flagged content to verify its accuracy.',
      number: '02'
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Verification Process',
      description: 'Content is analyzed against reliable sources and fact-checking databases to determine its veracity.',
      number: '03'
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-primary" />,
      title: 'Real-time Alerts',
      description: 'Users receive alerts when browsing content that has been verified as misleading or false.',
      number: '04'
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Our simple four-step process helps identify and alert users about misinformation across the web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-lg p-6 shadow-sm relative"
            >
              <div className="absolute top-4 right-4 text-3xl font-bold text-muted-foreground/20">
                {step.number}
              </div>
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-card border rounded-lg shadow-sm max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <AlertTriangle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-medium mb-2">Ready to join the fight against misinformation?</h3>
              <p className="text-muted-foreground mb-4">
                Install our Chrome extension or use our website to start flagging and receiving alerts about fake news.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Get Chrome Extension
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

