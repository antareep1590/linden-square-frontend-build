
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Mock data for gift boxes
const giftBoxes = [
  {
    id: '1',
    type: 'preset' as const,
    name: 'Premium Coffee Set',
    size: 'Medium' as const,
    theme: 'Corporate',
    basePrice: 75.00,
    image: '/placeholder.svg',
    gifts: [],
    description: 'Premium coffee selection with artisan chocolates'
  },
  {
    id: '2',
    type: 'preset' as const,
    name: 'Wellness Package',
    size: 'Large' as const,
    theme: 'Wellness',
    basePrice: 120.00,
    image: '/placeholder.svg',
    gifts: [],
    description: 'Self-care essentials for a balanced lifestyle'
  },
  {
    id: '3',
    type: 'preset' as const,
    name: 'Tech Starter Kit',
    size: 'Small' as const,
    theme: 'Technology',
    basePrice: 45.00,
    image: '/placeholder.svg',
    gifts: [],
    description: 'Essential tech accessories for modern professionals'
  },
  {
    id: '4',
    type: 'preset' as const,
    name: 'Gourmet Treats',
    size: 'Medium' as const,
    theme: 'Food & Beverage',
    basePrice: 85.00,
    image: '/placeholder.svg',
    gifts: [],
    description: 'Artisanal snacks and premium beverages'
  }
];

const BoxListing = () => {
  const navigate = useNavigate();
  const { addBox } = useCart();
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    size: '',
    theme: '',
    priceRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);

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
    setSelectedBoxes(prev => 
      prev.includes(boxId) 
        ? prev.filter(id => id !== boxId)
        : [...prev, boxId]
    );
  };

  const handleAddToCart = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please select at least one gift box');
      return;
    }

    selectedBoxes.forEach(boxId => {
      const box = giftBoxes.find(b => b.id === boxId);
      if (box) {
        addBox(box);
      }
    });

    toast.success(`${selectedBoxes.length} gift box(es) added to cart`);
    navigate('/customization');
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
          disabled={selectedBoxes.length === 0}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add Selected ({selectedBoxes.length})
        </Button>
      </div>

      {/* Compact Filter Bar */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {/* Filter Controls */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-200 ${showFilters ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="space-y-1">
            <label className="text-xs text-gray-600">Box Size</label>
            <Select value={filters.size} onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-600">Theme</label>
            <Select value={filters.theme} onValueChange={(value) => setFilters(prev => ({ ...prev, theme: value }))}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Any theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-600">Price Range</label>
            <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.size && (
              <Badge variant="outline" className="text-xs">
                Size: {filters.size}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => clearFilter('size')} />
              </Badge>
            )}
            {filters.theme && (
              <Badge variant="outline" className="text-xs">
                Theme: {filters.theme}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => clearFilter('theme')} />
              </Badge>
            )}
            {filters.priceRange && (
              <Badge variant="outline" className="text-xs">
                Price: {priceRanges.find(r => r.value === filters.priceRange)?.label}
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
              selectedBoxes.includes(box.id) ? 'ring-2 ring-linden-blue bg-blue-50' : ''
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
                  />
                </div>
                <div className="absolute top-3 right-3">
                  <Checkbox
                    checked={selectedBoxes.includes(box.id)}
                    onChange={() => handleBoxSelect(box.id)}
                    className="bg-white shadow-md"
                  />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {box.size}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm leading-tight">{box.name}</h3>
                  <span className="text-lg font-bold text-linden-blue">${box.basePrice}</span>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2">{box.description}</p>
                
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="outline" className="text-xs">
                    {box.theme}
                  </Badge>
                </div>
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
