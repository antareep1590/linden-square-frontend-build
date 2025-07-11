
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GiftBox {
  id: string;
  type: 'preset' | 'custom';
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  theme: string;
  basePrice: number;
  image?: string; // Added image property
  gifts: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  personalization?: {
    selectedOptions: Map<string, string>;
    cardMessage: string;
    tagMessage: string;
    addOnsCost: number;
    selectedAddOns: Array<{
      name: string;
      price: number;
    }>;
  };
  assignedRecipients?: Array<{
    id: string;
    name: string;
    email: string;
    tag: string;
  }>;
}

interface CartContextType {
  selectedBoxes: GiftBox[];
  addBox: (box: GiftBox) => void;
  removeBox: (boxId: string) => void;
  updateBox: (boxId: string, updates: Partial<GiftBox>) => void;
  updateBoxGifts: (boxId: string, gifts: GiftBox['gifts']) => void;
  updateBoxPersonalization: (boxId: string, field: string, value: string) => void;
  clearCart: () => void;
  getTotalCost: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBoxes, setSelectedBoxes] = useState<GiftBox[]>([]);

  const addBox = (box: GiftBox) => {
    setSelectedBoxes(prev => [...prev, box]);
  };

  const removeBox = (boxId: string) => {
    setSelectedBoxes(prev => prev.filter(box => box.id !== boxId));
  };

  const updateBox = (boxId: string, updates: Partial<GiftBox>) => {
    setSelectedBoxes(prev => prev.map(box => 
      box.id === boxId ? { ...box, ...updates } : box
    ));
  };

  const updateBoxGifts = (boxId: string, gifts: GiftBox['gifts']) => {
    updateBox(boxId, { gifts });
  };

  const updateBoxPersonalization = (boxId: string, field: string, value: string) => {
    setSelectedBoxes(prev => prev.map(box => {
      if (box.id === boxId) {
        const updatedPersonalization = {
          ...box.personalization,
          selectedOptions: new Map(box.personalization?.selectedOptions || []),
          cardMessage: box.personalization?.cardMessage || '',
          tagMessage: box.personalization?.tagMessage || '',
          addOnsCost: box.personalization?.addOnsCost || 0,
          selectedAddOns: box.personalization?.selectedAddOns || []
        };
        
        if (field === 'giftMessage') {
          updatedPersonalization.cardMessage = value;
        } else if (field === 'senderName' || field === 'specialInstructions') {
          updatedPersonalization.selectedOptions.set(field, value);
        }
        
        return { ...box, personalization: updatedPersonalization };
      }
      return box;
    }));
  };

  const clearCart = () => {
    setSelectedBoxes([]);
  };

  const getTotalCost = () => {
    return selectedBoxes.reduce((total, box) => {
      const boxCost = box.basePrice + box.gifts.reduce((sum, gift) => sum + (gift.price * gift.quantity), 0);
      const personalizationCost = box.personalization?.addOnsCost || 0;
      return total + boxCost + personalizationCost;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      selectedBoxes,
      addBox,
      removeBox,
      updateBox,
      updateBoxGifts,
      updateBoxPersonalization,
      clearCart,
      getTotalCost
    }}>
      {children}
    </CartContext.Provider>
  );
};
