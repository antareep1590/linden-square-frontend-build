
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Heart, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdvancedFiltersModal from '@/components/AdvancedFiltersModal';

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
  const [selectedGifts, setSelectedGifts] = useState<Map<string, number>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    priceRange: [0, 100],
    occasions: [],
    availability: 'all',
    rating: [0, 5]
  });

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

    // Apply advanced filters
    const matchesAdvancedCategory = advancedFilters.categories.length === 0 || 
      advancedFilters.categories.includes(gift.category);
    const matchesAdvancedPrice = gift.price >= advancedFilters.priceRange[0] && 
      gift.price <= advancedFilters.priceRange[1];
    const matchesAdvancedRating = gift.rating >= advancedFilters.rating[0];
    
    return matchesSearch && matchesCategory && matchesPrice && 
           matchesAdvancedCategory && matchesAdvancedPrice && matchesAdvancedRating;
  });

  const updateGiftQuantity = (giftId: string, newQuantity: number) => {
    const newSelection = new Map(selectedGifts);
    if (newQuantity <= 0) {
      newSelection.delete(giftId);
    } else {
      newSelection.set(giftId, newQuantity);
    }
    setSelectedGifts(newSelection);
  };

  const getGiftQuantity = (giftId: string) => {
    return selectedGifts.get(giftId) || 0;
  };

  const getTotalSelectedItems = () => {
    return Array.from(selectedGifts.values()).reduce((sum, quantity) => sum + quantity, 0);
  };

  const handleContinue = () => {
    if (selectedGifts.size > 0) {
      navigate('/add-personalization');
    }
  };

  const handleAdvancedFiltersApply = (filters: any) => {
    setAdvancedFilters(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Select Gifts</h1>
        <Badge variant="outline" className="text-sm">
          {getTotalSelectedItems()} items selected
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
        
        <AdvancedFiltersModal 
          onFiltersApply={handleAdvancedFiltersApply}
          currentFilters={advancedFilters}
        />
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => {
          const quantity = getGiftQuantity(gift.id);
          const isSelected = quantity > 0;
          
          return (
            <Card 
              key={gift.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-linden-blue bg-linden-lightblue' : ''
              }`}
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
                      variant={isSelected ? "default" : "secondary"}
                      size="sm"
                      className="rounded-full w-8 h-8 p-0"
                      onClick={() => updateGiftQuantity(gift.id, quantity > 0 ? 0 : 1)}
                    >
                      {isSelected ? (
                        <ShoppingCart className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
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

                  {/* Quantity Controls */}
                  {isSelected && (
                    <div className="flex items-center justify-center gap-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGiftQuantity(gift.id, Math.max(0, quantity - 1))}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium text-lg min-w-[2ch] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGiftQuantity(gift.id, quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={selectedGifts.size === 0}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          Continue to Personalization ({getTotalSelectedItems()} items)
        </Button>
      </div>
    </div>
  );
};

export default SelectGifts;
