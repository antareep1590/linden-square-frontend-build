import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Filter, Search, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Gift {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  description: string;
  tag?: string;
}

interface SelectedGift {
  id: string;
  quantity: number;
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
    tag: 'premium',
  },
  {
    id: '2',
    name: 'Luxury Notebook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    price: 29.99,
    category: 'Stationery',
    rating: 4.6,
    description: 'Handcrafted leather notebook with premium paper',
    tag: 'luxury',
  },
  {
    id: '3',
    name: 'Wellness Kit',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
    price: 79.99,
    category: 'Health',
    rating: 4.9,
    description: 'Complete wellness package with aromatherapy essentials',
    tag: 'wellness',
  },
  {
    id: '4',
    name: 'Gourmet Chocolate Box',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400&h=300&fit=crop',
    price: 39.99,
    category: 'Food',
    rating: 4.7,
    description: 'Hand-selected premium chocolates from around the world',
    tag: 'gourmet',
  },
  {
    id: '5',
    name: 'Tech Accessories Kit',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    price: 89.99,
    category: 'Technology',
    rating: 4.5,
    description: 'Essential tech accessories for the modern professional',
    tag: 'modern',
  },
  {
    id: '6',
    name: 'Artisan Tea Collection',
    image: 'https://images.unsplash.com/photo-1597524661902-94d854b57796?w=400&h=300&fit=crop',
    price: 34.99,
    category: 'Beverages',
    rating: 4.6,
    description: 'Curated selection of premium teas from renowned gardens',
    tag: 'artisan',
  },
];

const categories = ['All', 'Beverages', 'Stationery', 'Health', 'Food', 'Technology'];
const tags = ['All', 'premium', 'luxury', 'wellness', 'gourmet', 'modern', 'artisan'];

const SelectGifts = () => {
  const [selectedGifts, setSelectedGifts] = useState<Map<string, number>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  const updateGiftQuantity = (giftId: string, quantity: number) => {
    const newSelection = new Map(selectedGifts);
    if (quantity <= 0) {
      newSelection.delete(giftId);
    } else {
      newSelection.set(giftId, quantity);
    }
    setSelectedGifts(newSelection);
  };

  const filteredGifts = gifts.filter(gift => {
    const categoryMatch = selectedCategory === 'All' || gift.category === selectedCategory;
    const tagMatch = selectedTag === 'All' || gift.tag === selectedTag;
    const priceMatch = gift.price >= priceRange[0] && gift.price <= priceRange[1];
    return categoryMatch && tagMatch && priceMatch;
  });

  const getTotalCost = () => {
    return Array.from(selectedGifts.entries()).reduce((total, [giftId, quantity]) => {
      const gift = gifts.find(g => g.id === giftId);
      return total + (gift?.price || 0) * quantity;
    }, 0);
  };

  const getTotalQuantity = () => {
    return Array.from(selectedGifts.values()).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Select Gifts</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {getTotalQuantity()} item(s) selected
          </p>
          <p className="text-2xl font-bold text-linden-blue">${getTotalCost().toFixed(2)}</p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Tag</label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => {
          const quantity = selectedGifts.get(gift.id) || 0;
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
                    {isSelected && (
                      <div className="bg-linden-blue text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-sm font-bold">{quantity}</span>
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
                    {gift.tag && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {gift.tag}
                      </Badge>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGiftQuantity(gift.id, quantity - 1)}
                        disabled={quantity <= 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGiftQuantity(gift.id, quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateGiftQuantity(gift.id, isSelected ? 0 : 1)}
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

      {filteredGifts.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No gifts match your current filters. Try adjusting your criteria.</p>
        </Card>
      )}

      {/* Summary */}
      {getTotalQuantity() > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Selected Gifts</h3>
                <p className="text-sm text-gray-500">
                  {getTotalQuantity()} item(s) selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${getTotalCost().toFixed(2)}</p>
                <Button className="mt-2 bg-linden-blue hover:bg-linden-blue/90">
                  Continue to Personalization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectGifts;
