import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { ArrowRight, Upload, Gift, Truck, Users, BarChart3, Package, Shield, CheckCircle, Star, Clock, Heart, MapPin, CreditCard, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeValueProp, setActiveValueProp] = useState(0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookDemo = () => {
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const valuePropositions = [
    {
      title: "Less Admin, More Connection",
      description: "Streamline your gifting process and focus on what matters most - building relationships.",
      icon: <Heart className="h-8 w-8 text-amber-600" />
    },
    {
      title: "Real-Time Shipping, Zero Guesswork",
      description: "Track every package with precision and keep your recipients informed every step of the way.",
      icon: <MapPin className="h-8 w-8 text-slate-700" />
    },
    {
      title: "Delightfully Easy for Your Recipients",
      description: "Simple address collection and delivery preferences that your recipients will love.",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />
    },
    {
      title: "We Handle Fulfillment, You Get the Thanks",
      description: "Professional packaging and reliable delivery while you take credit for the thoughtful gesture.",
      icon: <Star className="h-8 w-8 text-amber-600" />
    }
  ];

  const features = [
    {
      title: "Recipient Portal with Smart Address Collection",
      description: "Automated address collection with preferences and delivery instructions",
      icon: <Users className="h-6 w-6" />,
      screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center"
    },
    {
      title: "Customizable Gift Rules & Brand Controls",
      description: "Set spending limits, approval workflows, and maintain brand consistency",
      icon: <Shield className="h-6 w-6" />,
      screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center"
    },
    {
      title: "Real-Time Delivery Tracking",
      description: "Complete visibility from order placement to doorstep delivery",
      icon: <Truck className="h-6 w-6" />,
      screenshot: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center"
    },
    {
      title: "Inventory + Storage Management",
      description: "Centralized inventory with automated reordering and storage solutions",
      icon: <Package className="h-6 w-6" />,
      screenshot: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop&crop=center"
    },
    {
      title: "Invoice & Payment Automation",
      description: "Streamlined billing with automated invoicing and payment processing",
      icon: <CreditCard className="h-6 w-6" />,
      screenshot: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center"
    },
    {
      title: "Dedicated Support & SLA Monitoring",
      description: "Premium support with guaranteed response times and success metrics",
      icon: <Headphones className="h-6 w-6" />,
      screenshot: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Customer Success",
      company: "TechCorp",
      quote: "Linden Square transformed how we approach client relationships. The automation saves us hours while the personal touch strengthens our partnerships.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c353?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
    },
    {
      name: "Michael Chen",
      role: "Director of Operations",
      company: "GrowthCo",
      quote: "The real-time tracking and recipient portal eliminated all the logistics headaches. Our clients love the seamless experience.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      company: "StartupX",
      quote: "Setting up campaigns is incredibly intuitive. The analytics help us understand what gifts resonate best with our audience.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
    }
  ];

  const companyLogos = [
    { name: "Shopify", logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
    { name: "Notion", logo: "https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg" },
    { name: "HubSpot", logo: "https://cdn.worldvectorlogo.com/logos/hubspot.svg" },
    { name: "Slack", logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
    { name: "Stripe", logo: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg" }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      description: "Perfect for small teams",
      features: ["Up to 100 recipients/month", "Basic tracking", "Email support"],
      cta: "Get Started"
    },
    {
      name: "Growth",
      description: "For scaling businesses",
      features: ["Up to 1,000 recipients/month", "Advanced analytics", "Priority support", "Custom branding"],
      cta: "Most Popular",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      features: ["Unlimited recipients", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
      cta: "Custom Quote"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <LindenSquareLogo size="medium" />
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-linden-blue transition-colors font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-linden-blue transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-linden-blue transition-colors font-medium"
              >
                Pricing
              </button>
              <Button 
                onClick={handleBookDemo}
                className="bg-linden-blue hover:bg-linden-blue/90"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-linden-lightblue via-white to-linden-gold/10 py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-linden-blue">Gifting That Builds</span><br />
                  <span className="text-linden-gold">Relationships,</span><br />
                  <span className="text-gray-800">Not Just Boxes.</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Linden Square is your smart partner for thoughtful, scalable corporate gifting that strengthens business relationships and drives growth.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleBookDemo}
                  className="bg-linden-blue hover:bg-linden-blue/90 text-lg px-8 py-4 group"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => scrollToSection('features')}
                  className="border-linden-blue text-linden-blue hover:bg-linden-blue hover:text-white text-lg px-8 py-4"
                >
                  Explore the Platform
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-linden-blue">Gift Campaign Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 bg-linden-lightblue border-0">
                      <div className="text-center">
                        <Package className="h-8 w-8 mx-auto text-linden-blue mb-2" />
                        <p className="text-2xl font-bold text-linden-blue">247</p>
                        <p className="text-xs text-linden-blue">Gifts Sent</p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-linden-gold/10 border-0">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto text-linden-gold mb-2" />
                        <p className="text-2xl font-bold text-linden-gold">98%</p>
                        <p className="text-xs text-linden-blue">Delivered</p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-green-50 border-0">
                      <div className="text-center">
                        <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <p className="text-2xl font-bold text-green-600">4.9</p>
                        <p className="text-xs text-linden-blue">Rating</p>
                      </div>
                    </Card>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Premium Coffee Set</span>
                      <span className="text-sm font-medium text-green-600">Delivered</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Custom Notebook Collection</span>
                      <span className="text-sm font-medium text-blue-600">In Transit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Carousel - Enhanced with better padding and colors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">Why Choose Linden Square?</h2>
            <p className="text-xl text-gray-600">Discover what makes us different</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {valuePropositions.map((prop, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 via-white to-slate-100">
                      <CardContent className="p-24 text-center">
                        <div className="mb-10">
                          {prop.icon}
                        </div>
                        <h3 className="text-3xl font-bold text-slate-700 mb-8">{prop.title}</h3>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">{prop.description}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to gifting success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-linden-lightblue rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Upload className="h-12 w-12 text-linden-blue" />
              </div>
              <h3 className="text-2xl font-semibold text-linden-blue mb-4">Upload Your Recipients</h3>
              <p className="text-gray-600 text-lg">Easily import your recipient list with our intelligent bulk upload system</p>
            </div>
            <div className="text-center group">
              <div className="bg-linden-gold/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Gift className="h-12 w-12 text-linden-gold" />
              </div>
              <h3 className="text-2xl font-semibold text-linden-blue mb-4">Choose Your Gifts & Customize</h3>
              <p className="text-gray-600 text-lg">Select from our curated catalog and add personal touches that matter</p>
            </div>
            <div className="text-center group">
              <div className="bg-green-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Truck className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-linden-blue mb-4">We Ship. You Celebrate.</h3>
              <p className="text-gray-600 text-lg">Relax while we handle professional packaging and worldwide delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">All-in-One Gifting Platform</h2>
            <p className="text-xl text-gray-600">Everything you need for successful corporate gifting</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="bg-linden-lightblue rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {React.cloneElement(feature.icon, { className: "h-8 w-8 text-linden-blue" })}
                    </div>
                    <div className="mb-4">
                      <img 
                        src={feature.screenshot} 
                        alt={feature.title}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-linden-blue mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">Trusted by Modern Brands</h2>
            <p className="text-xl text-gray-600">Join hundreds of companies transforming their gifting strategy</p>
          </div>
          
          {/* Client Logos */}
          <div className="flex justify-center items-center space-x-12 mb-16 opacity-60">
            {companyLogos.map((company, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-linden-blue">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">Transparent, Flexible Pricing</h2>
            <p className="text-xl text-gray-600">No storage markups. No hidden carrier fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`border-0 shadow-lg relative ${tier.popular ? 'ring-2 ring-linden-gold' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-linden-gold text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-linden-blue mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-linden-gold hover:bg-linden-gold/90' : 'bg-linden-blue hover:bg-linden-blue/90'}`}
                    onClick={tier.name === 'Enterprise' ? handleBookDemo : handleLoginClick}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-linden-blue via-linden-blue/95 to-linden-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-bounce">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <div className="absolute top-32 right-20 animate-bounce delay-100">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce delay-200">
            <Heart className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Streamline Your Corporate Gifting?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies creating meaningful connections through thoughtful, scalable gifting
          </p>
          <Button 
            size="lg"
            onClick={handleLoginClick}
            className="bg-linden-gold hover:bg-linden-gold/90 text-linden-blue text-lg px-12 py-4 font-semibold"
          >
            Log In to Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <LindenSquareLogo size="medium" className="mb-4" />
            </div>
            <div>
              <h4 className="font-semibold text-linden-blue mb-4">Company</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-linden-blue transition-colors">About</a></li>
                <li><a href="#" className="hover:text-linden-blue transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-linden-blue transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-linden-blue mb-4">Support</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-linden-blue transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-linden-blue transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-linden-blue transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-linden-blue mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-linden-blue transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-linden-blue transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2025 Linden Square. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
