
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Star, Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';

const ChooseGiftBox = () => {
  const navigate = useNavigate();
  const [selectedBoxIds, setSelectedBoxIds] = useState<number[]>([]);

  const giftBoxes = [
    {
      id: 1,
      name: "Executive Appreciation",
      theme: "Professional",
      price: 89.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Premium gifts for senior leadership and key clients. Includes luxury items that make a lasting impression.",
      contents: ["Premium leather notebook", "Artisan coffee selection", "Elegant pen set", "Gourmet chocolates"],
      rating: 4.9,
      reviews: 127,
      popular: true
    },
    {
      id: 2,
      name: "Team Celebration",
      theme: "Festive",
      price: 45.99,
      originalPrice: 55.99,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Perfect for team milestones and achievements. Celebrate success with meaningful gifts.",
      contents: ["Celebration banner", "Team photo frame", "Gourmet snacks", "Success journal"],
      rating: 4.7,
      reviews: 89,
      popular: false
    },
    {
      id: 3,
      name: "Welcome Package",
      theme: "Onboarding",
      price: 65.99,
      originalPrice: 75.99,
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Make a great first impression with new hires. Everything they need to feel welcomed.",
      contents: ["Welcome guide", "Company swag", "Desk accessories", "Welcome treats"],
      rating: 4.8,
      reviews: 156,
      popular: true
    },
    {
      id: 4,
      name: "Holiday Wishes",
      theme: "Seasonal",
      price: 75.99,
      originalPrice: 85.99,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Spread joy during the holiday season with festive and thoughtful gifts.",
      contents: ["Holiday ornaments", "Seasonal treats", "Warm beverage mix", "Holiday card"],
      rating: 4.6,
      reviews: 203,
      popular: false
    },
    {
      id: 5,
      name: "Client Appreciation",
      theme: "Business",
      price: 120.99,
      originalPrice: 135.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Show your valued clients how much they mean to your business with premium selections.",
      contents: ["Premium wine selection", "Artisan cheese board", "Executive desk accessory", "Thank you card"],
      rating: 4.9,
      reviews: 95,
      popular: true
    },
    {
      id: 6,
      name: "Wellness & Self-Care",
      theme: "Health",
      price: 55.99,
      originalPrice: 65.99,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Promote wellbeing and self-care with thoughtful wellness-focused gifts.",
      contents: ["Aromatherapy candle", "Herbal tea collection", "Stress relief items", "Wellness journal"],
      rating: 4.8,
      reviews: 142,
      popular: false
    }
  ];

  const handleSelectBox = (boxId: number) => {
    setSelectedBoxIds(prev => 
      prev.includes(boxId) 
        ? prev.filter(id => id !== boxId)
        : [...prev, boxId]
    );
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LindenSquareLogo size="medium" />
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <h1 className="hidden sm:block text-xl font-semibold text-gray-900">Choose Your Gift Box</h1>
            </div>
            <Button variant="outline" onClick={handleBackToHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Gift Box
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our professionally curated collection. Each box is designed for specific occasions and themes.
          </p>
        </div>

        {/* Gift Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {giftBoxes.map((box) => (
            <Card 
              key={box.id} 
              className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative">
                {/* Image */}
                <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={box.image} 
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {box.popular && (
                    <Badge className="bg-linden-gold text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {box.originalPrice > box.price && (
                    <Badge variant="destructive">
                      Save ${(box.originalPrice - box.price).toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{box.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-linden-blue">${box.price}</div>
                      {box.originalPrice > box.price && (
                        <div className="text-sm text-gray-500 line-through">${box.originalPrice}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm bg-linden-lightblue text-linden-blue px-3 py-1 rounded-full">
                      {box.theme}
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {box.rating} ({box.reviews} reviews)
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{box.description}</p>

                {/* Box Contents */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">What's included:</h4>
                  <ul className="grid grid-cols-1 gap-1">
                    {box.contents.slice(0, 3).map((item, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-linden-blue rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                    {box.contents.length > 3 && (
                      <li className="text-xs text-gray-500 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        +{box.contents.length - 3} more items
                      </li>
                    )}
                  </ul>
                </div>

                {/* View Details Button */}
                <Button 
                  className="w-full bg-linden-blue hover:bg-linden-blue/90 transition-colors"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact us to discuss your corporate gifting needs and create the perfect experience for your recipients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-linden-blue hover:bg-linden-blue/90">
              Contact Sales
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseGiftBox;
