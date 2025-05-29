
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Heart, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Gift {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
}

const gifts: Gift[] = [
  {
    id: '1',
    name: 'Premium Coffee Set',
    price: 45.99,
    category: 'Beverages',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    description: 'Artisanal coffee blend with ceramic mug'
  },
  {
    id: '2',
    name: 'Luxury Notebook',
    price: 29.99,
    category: 'Office',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    description: 'Leather-bound journal with gold accents'
  },
  {
    id: '3',
    name: 'Wellness Kit',
    price: 67.99,
    category: 'Health',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
    description: 'Essential oils and aromatherapy accessories'
  },
  {
    id: '4',
    name: 'Gourmet Chocolate Box',
    price: 39.99,
    category: 'Food',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
    description: 'Assorted premium chocolates'
  },
  {
    id: '5',
    name: 'Tech Accessories Bundle',
    price: 85.99,
    category: 'Technology',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop',
    description: 'Wireless charger, cables, and organizer'
  },
  {
    id: '6',
    name: 'Artisan Candle Set',
    price: 52.99,
    category: 'Home',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop',
    description: 'Hand-poured soy candles with natural scents'
  }
];

const SelectGifts = () => {
  const navigate = useNavigate();
  const [selectedGifts, setSelectedGifts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = ['all', 'Beverages', 'Office', 'Health', 'Food', 'Technology', 'Home'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-30', label: 'Under $30' },
    { value: '30-60', label: '$30 - $60' },
    { value: '60+', label: '$60+' }
  ];

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || gift.category === categoryFilter;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      if (priceRange === '0-30') matchesPrice = gift.price < 30;
      else if (priceRange === '30-60') matchesPrice = gift.price >= 30 && gift.price <= 60;
      else if (priceRange === '60+') matchesPrice = gift.price > 60;
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleGiftSelection = (giftId: string) => {
    const newSelection = new Set(selectedGifts);
    if (newSelection.has(giftId)) {
      newSelection.delete(giftId);
    } else {
      newSelection.add(giftId);
    }
    setSelectedGifts(newSelection);
  };

  const handleContinue = () => {
    if (selectedGifts.size > 0) {
      navigate('/add-personalization');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Select Gifts</h1>
        <Badge variant="outline" className="text-sm">
          {selectedGifts.size} selected
        </Badge>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search gifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => (
          <Card 
            key={gift.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedGifts.has(gift.id) ? 'ring-2 ring-linden-blue bg-linden-lightblue' : ''
            }`}
            onClick={() => toggleGiftSelection(gift.id)}
          >
            <CardHeader className="p-0">
              <div className="relative">
                <img 
                  src={gift.image} 
                  alt={gift.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant={selectedGifts.has(gift.id) ? "default" : "secondary"}
                    size="sm"
                    className="rounded-full w-8 h-8 p-0"
                  >
                    {selectedGifts.has(gift.id) ? (
                      <ShoppingCart className="h-4 w-4" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{gift.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {gift.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{gift.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{gift.rating}</span>
                  </div>
                  <span className="text-lg font-bold text-linden-blue">
                    ${gift.price}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={selectedGifts.size === 0}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          Continue to Personalization ({selectedGifts.size} items)
        </Button>
      </div>
    </div>
  );
};

export default SelectGifts;
