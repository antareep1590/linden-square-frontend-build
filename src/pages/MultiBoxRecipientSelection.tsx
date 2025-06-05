
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Users, Package, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const MultiBoxRecipientSelection = () => {
  const navigate = useNavigate();
  const { giftBoxes, recipients, assignRecipientsToBox } = useCart();
  const [selectedBoxId, setSelectedBoxId] = useState<string>(giftBoxes[0]?.id || '');
  const [boxAssignments, setBoxAssignments] = useState<Record<string, string[]>>(
    Object.fromEntries(giftBoxes.map(box => [box.id, box.assignedRecipients]))
  );

  const handleRecipientToggle = (recipientId: string, isChecked: boolean) => {
    if (!selectedBoxId) return;

    setBoxAssignments(prev => ({
      ...prev,
      [selectedBoxId]: isChecked 
        ? [...(prev[selectedBoxId] || []), recipientId]
        : (prev[selectedBoxId] || []).filter(id => id !== recipientId)
    }));
  };

  const isRecipientAssigned = (recipientId: string) => {
    return boxAssignments[selectedBoxId]?.includes(recipientId) || false;
  };

  const handleContinue = () => {
    // Update all box assignments
    Object.entries(boxAssignments).forEach(([boxId, recipientIds]) => {
      assignRecipientsToBox(boxId, recipientIds);
    });

    navigate('/final-summary');
  };

  const getTotalAssignedRecipients = () => {
    return Object.values(boxAssignments).reduce((total, assignments) => 
      total + assignments.length, 0
    );
  };

  const getBoxAssignmentCount = (boxId: string) => {
    return boxAssignments[boxId]?.length || 0;
  };

  if (giftBoxes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Assign Recipients</h1>
            <p className="text-gray-600">No gift boxes found. Please add gift boxes first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Assign Recipients to Gift Boxes</h1>
          <p className="text-gray-600">Select which recipients will receive each gift box</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gift Box Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gift Boxes ({giftBoxes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {giftBoxes.map((box) => (
              <div
                key={box.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedBoxId === box.id
                    ? 'border-linden-blue bg-linden-blue/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBoxId(box.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{box.name}</h3>
                    <div className="flex gap-1 mt-1">
                      {box.size && <Badge variant="outline" className="text-xs">{box.size}</Badge>}
                      {box.theme && <Badge variant="outline" className="text-xs">{box.theme}</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{getBoxAssignmentCount(box.id)} recipients</p>
                    <p className="text-xs text-gray-600">${box.basePrice.toFixed(2)} base</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recipients Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recipients for: {giftBoxes.find(b => b.id === selectedBoxId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recipients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recipients found. Please add recipients first.</p>
                <Button 
                  onClick={() => navigate('/recipient-selection')}
                  className="mt-4"
                >
                  Add Recipients
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isRecipientAssigned(recipient.id)}
                        onCheckedChange={(checked) => 
                          handleRecipientToggle(recipient.id, checked as boolean)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{recipient.name}</p>
                          <p className="text-sm text-gray-600">{recipient.email}</p>
                        </div>
                      </div>
                    </div>
                    {recipient.tag && (
                      <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary and Continue */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {giftBoxes.map((box) => (
              <div key={box.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{box.name}</span>
                  {box.size && box.theme && (
                    <span className="text-sm text-gray-600 ml-2">({box.size} {box.theme})</span>
                  )}
                </div>
                <Badge variant="secondary">
                  {getBoxAssignmentCount(box.id)} recipients assigned
                </Badge>
              </div>
            ))}
            
            <div className="border-t pt-3 flex justify-between items-center font-medium">
              <span>Total Recipients Assigned:</span>
              <span className="text-linden-blue">{getTotalAssignedRecipients()}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue}
            className="w-full mt-6 bg-linden-blue hover:bg-linden-blue/90"
            disabled={getTotalAssignedRecipients() === 0}
          >
            Continue to Order Summary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiBoxRecipientSelection;
