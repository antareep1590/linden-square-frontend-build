import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Star, Gift, Package, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface GiftBoxOption {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  image: string;
  size: 'Small' | 'Medium' | 'Large';
  theme: string;
  priceRange: string;
  basePrice: number;
  defaultGifts: number;
  rating?: number;
  description: string;
  products?: string[];
  gifts: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
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
    basePrice: 85.00,
    defaultGifts: 5,
    rating: 4.8,
    description: 'Pre-curated birthday celebration with premium gifts and festive touches',
    products: ['chocolates', 'candles', 'coffee', 'cards'],
    gifts: [
      { id: '1', name: 'Premium Coffee Set', price: 24.99, quantity: 1 },
      { id: '2', name: 'Gourmet Chocolate Box', price: 19.99, quantity: 1 },
      { id: '3', name: 'Scented Candle', price: 15.99, quantity: 1 },
      { id: '4', name: 'Artisan Tea Collection', price: 22.99, quantity: 1 },
      { id: '5', name: 'Premium Notebook', price: 18.99, quantity: 1 }
    ]
  },
  {
    id: 'preset-2',
    name: 'Professional Welcome Box',
    type: 'preset',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    size: 'Large',
    theme: 'Professional',
    priceRange: '$120 - $150',
    basePrice: 135.00,
    defaultGifts: 7,
    rating: 4.9,
    description: 'Sophisticated welcome package for new team members and clients',
    products: ['notebook', 'coffee', 'tech-accessories', 'wellness'],
    gifts: [
      { id: '6', name: 'Executive Notebook', price: 29.99, quantity: 1 },
      { id: '7', name: 'Premium Coffee Blend', price: 34.99, quantity: 1 },
      { id: '8', name: 'Tech Accessories Kit', price: 49.99, quantity: 1 },
      { id: '9', name: 'Wellness Set', price: 39.99, quantity: 1 }
    ]
  },
  {
    id: 'preset-3',
    name: 'Festive Holiday Box',
    type: 'preset',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    size: 'Small',
    theme: 'Holiday',
    priceRange: '$45 - $65',
    basePrice: 55.00,
    defaultGifts: 4,
    rating: 4.7,
    description: 'Warm holiday greetings with seasonal treats and decorations',
    products: ['chocolates', 'candles', 'ornaments', 'cards'],
    gifts: [
      { id: '10', name: 'Holiday Chocolates', price: 16.99, quantity: 1 },
      { id: '11', name: 'Festive Candle', price: 12.99, quantity: 1 },
      { id: '12', name: 'Holiday Ornament', price: 8.99, quantity: 1 },
      { id: '13', name: 'Greeting Cards Set', price: 5.99, quantity: 1 }
    ]
  }
];

const BoxListing = () => {
  const navigate = useNavigate();
  const { selectedBoxes, addBox } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  const [productFilterType, setProductFilterType] = useState<'include' | 'exclude'>('include');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBoxIds, setSelectedBoxIds] = useState<Set<string>>(new Set());

  const allBoxes = presetBoxes;
  const themes = ['All', 'Birthday', 'Professional', 'Holiday', 'Custom'];
  const sizes = ['All', 'Small', 'Medium', 'Large'];
  const priceRanges = ['All', 'Under $50', '$50 - $100', 'Over $100'];
  const products = ['All', 'chocolates', 'candles', 'coffee', 'notebook', 'tech-accessories', 'wellness', 'ornaments', 'cards'];

  const filteredBoxes = allBoxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         box.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'All' || box.theme === selectedTheme;
    const matchesSize = selectedSize === 'All' || box.size === selectedSize;
    
    let matchesProduct = true;
    if (selectedProduct && selectedProduct !== 'All' && box.products) {
      if (productFilterType === 'include') {
        matchesProduct = box.products.includes(selectedProduct);
      } else {
        matchesProduct = !box.products.includes(selectedProduct);
      }
    }
    
    return matchesSearch && matchesTheme && matchesSize && matchesProduct;
  });

  const handleBoxSelect = (box: GiftBoxOption) => {
    const newSelectedBoxIds = new Set(selectedBoxIds);
    
    if (selectedBoxIds.has(box.id)) {
      newSelectedBoxIds.delete(box.id);
      toast.success(`${box.name} removed from selection`);
    } else {
      newSelectedBoxIds.add(box.id);
      const cartBox = {
        id: `${box.id}-${Date.now()}`, // Unique ID for cart
        type: box.type,
        name: box.name,
        size: box.size,
        theme: box.theme,
        basePrice: box.basePrice,
        gifts: [...box.gifts]
      };
      addBox(cartBox);
      toast.success(`${box.name} added to selection`);
    }
    
    setSelectedBoxIds(newSelectedBoxIds);
  };

  const handleCustomizeSelected = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please select at least one box first');
      return;
    }
    navigate('/personalization');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Choose Your Gift Box</h1>
          <p className="text-gray-600">Select from our curated collections or build your own custom box</p>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedBoxes.length > 0 && (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">{selectedBoxes.length} box(es) selected</span>
            </div>
          )}
          <Button 
            onClick={handleCustomizeSelected}
            className="bg-linden-blue hover:bg-linden-blue/90"
            disabled={selectedBoxes.length === 0}
          >
            Customize Selected
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search boxes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
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
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Size</label>
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
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
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

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Products</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant={productFilterType === 'include' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProductFilterType('include')}
                      className="text-xs"
                    >
                      Include
                    </Button>
                    <Button
                      variant={productFilterType === 'exclude' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProductFilterType('exclude')}
                      className="text-xs"
                    >
                      Exclude
                    </Button>
                  </div>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product} value={product}>{product}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoxes.map((box) => {
          const isSelected = selectedBoxIds.has(box.id);
          
          return (
            <Card 
              key={box.id} 
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isSelected ? 'ring-2 ring-linden-blue bg-blue-50' : ''
              }`}
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
                  {isSelected && (
                    <div className="absolute inset-0 bg-linden-blue/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2">
                        <ShoppingCart className="h-6 w-6 text-linden-blue" />
                      </div>
                    </div>
                  )}
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
                        {box.defaultGifts} items
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {box.theme}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold text-linden-blue">{box.priceRange}</span>
                    <Button 
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={isSelected ? "bg-linden-blue hover:bg-linden-blue/90" : "hover:bg-linden-blue hover:text-white"}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Box Option */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-linden-blue transition-colors">
        <CardContent className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Build Your Own Box</h3>
          <p className="text-gray-600 mb-4">Create a completely personalized gift box from scratch</p>
          <Button 
            onClick={() => navigate('/build-custom-box')}
            className="bg-purple-500 hover:bg-purple-500/90"
          >
            Start Building
          </Button>
        </CardContent>
      </Card>

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
