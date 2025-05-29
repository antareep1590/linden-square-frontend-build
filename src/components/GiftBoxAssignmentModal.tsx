
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Package } from "lucide-react";

interface Gift {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
}

interface GiftBoxAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  selectedGifts: Map<string, number>;
  availableGifts: Gift[];
  onAssignGifts: (packageId: string, assignments: Map<string, number>) => void;
  currentAssignments: Map<string, number>;
}

const GiftBoxAssignmentModal: React.FC<GiftBoxAssignmentModalProps> = ({
  isOpen,
  onClose,
  packageId,
  packageName,
  selectedGifts,
  availableGifts,
  onAssignGifts,
  currentAssignments
}) => {
  const [assignments, setAssignments] = useState<Map<string, number>>(new Map(currentAssignments));

  const updateAssignment = (giftId: string, quantity: number) => {
    const newAssignments = new Map(assignments);
    if (quantity <= 0) {
      newAssignments.delete(giftId);
    } else {
      // Check if we don't exceed the selected quantity
      const selectedQuantity = selectedGifts.get(giftId) || 0;
      if (quantity <= selectedQuantity) {
        newAssignments.set(giftId, quantity);
      }
    }
    setAssignments(newAssignments);
  };

  const getAssignedQuantity = (giftId: string) => {
    return assignments.get(giftId) || 0;
  };

  const getAvailableQuantity = (giftId: string) => {
    const selected = selectedGifts.get(giftId) || 0;
    const assigned = getAssignedQuantity(giftId);
    return selected - assigned;
  };

  const handleConfirm = () => {
    onAssignGifts(packageId, assignments);
    onClose();
  };

  const getTotalAssignedItems = () => {
    return Array.from(assignments.values()).reduce((sum, quantity) => sum + quantity, 0);
  };

  // Filter gifts to only show those that have been selected
  const giftsToShow = availableGifts.filter(gift => selectedGifts.has(gift.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assign Gifts to {packageName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-linden-lightblue p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Items to Assign:</span>
              <Badge variant="secondary">{getTotalAssignedItems()} items</Badge>
            </div>
          </div>

          {/* Gift Assignment List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Gifts for This Box:</h3>
            {giftsToShow.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No gifts selected yet. Please select gifts first.</p>
            ) : (
              <div className="grid gap-4">
                {giftsToShow.map((gift) => {
                  const selectedQty = selectedGifts.get(gift.id) || 0;
                  const assignedQty = getAssignedQuantity(gift.id);
                  const availableQty = getAvailableQuantity(gift.id);
                  
                  return (
                    <Card key={gift.id} className="p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <img 
                            src={gift.image} 
                            alt={gift.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{gift.name}</h4>
                            <p className="text-sm text-gray-600">${gift.price}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Selected: {selectedQty}
                              </Badge>
                              {assignedQty > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  In this box: {assignedQty}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAssignment(gift.id, Math.max(0, assignedQty - 1))}
                              disabled={assignedQty === 0}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium text-lg min-w-[2ch] text-center">
                              {assignedQty}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAssignment(gift.id, assignedQty + 1)}
                              disabled={assignedQty >= selectedQty}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              className="bg-linden-blue hover:bg-linden-blue/90"
            >
              Confirm Assignment ({getTotalAssignedItems()} items)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftBoxAssignmentModal;
