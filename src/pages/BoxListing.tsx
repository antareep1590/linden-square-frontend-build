
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Filter, Gift, Users, Heart, Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const BoxListing = () => {
  const navigate = useNavigate();
  const { addBox, selectedBoxes } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');

  const giftThemes = [
    {
      id: 1,
      name: 'Holiday Appreciation',
      theme: 'Holiday Gifts',
      description: 'Celebrate the season with festive gift boxes perfect for team appreciation',
      price: 89.99,
      size: 'Large',
      type: 'preset',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: Calendar,
      campaignType: 'marketing',
      items: [
        { id: '1', name: 'Premium Coffee Blend', price: 24.99, quantity: 1 },
        { id: '2', name: 'Gourmet Chocolates', price: 18.99, quantity: 1 },
        { id: '3', name: 'Holiday Candle', price: 15.99, quantity: 1 },
        { id: '4', name: 'Branded Mug', price: 12.99, quantity: 1 }
      ]
    },
    {
      id: 2,
      name: 'Thank You Excellence',
      theme: 'Thank You Gifts',
      description: 'Show appreciation with thoughtfully curated thank you gifts',
      price: 65.99,
      size: 'Medium',
      type: 'preset',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: Heart,
      campaignType: 'client appreciation',
      items: [
        { id: '5', name: 'Artisan Tea Set', price: 22.99, quantity: 1 },
        { id: '6', name: 'Thank You Card', price: 3.99, quantity: 1 },
        { id: '7', name: 'Wellness Kit', price: 19.99, quantity: 1 }
      ]
    },
    {
      id: 3,
      name: 'New Hire Welcome',
      theme: 'New Hire Kits',
      description: 'Welcome new team members with essential onboarding gifts',
      price: 45.99,
      size: 'Medium',
      type: 'preset',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: GraduationCap,
      campaignType: 'HR',
      items: [
        { id: '8', name: 'Company Notebook', price: 12.99, quantity: 1 },
        { id: '9', name: 'Welcome Letter', price: 2.99, quantity: 1 },
        { id: '10', name: 'Branded Pen Set', price: 14.99, quantity: 1 }
      ]
    },
    {
      id: 4,
      name: 'Executive Recognition',
      theme: 'Executive Gifts',
      description: 'Premium gifts for leadership and executive appreciation',
      price: 125.99,
      size: 'Large',
      type: 'preset',
      image: 'https://images.unsplash.com/photo-1607344645866-009c7d0435c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: Briefcase,
      campaignType: 'executive',
      items: [
        { id: '11', name: 'Luxury Leather Portfolio', price: 45.99, quantity: 1 },
        { id: '12', name: 'Premium Wine', price: 35.99, quantity: 1 },
        { id: '13', name: 'Executive Pen', price: 25.99, quantity: 1 }
      ]
    }
  ];

  const themeFilters = [
    { id: 'all', name: 'All Themes', icon: Gift },
    { id: 'Holiday Gifts', name: 'Holiday Gifts', icon: Calendar },
    { id: 'Thank You Gifts', name: 'Thank You Gifts', icon: Heart },
    { id: 'New Hire Kits', name: 'New Hire Kits', icon: GraduationCap },
    { id: 'Executive Gifts', name: 'Executive Gifts', icon: Briefcase }
  ];

  const filteredThemes = giftThemes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'all' || theme.theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const handleSelectBox = (theme: any) => {
    const newBox = {
      id: theme.id.toString(),
      name: theme.name,
      theme: theme.theme,
      size: theme.size,
      type: theme.type,
      price: theme.price,
      image: theme.image,
      campaignType: theme.campaignType,
      gifts: theme.items
    };

    addBox(newBox);
    toast.success(`${theme.name} added to your selection`);
  };

  const handleContinue = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please select at least one gift theme');
      return;
    }
    // Skip customize box page and go directly to personalization
    navigate('/personalization');
  };

  const isBoxSelected = (boxId: number) => {
    return selectedBoxes.some(box => box.id === boxId.toString());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Gift Theme Selection</h1>
          <p className="text-gray-600">Choose from our curated gift themes for your campaign</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-linden-blue">
            {selectedBoxes.length} theme{selectedBoxes.length !== 1 ? 's' : ''} selected
          </Badge>
          <Button 
            onClick={handleContinue}
            disabled={selectedBoxes.length === 0}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Customize
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search gift themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {themeFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={selectedTheme === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTheme(filter.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedTheme === filter.id ? "bg-linden-blue hover:bg-linden-blue/90" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {filter.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Gift Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = isBoxSelected(theme.id);
          
          return (
            <Card key={theme.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${isSelected ? 'ring-2 ring-linden-blue' : ''}`}>
              <div className="relative">
                <img 
                  src={theme.image} 
                  alt={theme.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    <Icon className="h-3 w-3 mr-1" />
                    {theme.theme}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-white/90">
                    {theme.size}
                  </Badge>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-linden-blue/20 flex items-center justify-center">
                    <Badge className="bg-linden-blue text-white">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  <span className="text-lg font-bold text-linden-blue">${theme.price}</span>
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {theme.campaignType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {theme.items.length} items
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => handleSelectBox(theme)}
                  className={`w-full ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-linden-blue hover:bg-linden-blue/90'
                  }`}
                  disabled={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select Theme'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No themes found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default BoxListing;
