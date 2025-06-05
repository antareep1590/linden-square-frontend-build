
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
}

interface ExpandedGiftCatalogProps {
  gifts: Gift[];
  selectedGifts: Map<string, number>;
  onUpdateQuantity: (giftId: string, quantity: number, included: boolean) => void;
}

const expandedGifts: Gift[] = [
  {
    id: '1',
    name: 'Premium Coffee Set',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    price: 24.99,
    description: 'Artisan coffee selection with premium brewing accessories',
    category: 'Beverages'
  },
  {
    id: '2',
    name: 'Gourmet Chocolate Box',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
    price: 19.99,
    description: 'Hand-selected premium chocolates',
    category: 'Food'
  },
  {
    id: '3',
    name: 'Scented Candle',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    price: 15.99,
    description: 'Luxury scented candle with 40-hour burn time',
    category: 'Home'
  },
  {
    id: '4',
    name: 'Wellness Kit',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
    price: 29.99,
    description: 'Complete wellness package with aromatherapy essentials',
    category: 'Health'
  },
  {
    id: '5',
    name: 'Premium Notebook Set',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    price: 34.99,
    description: 'Leather-bound notebook with premium paper',
    category: 'Stationery'
  },
  {
    id: '6',
    name: 'Tech Accessories Kit',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
    price: 45.99,
    description: 'Essential tech accessories for modern professionals',
    category: 'Technology'
  },
  {
    id: '7',
    name: 'Artisan Tea Collection',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
    price: 27.99,
    description: 'Curated selection of premium loose leaf teas',
    category: 'Beverages'
  },
  {
    id: '8',
    name: 'Skincare Essentials',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=200&fit=crop',
    price: 39.99,
    description: 'Natural skincare products for daily routine',
    category: 'Beauty'
  }
];

const ExpandedGiftCatalog: React.FC<ExpandedGiftCatalogProps> = ({
  selectedGifts,
  onUpdateQuantity
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {expandedGifts.map((gift) => {
        const quantity = selectedGifts.get(gift.id) || 0;
        const isSelected = quantity > 0;

        return (
          <div 
            key={gift.id}
            className={`border rounded-lg p-4 transition-all ${
              isSelected ? 'border-linden-blue bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <img 
                src={gift.image} 
                alt={gift.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{gift.name}</h4>
                <p className="text-sm text-gray-600">{gift.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{gift.category}</Badge>
                  <span className="font-bold text-linden-blue">${gift.price}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSelected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(gift.id, quantity - 1, quantity > 1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(gift.id, quantity + 1, true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(gift.id, 0, false)}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(gift.id, 1, true)}
                    className="bg-linden-blue text-white hover:bg-linden-blue/90"
                  >
                    Add to Box
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpandedGiftCatalog;
