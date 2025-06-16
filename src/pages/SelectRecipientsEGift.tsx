
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Upload, Trash2, Users, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock gift boxes - in real app this would come from previous selection
  const availableBoxes = [
    { id: '1', name: 'Wellness Collection' },
    { id: '2', name: 'Gourmet Treats' }
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
    toast.success('Recipient removed');
  };

  const updateRecipientBoxes = (recipientId: string, boxIds: string[]) => {
    setRecipients(recipients.map(r => 
      r.id === recipientId ? { ...r, assignedBoxes: boxIds } : r
    ));
  };

  const assignAllToBox = (boxId: string) => {
    setRecipients(recipients.map(r => ({
      ...r,
      assignedBoxes: [...new Set([...r.assignedBoxes, boxId])]
    })));
    toast.success(`All recipients assigned to ${availableBoxes.find(b => b.id === boxId)?.name}`);
  };

  const handleContinue = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
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

  const getAssignedBoxNames = (boxIds: string[]) => {
    return boxIds.map(id => availableBoxes.find(box => box.id === id)?.name).filter(Boolean);
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
        <div className="lg:col-span-3">
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

          {/* Assign Recipients to Gift Boxes Section */}
          {recipients.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Assign Recipients to Gift Boxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick assign all buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableBoxes.map((box) => (
                    <Button
                      key={box.id}
                      variant="outline"
                      size="sm"
                      onClick={() => assignAllToBox(box.id)}
                    >
                      Assign All to {box.name}
                    </Button>
                  ))}
                </div>

                {/* Individual assignments */}
                <div className="space-y-3">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{recipient.firstName} {recipient.lastName}</div>
                        <div className="text-sm text-gray-600">{recipient.email}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableBoxes.map((box) => (
                          <div key={box.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${recipient.id}-${box.id}`}
                              checked={recipient.assignedBoxes.includes(box.id)}
                              onCheckedChange={(checked) => {
                                const newBoxes = checked
                                  ? [...recipient.assignedBoxes, box.id]
                                  : recipient.assignedBoxes.filter(id => id !== box.id);
                                updateRecipientBoxes(recipient.id, newBoxes);
                              }}
                            />
                            <label htmlFor={`${recipient.id}-${box.id}`} className="text-sm">
                              {box.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
