
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { ArrowRight, Upload, Gift, Truck, Users, BarChart3, Package, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <LindenSquareLogo size="medium" />
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-linden-blue transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-linden-blue transition-colors"
              >
                Features
              </button>
              <Button 
                onClick={handleGetStarted}
                className="bg-linden-blue hover:bg-linden-blue/90"
              >
                Login
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-linden-lightblue to-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-linden-blue leading-tight">
                  Effortless Gifting.<br />
                  <span className="text-linden-gold">Powerful Delivery.</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Corporate gifting made simple, scalable, and personal. Transform your client relationships with our premium gifting platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => scrollToSection('cta')}
                  className="bg-linden-blue hover:bg-linden-blue/90 text-lg px-8 py-3"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-linden-blue text-linden-blue hover:bg-linden-blue hover:text-white text-lg px-8 py-3"
                >
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-linden-blue">Gift Dashboard</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-linden-lightblue rounded-lg p-3 text-center">
                      <Package className="h-6 w-6 mx-auto text-linden-blue mb-1" />
                      <p className="text-xs text-linden-blue">Gifts</p>
                    </div>
                    <div className="bg-linden-gold/10 rounded-lg p-3 text-center">
                      <Users className="h-6 w-6 mx-auto text-linden-gold mb-1" />
                      <p className="text-xs text-linden-blue">Recipients</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <Truck className="h-6 w-6 mx-auto text-green-600 mb-1" />
                      <p className="text-xs text-linden-blue">Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to corporate gifting success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Upload className="h-10 w-10 text-linden-blue" />
              </div>
              <h3 className="text-xl font-semibold text-linden-blue mb-3">1. Upload Recipients</h3>
              <p className="text-gray-600">Easily import your recipient list with our bulk upload feature</p>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Gift className="h-10 w-10 text-linden-gold" />
              </div>
              <h3 className="text-xl font-semibold text-linden-blue mb-3">2. Select Gifts & Personalize</h3>
              <p className="text-gray-600">Choose from our curated catalog and add personal touches</p>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Truck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-linden-blue mb-3">3. We Pack & Deliver</h3>
              <p className="text-gray-600">Sit back while we handle packaging and delivery worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-linden-blue mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for successful corporate gifting</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-linden-lightblue rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-linden-blue" />
                </div>
                <h3 className="text-lg font-semibold text-linden-blue mb-2">Bulk Uploads & Personalization</h3>
                <p className="text-gray-600 text-sm">Import thousands of recipients and personalize each gift</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-linden-gold/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-linden-gold" />
                </div>
                <h3 className="text-lg font-semibold text-linden-blue mb-2">Live Order Tracking</h3>
                <p className="text-gray-600 text-sm">Real-time visibility into every shipment and delivery</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-green-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-linden-blue mb-2">Inventory & Invoicing Made Easy</h3>
                <p className="text-gray-600 text-sm">Automated inventory management and streamlined billing</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-linden-blue mb-2">Client Portal for Full Control</h3>
                <p className="text-gray-600 text-sm">Give clients complete visibility and control over their campaigns</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-linden-blue to-linden-blue/90">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to simplify your corporate gifting?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of companies creating meaningful connections through gifts</p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-linden-gold hover:bg-linden-gold/90 text-linden-blue text-lg px-8 py-3"
          >
            Login to Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <LindenSquareLogo size="medium" className="mb-6" />
            <div className="text-gray-500 text-sm">
              &copy; 2025 Linden Square | 
              <a href="#" className="hover:text-linden-blue ml-1">Terms</a> | 
              <a href="#" className="hover:text-linden-blue ml-1">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
