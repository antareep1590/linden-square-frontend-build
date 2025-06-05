
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Package, Plus, Minus, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Recipient {
  id: string;
  name: string;
  email: string;
  address?: string;
  tag?: string;
}

interface GiftBoxAssignment {
  boxId: string;
  recipients: string[];
}

const RecipientSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: 'John Smith', email: 'john@company.com', tag: 'Client' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@partner.com', tag: 'Partner' }
  ]);
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '', tag: '' });
  const [assignments, setAssignments] = useState<GiftBoxAssignment[]>([]);

  // Mock multiple gift boxes data
  const giftBoxes = [
    {
      id: 'box-1',
      name: 'Premium Coffee Collection',
      price: 85,
      personalization: { ribbon: 'Gold', message: 'Thank you!' }
    },
    {
      id: 'box-2', 
      name: 'Wellness Starter Kit',
      price: 65,
      personalization: { ribbon: 'Blue', message: 'Stay healthy!' }
    }
  ];

  const addRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      const recipient: Recipient = {
        id: Date.now().toString(),
        ...newRecipient
      };
      setRecipients([...recipients, recipient]);
      setNewRecipient({ name: '', email: '', tag: '' });
    }
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    // Remove from assignments
    setAssignments(assignments.map(assignment => ({
      ...assignment,
      recipients: assignment.recipients.filter(recipientId => recipientId !== id)
    })));
  };

  const assignRecipientToBox = (recipientId: string, boxId: string) => {
    setAssignments(prev => {
      const existing = prev.find(a => a.boxId === boxId);
      if (existing) {
        if (existing.recipients.includes(recipientId)) {
          // Remove assignment
          return prev.map(a => 
            a.boxId === boxId 
              ? { ...a, recipients: a.recipients.filter(r => r !== recipientId) }
              : a
          );
        } else {
          // Add assignment
          return prev.map(a => 
            a.boxId === boxId 
              ? { ...a, recipients: [...a.recipients, recipientId] }
              : a
          );
        }
      } else {
        // Create new assignment
        return [...prev, { boxId, recipients: [recipientId] }];
      }
    });
  };

  const isRecipientAssignedToBox = (recipientId: string, boxId: string) => {
    const assignment = assignments.find(a => a.boxId === boxId);
    return assignment?.recipients.includes(recipientId) || false;
  };

  const getAssignedRecipientsCount = (boxId: string) => {
    const assignment = assignments.find(a => a.boxId === boxId);
    return assignment?.recipients.length || 0;
  };

  const handleContinue = () => {
    const finalData = {
      ...location.state,
      recipients,
      assignments,
      giftBoxes
    };
    navigate('/final-summary', { state: finalData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Assign Recipients</h1>
          <p className="text-gray-600">Assign recipients to your selected gift boxes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipients Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
              />
              <Select 
                value={newRecipient.tag} 
                onValueChange={(value) => setNewRecipient(prev => ({ ...prev, tag: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tag (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addRecipient} className="w-full bg-linden-blue hover:bg-linden-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients ({recipients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recipients.map(recipient => (
                  <div key={recipient.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{recipient.name}</p>
                      <p className="text-xs text-gray-600">{recipient.email}</p>
                    </div>
                    {recipient.tag && (
                      <Badge variant="secondary" className="text-xs mr-2">{recipient.tag}</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecipient(recipient.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gift Box Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {giftBoxes.map(box => (
            <Card key={box.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {box.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">${box.price}</Badge>
                    <Badge className="bg-linden-blue">
                      {getAssignedRecipientsCount(box.id)} assigned
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipients.map(recipient => {
                    const isAssigned = isRecipientAssignedToBox(recipient.id, box.id);
                    return (
                      <div
                        key={recipient.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isAssigned 
                            ? 'border-linden-blue bg-linden-lightblue' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => assignRecipientToBox(recipient.id, box.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{recipient.name}</p>
                            <p className="text-xs text-gray-600">{recipient.email}</p>
                          </div>
                          {recipient.tag && (
                            <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button 
              onClick={handleContinue}
              className="bg-linden-blue hover:bg-linden-blue/90"
              disabled={assignments.length === 0 || assignments.every(a => a.recipients.length === 0)}
            >
              Continue to Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientSelection;
