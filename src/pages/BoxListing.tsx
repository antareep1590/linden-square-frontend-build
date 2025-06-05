
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Star, Gift, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GiftBoxOption {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  image: string;
  size: 'Small' | 'Medium' | 'Large';
  theme: string;
  priceRange: string;
  defaultGifts: number;
  rating?: number;
  description: string;
}

const presetBoxes: GiftBoxOption[] = [
  {
    id: 'preset-1',
    name: 'Birthday Celebration Box',
    type: 'preset',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400&h=300&fit=crop',
    size: 'Medium',
    theme: 'Birthday',
    priceRange: '$75 - $95',
    defaultGifts: 5,
    rating: 4.8,
    description: 'Pre-curated birthday celebration with premium gifts and festive touches'
  },
  {
    id: 'preset-2',
    name: 'Professional Welcome Box',
    type: 'preset',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    size: 'Large',
    theme: 'Professional',
    priceRange: '$120 - $150',
    defaultGifts: 7,
    rating: 4.9,
    description: 'Sophisticated welcome package for new team members and clients'
  },
  {
    id: 'preset-3',
    name: 'Festive Holiday Box',
    type: 'preset',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    size: 'Small',
    theme: 'Holiday',
    priceRange: '$45 - $65',
    defaultGifts: 4,
    rating: 4.7,
    description: 'Warm holiday greetings with seasonal treats and decorations'
  }
];

const customBoxOption: GiftBoxOption = {
  id: 'custom-build',
  name: 'Build Your Own Box',
  type: 'custom',
  image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
  size: 'Small',
  theme: 'Custom',
  priceRange: 'Starting at $25',
  defaultGifts: 0,
  description: 'Create a personalized gift box from scratch with complete customization'
};

const BoxListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const allBoxes = [...presetBoxes, customBoxOption];
  const themes = ['All', 'Birthday', 'Professional', 'Holiday', 'Custom'];
  const sizes = ['All', 'Small', 'Medium', 'Large'];
  const priceRanges = ['All', 'Under $50', '$50 - $100', 'Over $100'];

  const filteredBoxes = allBoxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         box.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'All' || box.theme === selectedTheme;
    const matchesSize = selectedSize === 'All' || box.size === selectedSize;
    
    return matchesSearch && matchesTheme && matchesSize;
  });

  const handleBoxSelect = (box: GiftBoxOption) => {
    if (box.type === 'preset') {
      navigate(`/box-details/${box.id}`);
    } else {
      navigate('/build-custom-box');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Choose Your Gift Box</h1>
        <p className="text-gray-600">Select from our curated collections or build your own custom box</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search boxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoxes.map((box) => (
          <Card 
            key={box.id} 
            className="transition-all duration-200 hover:shadow-lg cursor-pointer"
            onClick={() => handleBoxSelect(box)}
          >
            <CardHeader className="p-0">
              <div className="relative">
                <img 
                  src={box.image} 
                  alt={box.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant={box.type === 'preset' ? 'default' : 'secondary'}
                    className={box.type === 'preset' ? 'bg-linden-blue' : ''}
                  >
                    {box.type === 'preset' ? 'Preset' : 'Custom'}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/90">
                    {box.size}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{box.name}</CardTitle>
                  {box.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{box.rating}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{box.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {box.type === 'preset' ? `${box.defaultGifts} items` : 'Customizable'}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {box.theme}
                  </Badge>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-linden-blue">{box.priceRange}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-linden-blue hover:text-white"
                  >
                    {box.type === 'preset' ? 'Customize' : 'Build Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBoxes.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No boxes match your current filters. Try adjusting your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default BoxListing;
