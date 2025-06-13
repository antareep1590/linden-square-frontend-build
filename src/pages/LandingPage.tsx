import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { ArrowRight, Upload, Gift, Truck, Users, Package, Shield, CheckCircle, Star, Heart, MapPin, CreditCard, Headphones, Sparkles, User, MessageCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isExistingClient, setIsExistingClient] = useState(false);

  // Data arrays for the landing page
  const valuePropositions = [
    {
      icon: <Shield className="h-16 w-16 text-linden-blue mx-auto" />,
      title: "Enterprise-Grade Security",
      description: "Your data and your recipients' information are protected with bank-level security and compliance standards."
    },
    {
      icon: <Users className="h-16 w-16 text-linden-gold mx-auto" />,
      title: "Scalable Solutions",
      description: "From 10 to 10,000 recipients, our platform grows with your business needs and campaign requirements."
    },
    {
      icon: <Heart className="h-16 w-16 text-green-600 mx-auto" />,
      title: "Meaningful Connections",
      description: "Every gift is thoughtfully curated to create lasting impressions and strengthen business relationships."
    }
  ];

  const companyLogos = [
    { name: "Company 1", logo: "/placeholder.svg" },
    { name: "Company 2", logo: "/placeholder.svg" },
    { name: "Company 3", logo: "/placeholder.svg" },
    { name: "Company 4", logo: "/placeholder.svg" }
  ];

  const testimonials = [
    {
      quote: "Linden Square transformed our client appreciation process. The personalization options and tracking made it seamless.",
      name: "Sarah Johnson",
      role: "VP Marketing",
      company: "TechCorp",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The branded portal feature is incredible. Our clients feel like they're using our own internal gifting system.",
      name: "Michael Chen",
      role: "Head of Sales",
      company: "InnovateNow",
      avatar: "/placeholder.svg"
    },
    {
      quote: "We've seen a 40% increase in client engagement since using Linden Square for our corporate gifting.",
      name: "Emily Rodriguez",
      role: "Client Success Manager",
      company: "GrowthCo",
      avatar: "/placeholder.svg"
    }
  ];

  const handleBrowsePresetBoxes = () => {
    navigate('/box-listing');
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleStartCampaign = () => {
    navigate('/dashboard');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderNewClientHeader = () => (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <LindenSquareLogo size="medium" />
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">New Client</span>
              <Switch 
                checked={isExistingClient} 
                onCheckedChange={setIsExistingClient}
                className="data-[state=checked]:bg-linden-blue"
              />
              <span className="text-sm font-medium text-gray-600">Existing Client</span>
            </div>
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
              <Button 
                onClick={handleGetStarted}
                className="bg-linden-blue hover:bg-linden-blue/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );

  const renderExistingClientHeader = () => (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <LindenSquareLogo size="medium" />
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">New Client</span>
              <Switch 
                checked={isExistingClient} 
                onCheckedChange={setIsExistingClient}
                className="data-[state=checked]:bg-linden-blue"
              />
              <span className="text-sm font-medium text-gray-600">Existing Client</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-linden-blue transition-colors font-medium"
              >
                Client Dashboard Login
              </button>
              <button 
                onClick={() => scrollToSection('faqs')}
                className="text-gray-600 hover:text-linden-blue transition-colors font-medium"
              >
                FAQs
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-linden-blue transition-colors font-medium"
              >
                Contact Support
              </button>
              <Button 
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                My Profile
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );

  const renderNewClientHero = () => (
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
                onClick={handleGetStarted}
                className="bg-linden-blue hover:bg-linden-blue/90 text-lg px-8 py-4 group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleBrowsePresetBoxes}
                className="border-linden-blue text-linden-blue hover:bg-linden-blue hover:text-white text-lg px-8 py-4"
              >
                Browse Gift Boxes
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-linden-blue">Start Your Gifting Journey</h3>
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
                      <p className="text-2xl font-bold text-linden-blue">Easy</p>
                      <p className="text-xs text-linden-blue">Setup</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-linden-gold/10 border-0">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-linden-gold mb-2" />
                      <p className="text-2xl font-bold text-linden-gold">Smart</p>
                      <p className="text-xs text-linden-blue">Tracking</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-green-50 border-0">
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <p className="text-2xl font-bold text-green-600">Happy</p>
                      <p className="text-xs text-linden-blue">Recipients</p>
                    </div>
                  </Card>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Choose Your Gifts</span>
                    <span className="text-sm font-medium text-green-600">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Add Recipients</span>
                    <span className="text-sm font-medium text-blue-600">Simple</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderExistingClientHero = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-linden-blue via-linden-blue/95 to-linden-blue py-24">
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
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            Welcome Back to Your 
            <span className="text-linden-gold block">Gift Campaign Portal</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Your personalized gifting dashboard is ready. Launch new campaigns, track deliveries, and build stronger relationships with thoughtful gifts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleStartCampaign}
              className="bg-linden-gold hover:bg-linden-gold/90 text-linden-blue text-lg px-12 py-4 font-semibold"
            >
              Start Your Gift Campaign
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoginClick}
              className="border-white text-white hover:bg-white hover:text-linden-blue text-lg px-8 py-4"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderPresetBoxesSection = () => (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose from Our Curated Gift Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professionally curated gift boxes for every occasion, ready to customize and send with just a few clicks.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-linden-blue rounded-lg flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Preset Gift Boxes
            </h3>
            <p className="text-gray-600 mb-6">
              Browse our collection of thoughtfully curated gift boxes. Each box is designed for specific occasions and can be customized to match your brand and message.
            </p>
            <Button 
              onClick={handleBrowsePresetBoxes}
              className="w-full bg-linden-blue hover:bg-linden-blue/90"
            >
              Browse Preset Boxes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      {isExistingClient ? renderExistingClientHeader() : renderNewClientHeader()}
      
      {isExistingClient ? renderExistingClientHero() : renderNewClientHero()}

      {!isExistingClient && (
        <>
          {/* Value Proposition Carousel */}
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

          {/* Preset Boxes Section */}
          {renderPresetBoxesSection()}

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
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </>
      )}

      {isExistingClient && (
        <>
          {/* FAQs Section */}
          <section id="faqs" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-linden-blue mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Get answers to common gifting questions</p>
              </div>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">How do I track my gift deliveries?</h3>
                    <p className="text-gray-600">Access real-time tracking through your dashboard. You'll receive updates at every stage of delivery.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">Can I customize gift boxes with my branding?</h3>
                    <p className="text-gray-600">Yes! Upload your logo and choose themes through your profile settings to brand the entire experience.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">What's the minimum order quantity?</h3>
                    <p className="text-gray-600">We accommodate orders of any size, from single gifts to large corporate campaigns.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">How do recipients provide their addresses?</h3>
                    <p className="text-gray-600">Recipients receive a simple, secure portal link to enter their delivery preferences and address.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Support Section */}
          <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-linden-blue mb-4">Need Help?</h2>
                <p className="text-xl text-gray-600">Our support team is here to assist you</p>
              </div>
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center space-x-8 mb-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-linden-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">Live Chat</h3>
                        <p className="text-gray-600 text-sm">Available 9-5 EST</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-linden-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                          <HelpCircle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">Help Center</h3>
                        <p className="text-gray-600 text-sm">Self-service guides</p>
                      </div>
                    </div>
                    <Button className="w-full bg-linden-blue hover:bg-linden-blue/90">
                      Contact Support Team
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

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
