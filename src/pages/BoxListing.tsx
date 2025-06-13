import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Search, Filter, Gift, Users, Heart, Briefcase, GraduationCap, Calendar, Package, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const BoxListing = () => {
  const navigate = useNavigate();
  const { addBox, selectedBoxes } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(true);

  const giftBoxes = [
    {
      id: 1,
      name: 'Holiday Appreciation Premium',
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
      name: 'New Hire Welcome Essential',
      theme: 'Employee Recognition',
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
      name: 'Executive Recognition Luxury',
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
    },
    {
      id: 5,
      name: 'New Hire Basic Kit',
      theme: 'Employee Recognition',
      description: 'Essential starter kit for new employees',
      price: 29.99,
      size: 'Small',
      type: 'preset',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: GraduationCap,
      campaignType: 'HR',
      items: [
        { id: '14', name: 'Welcome Guide', price: 5.99, quantity: 1 },
        { id: '15', name: 'Company Pen', price: 8.99, quantity: 1 },
        { id: '16', name: 'Branded Notebook', price: 12.99, quantity: 1 }
      ]
    },
    {
      id: 6,
      name: 'Holiday Standard Package',
      theme: 'Holiday Gifts',
      description: 'Traditional holiday gifts for team celebrations',
      price: 55.99,
      size: 'Medium',
      type: 'preset',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: Calendar,
      campaignType: 'marketing',
      items: [
        { id: '17', name: 'Holiday Mug', price: 12.99, quantity: 1 },
        { id: '18', name: 'Seasonal Treats', price: 16.99, quantity: 1 },
        { id: '19', name: 'Gift Card', price: 20.99, quantity: 1 }
      ]
    }
  ];

  const themes = ['Holiday Gifts', 'Thank You Gifts', 'Employee Recognition', 'Executive Gifts'];
  const sizes = ['Small', 'Medium', 'Large'];

  const filteredBoxes = giftBoxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         box.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedThemes.length === 0 || selectedThemes.includes(box.theme);
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(box.size);
    const matchesPrice = box.price >= priceRange[0] && box.price <= priceRange[1];
    
    return matchesSearch && matchesTheme && matchesSize && matchesPrice;
  });

  const handleThemeChange = (theme: string, checked: boolean) => {
    if (checked) {
      setSelectedThemes([...selectedThemes, theme]);
    } else {
      setSelectedThemes(selectedThemes.filter(t => t !== theme));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
  };

  const clearAllFilters = () => {
    setSelectedThemes([]);
    setSelectedSizes([]);
    setPriceRange([0, 200]);
    setSearchTerm('');
  };

  const removeFilter = (type: string, value: string) => {
    if (type === 'theme') {
      setSelectedThemes(selectedThemes.filter(t => t !== value));
    } else if (type === 'size') {
      setSelectedSizes(selectedSizes.filter(s => s !== value));
    }
  };

  const handleSelectBox = (box: any) => {
    const newBox = {
      id: box.id.toString(),
      name: box.name,
      theme: box.theme,
      size: box.size,
      type: box.type,
      basePrice: box.price,
      image: box.image,
      campaignType: box.campaignType,
      gifts: box.items
    };

    addBox(newBox);
    toast.success(`${box.name} added to your selection`);
  };

  const handleContinue = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please select at least one gift box');
      return;
    }
    navigate('/personalization');
  };

  const isBoxSelected = (boxId: number) => {
    return selectedBoxes.some(box => box.id === boxId.toString());
  };

  const activeFilterCount = selectedThemes.length + selectedSizes.length + 
    (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0) + (searchTerm ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Gift Theme Selection</h1>
          <p className="text-gray-600">Choose from our curated gift boxes for your campaign</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-linden-blue">
            {selectedBoxes.length} box{selectedBoxes.length !== 1 ? 'es' : ''} selected
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

      {/* Enhanced Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-600"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search gift boxes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Theme Multi-Select Dropdown */}
              <div>
                <label className="text-sm font-medium mb-3 block">Themes</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      selectedThemes.length > 0 
                        ? `${selectedThemes.length} selected` 
                        : "Select themes"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <div key={theme} className="flex items-center space-x-2 p-2">
                        <Checkbox
                          id={theme}
                          checked={selectedThemes.includes(theme)}
                          onCheckedChange={(checked) => handleThemeChange(theme, checked as boolean)}
                        />
                        <label htmlFor={theme} className="text-sm font-medium leading-none cursor-pointer">
                          {theme}
                        </label>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size Multi-Select Dropdown */}
              <div>
                <label className="text-sm font-medium mb-3 block">Box Size</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      selectedSizes.length > 0 
                        ? `${selectedSizes.length} selected` 
                        : "Select sizes"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2 p-2">
                        <Checkbox
                          id={size}
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                        />
                        <label htmlFor={size} className="text-sm font-medium leading-none cursor-pointer">
                          {size}
                        </label>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$200</span>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div>
                <label className="text-sm font-medium mb-3 block">Results</label>
                <div className="text-sm text-gray-600">
                  <p>{filteredBoxes.length} gift boxes found</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedBoxes.length} selected
                  </p>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Active filters:</span>
                  {selectedThemes.map(theme => (
                    <Badge key={theme} variant="secondary" className="text-xs flex items-center gap-1">
                      {theme}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFilter('theme', theme)}
                      />
                    </Badge>
                  ))}
                  {selectedSizes.map(size => (
                    <Badge key={size} variant="secondary" className="text-xs flex items-center gap-1">
                      {size}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFilter('size', size)}
                      />
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 200) && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      ${priceRange[0]} - ${priceRange[1]}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setPriceRange([0, 200])}
                      />
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      "{searchTerm}"
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSearchTerm('')}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Gift Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoxes.map((box) => {
          const Icon = box.icon;
          const isSelected = isBoxSelected(box.id);
          
          return (
            <Card key={box.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${isSelected ? 'ring-2 ring-linden-blue' : ''}`}>
              <div className="relative">
                <img 
                  src={box.image} 
                  alt={box.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    <Icon className="h-3 w-3 mr-1" />
                    {box.theme}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-white/90">
                    {box.size}
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
                  <CardTitle className="text-lg">{box.name}</CardTitle>
                  <span className="text-lg font-bold text-linden-blue">${box.price}</span>
                </div>
                <p className="text-sm text-gray-600">{box.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {box.campaignType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {box.items.length} items
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => handleSelectBox(box)}
                  className={`w-full ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-linden-blue hover:bg-linden-blue/90'
                  }`}
                  disabled={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select Box'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBoxes.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gift boxes found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default BoxListing;
