import { useState, useEffect } from 'react';
import { Flag, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const Stats = () => {
  // In a real implementation, these would be fetched from an API
  const [stats, setStats] = useState({
    flaggedContent: 0,
    activeUsers: 0,
    verifiedFake: 0,
    successRate: 0
  });

  const finalStats = {
    flaggedContent: 12500,
    activeUsers: 5000,
    verifiedFake: 8750,
    successRate: 92
  };

  // Animate the stats counting up
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setStats({
        flaggedContent: Math.floor(progress * finalStats.flaggedContent),
        activeUsers: Math.floor(progress * finalStats.activeUsers),
        verifiedFake: Math.floor(progress * finalStats.verifiedFake),
        successRate: Math.floor(progress * finalStats.successRate)
      });

      if (frame === totalFrames) {
        clearInterval(timer);
        setStats(finalStats);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, []);

  const statItems = [
    {
      icon: <Flag className="h-8 w-8 text-primary" />,
      value: stats.flaggedContent.toLocaleString(),
      label: 'Flagged Content',
      description: 'Pieces of content flagged by our community'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: stats.activeUsers.toLocaleString(),
      label: 'Active Users',
      description: 'People actively fighting misinformation'
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-primary" />,
      value: stats.verifiedFake.toLocaleString(),
      label: 'Verified Fake',
      description: 'Content verified as false or misleading'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      value: `${stats.successRate}%`,
      label: 'Success Rate',
      description: 'Accuracy of our verification process'
    }
  ];

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl opacity-90">
            Together, we're making a difference in the fight against misinformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-6 text-center"
            >
              <div className="mx-auto mb-4 p-3 bg-primary-foreground/10 rounded-full w-fit">
                {item.icon}
              </div>
              <div className="text-4xl font-bold mb-2">{item.value}</div>
              <h3 className="text-xl font-medium mb-2">{item.label}</h3>
              <p className="opacity-80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

