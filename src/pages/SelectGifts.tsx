
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ShoppingCart, Star } from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  description: string;
}

const gifts: Gift[] = [
  {
    id: '1',
    name: 'Premium Coffee Set',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    price: 49.99,
    category: 'Beverages',
    rating: 4.8,
    description: 'Artisan coffee selection with premium brewing accessories',
  },
  {
    id: '2',
    name: 'Luxury Notebook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    price: 29.99,
    category: 'Stationery',
    rating: 4.6,
    description: 'Handcrafted leather notebook with premium paper',
  },
  {
    id: '3',
    name: 'Wellness Kit',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
    price: 79.99,
    category: 'Health',
    rating: 4.9,
    description: 'Complete wellness package with aromatherapy essentials',
  },
  {
    id: '4',
    name: 'Gourmet Chocolate Box',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400&h=300&fit=crop',
    price: 39.99,
    category: 'Food',
    rating: 4.7,
    description: 'Hand-selected premium chocolates from around the world',
  },
  {
    id: '5',
    name: 'Tech Accessories Kit',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    price: 89.99,
    category: 'Technology',
    rating: 4.5,
    description: 'Essential tech accessories for the modern professional',
  },
  {
    id: '6',
    name: 'Artisan Tea Collection',
    image: 'https://images.unsplash.com/photo-1597524661902-94d854b57796?w=400&h=300&fit=crop',
    price: 34.99,
    category: 'Beverages',
    rating: 4.6,
    description: 'Curated selection of premium teas from renowned gardens',
  },
];

const categories = ['All', 'Beverages', 'Stationery', 'Health', 'Food', 'Technology'];

const SelectGifts = () => {
  const [selectedGifts, setSelectedGifts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleGiftSelection = (giftId: string) => {
    const newSelection = new Set(selectedGifts);
    if (newSelection.has(giftId)) {
      newSelection.delete(giftId);
    } else {
      newSelection.add(giftId);
    }
    setSelectedGifts(newSelection);
  };

  const filteredGifts = selectedCategory === 'All' 
    ? gifts 
    : gifts.filter(gift => gift.category === selectedCategory);

  const getTotalCost = () => {
    return Array.from(selectedGifts).reduce((total, giftId) => {
      const gift = gifts.find(g => g.id === giftId);
      return total + (gift?.price || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Select Gifts</h1>
          <p className="text-gray-500">
            Choose from our curated collection of premium gifts for your recipients.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {selectedGifts.size} gift(s) selected
          </p>
          <p className="text-2xl font-bold text-linden-blue">${getTotalCost().toFixed(2)}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-linden-blue hover:bg-linden-blue/90" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => {
          const isSelected = selectedGifts.has(gift.id);
          
          return (
            <Card 
              key={gift.id} 
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isSelected ? 'ring-2 ring-linden-blue bg-linden-lightblue' : ''
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
                    {isSelected && (
                      <div className="bg-linden-blue text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {gift.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{gift.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{gift.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{gift.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-linden-blue">
                      ${gift.price}
                    </span>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGiftSelection(gift.id);
                      }}
                      className={isSelected ? "bg-linden-blue hover:bg-linden-blue/90" : ""}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {selectedGifts.size > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Selected Gifts</h3>
                <p className="text-sm text-gray-500">
                  {selectedGifts.size} gift(s) selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${getTotalCost().toFixed(2)}</p>
                <Button className="mt-2">Continue to Personalization</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectGifts;
