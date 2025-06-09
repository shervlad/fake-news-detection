import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Users, Globe, Shield, Award, BookOpen } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former journalist with 15 years of experience in fact-checking and media literacy.',
      avatar: 'SJ'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Computer scientist specializing in machine learning and natural language processing.',
      avatar: 'MC'
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Community',
      bio: 'Community building expert with a background in social media moderation and online safety.',
      avatar: 'DR'
    },
    {
      name: 'Emily Thompson',
      role: 'Lead Developer',
      bio: 'Full-stack developer with expertise in browser extensions and web applications.',
      avatar: 'ET'
    }
  ];

  const partners = [
    {
      name: 'Media Literacy Institute',
      description: 'Promoting critical thinking and media literacy education.'
    },
    {
      name: 'FactCheck Global',
      description: 'International fact-checking organization with journalists worldwide.'
    },
    {
      name: 'Digital Rights Foundation',
      description: 'Advocating for digital rights, privacy, and online safety.'
    },
    {
      name: 'Tech for Truth Initiative',
      description: 'Developing technology solutions to combat misinformation.'
    }
  ];

  return (
    <div className="container py-12">
      {/* Mission Section */}
      <div className="max-w-3xl mx-auto mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <AlertTriangle className="h-4 w-4" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">Fighting Misinformation Together</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We're building a community-driven platform to identify, flag, and combat fake news and misinformation across the web.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/extension">
            <Button size="lg">Get the Extension</Button>
          </Link>
          <Link to="/submit">
            <Button size="lg" variant="outline">Submit Content</Button>
          </Link>
        </div>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Fake News Detector was founded in 2023 by a team of journalists, technologists, and educators concerned about the rapid spread of misinformation online and its impact on society.
            </p>
            <p>
              What began as a simple browser extension has grown into a comprehensive platform with thousands of active users working together to create a more trustworthy information ecosystem.
            </p>
            <p>
              Our community-driven approach combines the power of human intelligence with technology to identify and flag fake news across all major platforms and websites.
            </p>
            <p>
              We believe that by working together, we can build a more informed world where people can easily distinguish fact from fiction.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">5,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <AlertTriangle className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">12,500+</h3>
              <p className="text-muted-foreground">Flagged Content</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">10+</h3>
              <p className="text-muted-foreground">Platforms Supported</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">92%</h3>
              <p className="text-muted-foreground">Accuracy Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground">
            The principles that guide our work and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Accuracy</h3>
              <p className="text-muted-foreground">
                We're committed to rigorous fact-checking and verification processes to ensure the highest level of accuracy in our database.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Community</h3>
              <p className="text-muted-foreground">
                We believe in the power of collective intelligence and community collaboration to combat misinformation at scale.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Privacy</h3>
              <p className="text-muted-foreground">
                We respect user privacy and only collect the minimum data necessary to provide our service effectively.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                We're committed to making our tools accessible to everyone, regardless of technical expertise or background.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Education</h3>
              <p className="text-muted-foreground">
                We believe in empowering users with the knowledge and skills to identify misinformation themselves.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                We're open about our processes, methodologies, and decision-making to build trust with our community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-xl text-muted-foreground">
            Meet the people behind Fake News Detector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="text-xl text-muted-foreground">
            Organizations we collaborate with to fight misinformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partners.map((partner, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Help us create a more informed world by joining our community of fact-checkers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/extension">
            <Button size="lg">Get the Extension</Button>
          </Link>
          <Link to="/submit">
            <Button size="lg" variant="outline">Submit Content</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

