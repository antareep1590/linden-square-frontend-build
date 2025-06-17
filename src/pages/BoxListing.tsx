
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filter, X, ShoppingCart, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Mock data for gift boxes with proper images and gift items
const giftBoxes = [
  {
    id: '1',
    type: 'preset' as const,
    name: 'Premium Coffee Set',
    size: 'Medium' as const,
    theme: 'Corporate',
    basePrice: 75.00,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
    gifts: [
      { id: '1', name: 'Artisan Coffee Beans', price: 25.00, quantity: 2 },
      { id: '2', name: 'Premium Chocolates', price: 15.00, quantity: 1 },
      { id: '3', name: 'Ceramic Mug', price: 20.00, quantity: 1 }
    ],
    description: 'Premium coffee selection with artisan chocolates'
  },
  {
    id: '2',
    type: 'preset' as const,
    name: 'Wellness Package',
    size: 'Large' as const,
    theme: 'Wellness',
    basePrice: 120.00,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop',
    gifts: [
      { id: '4', name: 'Essential Oil Set', price: 30.00, quantity: 1 },
      { id: '5', name: 'Bamboo Yoga Mat', price: 45.00, quantity: 1 },
      { id: '6', name: 'Herbal Tea Collection', price: 15.00, quantity: 3 },
      { id: '7', name: 'Meditation Guide', price: 12.00, quantity: 1 }
    ],
    description: 'Self-care essentials for a balanced lifestyle'
  },
  {
    id: '3',
    type: 'preset' as const,
    name: 'Tech Starter Kit',
    size: 'Small' as const,
    theme: 'Technology',
    basePrice: 45.00,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop',
    gifts: [
      { id: '8', name: 'Wireless Charger', price: 20.00, quantity: 1 },
      { id: '9', name: 'Phone Stand', price: 15.00, quantity: 1 },
      { id: '10', name: 'USB Cable Set', price: 10.00, quantity: 1 }
    ],
    description: 'Essential tech accessories for modern professionals'
  },
  {
    id: '4',
    type: 'preset' as const,
    name: 'Gourmet Treats',
    size: 'Medium' as const,
    theme: 'Food & Beverage',
    basePrice: 85.00,
    image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400&h=400&fit=crop',
    gifts: [
      { id: '11', name: 'Artisan Cheese Selection', price: 25.00, quantity: 1 },
      { id: '12', name: 'Craft Beer Variety Pack', price: 30.00, quantity: 6 },
      { id: '13', name: 'Gourmet Crackers', price: 8.00, quantity: 2 },
      { id: '14', name: 'Honey Jar', price: 12.00, quantity: 1 }
    ],
    description: 'Artisanal snacks and premium beverages'
  }
];

const BoxListing = () => {
  const navigate = useNavigate();
  const { addBox } = useCart();
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [expandedBoxes, setExpandedBoxes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    size: '',
    theme: '',
    priceRange: ''
  });

  const themes = ['Corporate', 'Wellness', 'Technology', 'Food & Beverage'];
  const sizes = ['Small', 'Medium', 'Large'];
  const priceRanges = [
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '100+' }
  ];

  const filteredBoxes = giftBoxes.filter(box => {
    if (filters.size && box.size !== filters.size) return false;
    if (filters.theme && box.theme !== filters.theme) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(x => x === '+' ? Infinity : parseInt(x));
      if (box.basePrice < min || (max !== Infinity && box.basePrice > max)) return false;
    }
    return true;
  });

  const handleBoxSelect = (boxId: string) => {
    // Only allow single selection
    setSelectedBoxId(selectedBoxId === boxId ? null : boxId);
  };

  const toggleBoxExpansion = (boxId: string) => {
    setExpandedBoxes(prev => 
      prev.includes(boxId)
        ? prev.filter(id => id !== boxId)
        : [...prev, boxId]
    );
  };

  const handleAddToCart = () => {
    if (!selectedBoxId) {
      toast.error('Please select a gift box');
      return;
    }

    const box = giftBoxes.find(b => b.id === selectedBoxId);
    if (box) {
      addBox(box);
      toast.success('Gift box added to cart');
      navigate('/recipient-selection'); // Navigate to recipients first
    }
  };

  const clearFilter = (filterType: string) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gift Theme Selection</h1>
          <p className="text-gray-600">Choose from our curated gift box collection</p>
        </div>
        <Button 
          onClick={handleAddToCart}
          disabled={!selectedBoxId}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Continue {selectedBoxId ? '(1)' : '(0)'}
        </Button>
      </div>

      {/* Compact Filter Bar */}
      <div className="bg-white border rounded-lg p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <Select value={filters.size} onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}>
              <SelectTrigger className="h-8 text-xs min-w-24">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.theme} onValueChange={(value) => setFilters(prev => ({ ...prev, theme: value }))}>
              <SelectTrigger className="h-8 text-xs min-w-32">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger className="h-8 text-xs min-w-28">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ size: '', theme: '', priceRange: '' })}
                className="h-8 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.size && (
              <Badge variant="outline" className="text-xs h-6">
                {filters.size}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => clearFilter('size')} />
              </Badge>
            )}
            {filters.theme && (
              <Badge variant="outline" className="text-xs h-6">
                {filters.theme}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => clearFilter('theme')} />
              </Badge>
            )}
            {filters.priceRange && (
              <Badge variant="outline" className="text-xs h-6">
                {priceRanges.find(r => r.value === filters.priceRange)?.label}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => clearFilter('priceRange')} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Gift Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBoxes.map((box) => (
          <Card 
            key={box.id} 
            className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
              selectedBoxId === box.id ? 'ring-2 ring-linden-blue bg-blue-50' : ''
            }`}
            onClick={() => handleBoxSelect(box.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-3 right-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedBoxId === box.id 
                      ? 'bg-linden-blue border-linden-blue' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedBoxId === box.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {box.size}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm leading-tight">{box.name}</h3>
                  <span className="text-lg font-bold text-linden-blue">${box.basePrice}</span>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2">{box.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {box.theme}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {box.gifts.length} items
                  </span>
                </div>

                {/* Gift Items Preview */}
                <Collapsible 
                  open={expandedBoxes.includes(box.id)} 
                  onOpenChange={() => toggleBoxExpansion(box.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full text-xs h-7" onClick={(e) => e.stopPropagation()}>
                      <Package className="h-3 w-3 mr-1" />
                      View Contents
                      {expandedBoxes.includes(box.id) ? 
                        <ChevronUp className="h-3 w-3 ml-1" /> : 
                        <ChevronDown className="h-3 w-3 ml-1" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      {box.gifts.map((gift, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-700">{gift.name}</span>
                          <span className="text-gray-500">×{gift.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBoxes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No gift boxes match your current filters</p>
          <Button variant="outline" onClick={() => setFilters({ size: '', theme: '', priceRange: '' })}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BoxListing;
