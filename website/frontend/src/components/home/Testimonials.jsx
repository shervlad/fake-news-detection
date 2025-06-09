import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "This tool has completely changed how I consume news online. I feel much more confident that I'm getting accurate information.",
      author: "Sarah Johnson",
      role: "Journalist",
      avatar: "SJ"
    },
    {
      quote: "As an educator, I recommend this extension to all my students. It's an essential tool for developing critical thinking in the digital age.",
      author: "Dr. Michael Chen",
      role: "University Professor",
      avatar: "MC"
    },
    {
      quote: "The community aspect is what makes this platform special. Together, we're creating a more trustworthy internet.",
      author: "David Rodriguez",
      role: "Community Moderator",
      avatar: "DR"
    },
    {
      quote: "I've caught several misleading articles thanks to the alerts. It's like having a fact-checker by my side while browsing.",
      author: "Emily Thompson",
      role: "Marketing Professional",
      avatar: "ET"
    },
    {
      quote: "The Chrome extension is so intuitive and non-intrusive. It only appears when needed and has saved me from sharing false information multiple times.",
      author: "James Wilson",
      role: "Social Media Manager",
      avatar: "JW"
    }
  ];

  const [api, setApi] = useState(null);

  const avatarColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who are already making a difference in the fight against misinformation.
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="border bg-card h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quote className="h-8 w-8 text-primary mb-4" />
                    <p className="text-lg mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-medium`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="relative inset-auto" />
            <CarouselNext className="relative inset-auto" />
          </div>
        </Carousel>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-1 px-4 py-2 bg-muted rounded-full text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span>5,000+ active users and growing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

