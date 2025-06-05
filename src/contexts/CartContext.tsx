
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GiftBox {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  size?: string;
  theme?: string;
  basePrice: number;
  image?: string;
  selectedGifts: Map<string, number>;
  personalization?: {
    ribbonColor?: string;
    giftWrap?: string;
    cardMessage?: string;
    selectedAddOns?: Array<{ name: string; price: number }>;
    addOnsCost: number;
  };
  assignedRecipients: string[]; // recipient IDs
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tag?: string;
}

interface CartContextType {
  giftBoxes: GiftBox[];
  recipients: Recipient[];
  addGiftBox: (box: GiftBox) => void;
  updateGiftBox: (boxId: string, updates: Partial<GiftBox>) => void;
  removeGiftBox: (boxId: string) => void;
  addRecipient: (recipient: Recipient) => void;
  updateRecipient: (recipientId: string, updates: Partial<Recipient>) => void;
  removeRecipient: (recipientId: string) => void;
  assignRecipientsToBox: (boxId: string, recipientIds: string[]) => void;
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

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const addGiftBox = (box: GiftBox) => {
    setGiftBoxes(prev => [...prev, { ...box, id: box.id || Date.now().toString() }]);
  };

  const updateGiftBox = (boxId: string, updates: Partial<GiftBox>) => {
    setGiftBoxes(prev => prev.map(box => 
      box.id === boxId ? { ...box, ...updates } : box
    ));
  };

  const removeGiftBox = (boxId: string) => {
    setGiftBoxes(prev => prev.filter(box => box.id !== boxId));
  };

  const addRecipient = (recipient: Recipient) => {
    setRecipients(prev => [...prev, recipient]);
  };

  const updateRecipient = (recipientId: string, updates: Partial<Recipient>) => {
    setRecipients(prev => prev.map(recipient => 
      recipient.id === recipientId ? { ...recipient, ...updates } : recipient
    ));
  };

  const removeRecipient = (recipientId: string) => {
    setRecipients(prev => prev.filter(recipient => recipient.id !== recipientId));
    // Also remove from all box assignments
    setGiftBoxes(prev => prev.map(box => ({
      ...box,
      assignedRecipients: box.assignedRecipients.filter(id => id !== recipientId)
    })));
  };

  const assignRecipientsToBox = (boxId: string, recipientIds: string[]) => {
    setGiftBoxes(prev => prev.map(box => 
      box.id === boxId ? { ...box, assignedRecipients: recipientIds } : box
    ));
  };

  const clearCart = () => {
    setGiftBoxes([]);
    setRecipients([]);
  };

  const getTotalCost = () => {
    return giftBoxes.reduce((total, box) => {
      let boxTotal = box.basePrice;
      
      // Add gift costs
      box.selectedGifts.forEach((quantity, giftId) => {
        // Mock price calculation - in real app, you'd look up actual prices
        const giftPrice = 25.00; // placeholder
        boxTotal += giftPrice * quantity;
      });
      
      // Add personalization costs
      if (box.personalization) {
        boxTotal += box.personalization.addOnsCost;
      }
      
      // Multiply by number of assigned recipients
      boxTotal *= box.assignedRecipients.length;
      
      return total + boxTotal;
    }, 0);
  };

  const value: CartContextType = {
    giftBoxes,
    recipients,
    addGiftBox,
    updateGiftBox,
    removeGiftBox,
    addRecipient,
    updateRecipient,
    removeRecipient,
    assignRecipientsToBox,
    clearCart,
    getTotalCost
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
