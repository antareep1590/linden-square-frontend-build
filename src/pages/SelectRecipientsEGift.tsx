
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Upload, Trash2, Users, CheckSquare, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import EGiftRecipientModal from '@/components/EGiftRecipientModal';

interface EGiftRecipient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  company?: string;
  giftMessage?: string;
  assignedBoxes: string[];
}

interface GiftBoxAssignment {
  [boxId: string]: string[];
}

const SelectRecipientsEGift = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<EGiftRecipient[]>([
    // Sample recipients to show table structure
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      assignedBoxes: ['1', '2']
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      company: 'Tech Solutions',
      city: 'San Francisco',
      state: 'CA',
      assignedBoxes: ['1']
    }
  ]);
  
  const [giftBoxAssignments, setGiftBoxAssignments] = useState<GiftBoxAssignment>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock gift boxes - in real app this would come from previous selection
  const availableBoxes = [
    { id: '1', name: 'Wellness Collection', theme: 'Health & Wellness', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { id: '2', name: 'Gourmet Treats', theme: 'Food & Beverage', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' }
  ];

  const handleAddRecipient = (newRecipient: Omit<EGiftRecipient, 'id'>) => {
    const recipient: EGiftRecipient = {
      id: Date.now().toString(),
      ...newRecipient
    };
    
    setRecipients([...recipients, recipient]);
    toast.success('Recipient added successfully');
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    
    // Remove from all gift box assignments
    const updatedAssignments = { ...giftBoxAssignments };
    Object.keys(updatedAssignments).forEach(boxId => {
      updatedAssignments[boxId] = updatedAssignments[boxId].filter(recipientId => recipientId !== id);
    });
    setGiftBoxAssignments(updatedAssignments);
    
    toast.success('Recipient removed');
  };

  const handleContinue = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }
    
    const hasAssignments = Object.values(giftBoxAssignments).some(assignments => assignments.length > 0);
    if (!hasAssignments) {
      toast.error('Please assign recipients to at least one gift box');
      return;
    }
    
    navigate('/egift-send-options');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock CSV processing
    setTimeout(() => {
      const mockRecipients: EGiftRecipient[] = [
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@example.com',
          company: 'Design Studio',
          assignedBoxes: ['1', '2']
        }
      ];
      
      setRecipients([...recipients, ...mockRecipients]);
      toast.success(`${mockRecipients.length} recipients imported from CSV`);
      event.target.value = '';
    }, 500);
  };

  const formatAddress = (recipient: EGiftRecipient) => {
    const parts = [
      recipient.addressLine1,
      recipient.addressLine2,
      recipient.city,
      recipient.state,
      recipient.postalCode,
      recipient.countryCode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };

  const handleRecipientAssignment = (boxId: string, recipientId: string, assigned: boolean) => {
    setGiftBoxAssignments(prev => {
      const currentAssignments = prev[boxId] || [];
      
      if (assigned) {
        return {
          ...prev,
          [boxId]: [...currentAssignments, recipientId]
        };
      } else {
        return {
          ...prev,
          [boxId]: currentAssignments.filter(id => id !== recipientId)
        };
      }
    });
  };

  const handleAssignAllToBox = (boxId: string) => {
    setGiftBoxAssignments(prev => ({
      ...prev,
      [boxId]: recipients.map(r => r.id.toString())
    }));
    toast.success(`All recipients assigned to ${availableBoxes.find(box => box.id === boxId)?.name}`);
  };

  const getAssignedRecipientCount = (boxId: string) => {
    return giftBoxAssignments[boxId]?.length || 0;
  };

  const isRecipientAssigned = (boxId: string, recipientId: string) => {
    return giftBoxAssignments[boxId]?.includes(recipientId) || false;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/customize-egift')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customization
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Select E-Gift Recipients</h1>
          <p className="text-gray-600">Add recipients who will receive digital gift notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recipients ({recipients.length})</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-linden-blue hover:bg-linden-blue/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recipients.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipients.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell className="font-medium">
                            {recipient.firstName} {recipient.lastName}
                          </TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell>{recipient.company || '-'}</TableCell>
                          <TableCell className="max-w-xs">
                            <span className="text-xs" title={formatAddress(recipient)}>
                              {formatAddress(recipient).length > 30 
                                ? `${formatAddress(recipient).substring(0, 30)}...`
                                : formatAddress(recipient)
                              }
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecipient(recipient.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recipients added yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding recipients manually or uploading a CSV file.
                  </p>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-linden-blue hover:bg-linden-blue/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Recipient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Section */}
          {recipients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Assign Recipients to Gift Boxes</CardTitle>
                <p className="text-gray-600 text-sm">
                  Select which gift boxes each recipient should receive
                </p>
              </CardHeader>
              <CardContent>
                {availableBoxes.length > 0 ? (
                  <div className="space-y-6">
                    {availableBoxes.map((box) => (
                      <div key={box.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={box.image || '/placeholder.svg'} 
                                alt={box.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{box.name}</h3>
                              <p className="text-sm text-gray-600">{box.theme}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getAssignedRecipientCount(box.id)} of {recipients.length} assigned
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignAllToBox(box.id)}
                              disabled={recipients.length === 0}
                            >
                              Assign All
                            </Button>
                          </div>
                        </div>
                        
                        {recipients.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {recipients.map((recipient) => (
                              <div key={recipient.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                <Checkbox
                                  id={`${box.id}-${recipient.id}`}
                                  checked={isRecipientAssigned(box.id, recipient.id)}
                                  onCheckedChange={(checked) => 
                                    handleRecipientAssignment(box.id, recipient.id, checked as boolean)
                                  }
                                />
                                <label 
                                  htmlFor={`${box.id}-${recipient.id}`} 
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  {recipient.firstName} {recipient.lastName}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Add recipients to assign them to this gift box
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No gift boxes selected
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-linden-blue">{recipients.length}</div>
                <div className="text-sm text-gray-600">Recipients Added</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Available Gift Boxes:</span>
                  <ul className="text-gray-600 mt-1">
                    {availableBoxes.map((box) => (
                      <li key={box.id} className="text-xs">• {box.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Gift Box Assignments:</h4>
                <div className="space-y-2">
                  {availableBoxes.map(box => (
                    <div key={box.id} className="flex justify-between text-sm">
                      <span className="truncate">{box.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {getAssignedRecipientCount(box.id)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                disabled={recipients.length === 0}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <EGiftRecipientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddRecipient}
        availableBoxes={availableBoxes}
      />
    </div>
  );
};

export default SelectRecipientsEGift;
