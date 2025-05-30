
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight } from "lucide-react";

// Define personalized gift interface
interface PersonalizedGift {
  id: string;
  name: string;
  image: string;
  recipient: string;
  message: string;
  note: string;
}

// Sample data with matching images and names
const samplePersonalizedGifts: PersonalizedGift[] = [
  {
    id: "1",
    name: "Gourmet Chocolate Box",
    image: "https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop",
    recipient: "Jane Smith",
    message: "",
    note: "",
  },
  {
    id: "2",
    name: "Premium Coffee Set",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop",
    recipient: "John Doe",
    message: "",
    note: "",
  },
  {
    id: "3",
    name: "Wellness Kit",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop",
    recipient: "Alice Johnson",
    message: "",
    note: "",
  },
  {
    id: "4",
    name: "Luxury Notebook",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
    recipient: "Michael Brown",
    message: "",
    note: "",
  }
];

const AddPersonalization = () => {
  const { toast } = useToast();
  const [gifts, setGifts] = useState<PersonalizedGift[]>(samplePersonalizedGifts);
  const [expandedGift, setExpandedGift] = useState<string | null>("1");

  // Handle updating a gift's personalization
  const handleGiftUpdate = (id: string, field: keyof PersonalizedGift, value: string) => {
    setGifts(gifts.map(gift => 
      gift.id === id ? { ...gift, [field]: value } : gift
    ));
  };

  // Handle saving all personalizations
  const handleSaveAll = () => {
    toast({
      title: "Personalizations saved",
      description: "Your gift personalizations have been saved successfully.",
    });
  };

  // Check if all required fields are filled for a gift
  const isGiftComplete = (gift: PersonalizedGift) => {
    return gift.recipient && gift.message;
  };

  // Count completed gifts
  const completedGiftsCount = gifts.filter(isGiftComplete).length;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Add Personalization</h1>
          <p className="text-gray-500">
            Customize each gift with personal messages for your recipients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{completedGiftsCount}/{gifts.length}</span> Complete
          </div>
          <Button onClick={handleSaveAll}>
            Save All Personalizations
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow">
        <Accordion 
          type="single" 
          collapsible 
          value={expandedGift || undefined} 
          onValueChange={(value) => setExpandedGift(value)}
        >
          {gifts.map((gift) => (
            <AccordionItem key={gift.id} value={gift.id}>
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 overflow-hidden rounded-lg border">
                      <img 
                        src={gift.image} 
                        alt={gift.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-lg">{gift.name}</p>
                      <p className="text-sm text-gray-500">
                        {gift.recipient || "No recipient selected"}
                      </p>
                    </div>
                  </div>
                  {isGiftComplete(gift) && (
                    <div className="flex items-center text-green-500 mr-4">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm">Complete</span>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <Label htmlFor={`recipient-${gift.id}`}>Recipient Name</Label>
                          <Input
                            id={`recipient-${gift.id}`}
                            value={gift.recipient}
                            onChange={(e) => handleGiftUpdate(gift.id, 'recipient', e.target.value)}
                            placeholder="Enter recipient's name"
                            className="mt-1"
                          />
                        </div>
                        <div className="mb-4">
                          <Label htmlFor={`message-${gift.id}`}>Gift Message</Label>
                          <Textarea
                            id={`message-${gift.id}`}
                            value={gift.message}
                            onChange={(e) => handleGiftUpdate(gift.id, 'message', e.target.value)}
                            placeholder="Write a personal message to include with this gift"
                            className="mt-1 resize-none"
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This message will be printed on a card and included with the gift.
                          </p>
                        </div>
                        <div>
                          <Label htmlFor={`note-${gift.id}`}>Special Instructions (Optional)</Label>
                          <Textarea
                            id={`note-${gift.id}`}
                            value={gift.note}
                            onChange={(e) => handleGiftUpdate(gift.id, 'note', e.target.value)}
                            placeholder="Any special instructions for this gift"
                            className="mt-1 resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-3">Message Preview</h3>
                        <div className="bg-white border rounded-md p-6 min-h-[200px] flex items-center justify-center">
                          {gift.message ? (
                            <div className="text-center max-w-xs">
                              <p className="italic">"{gift.message}"</p>
                              {gift.recipient && (
                                <p className="font-medium mt-4">- For {gift.recipient}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center">
                              Your personalized message will appear here
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end p-0 pt-4 gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setExpandedGift(
                        gifts.findIndex(g => g.id === gift.id) < gifts.length - 1 
                          ? gifts[gifts.findIndex(g => g.id === gift.id) + 1].id 
                          : null
                      )}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Personalization saved",
                          description: `Personalization for ${gift.name} has been saved.`,
                        });
                        
                        // Move to next gift if available
                        const currentIndex = gifts.findIndex(g => g.id === gift.id);
                        if (currentIndex < gifts.length - 1) {
                          setExpandedGift(gifts[currentIndex + 1].id);
                        } else {
                          setExpandedGift(null);
                        }
                      }}
                    >
                      Save & Continue <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button size="lg" onClick={handleSaveAll} disabled={completedGiftsCount < gifts.length}>
          {completedGiftsCount < gifts.length ? 
            `Complete All Personalizations (${completedGiftsCount}/${gifts.length})` : 
            "Save and Continue"
          }
        </Button>
      </div>
    </div>
  );
};

export default AddPersonalization;
