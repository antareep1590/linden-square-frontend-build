
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Truck, Save, Plus, Edit, Trash2, Users, CheckCircle, AlertCircle, DollarSign, Clock, X, Info } from 'lucide-react';
import { toast } from 'sonner';
import AddRecipientModal from '@/components/AddRecipientModal';

interface GiftBox {
  id: string;
  name: string;
  theme: string;
}

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  status: 'pending' | 'confirmed';
  shippingMode: string;
  cost: string;
  source: 'manual' | 'bulk' | 'auto';
  assignedGiftBoxes?: string[];
}

const StandaloneShipping = () => {
  const [autoAssignMode, setAutoAssignMode] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);

  // Mock available gift boxes for defaults
  const availableGiftBoxes: GiftBox[] = [
    { id: '1', name: 'Premium Coffee Collection', theme: 'Appreciation' },
    { id: '2', name: 'Wellness Package', theme: 'Wellness' },
    { id: '3', name: 'Tech Accessories Kit', theme: 'Professional' },
    { id: '4', name: 'Gourmet Snacks Box', theme: 'Hospitality' }
  ];

  // Sample default recipients with gift box assignments
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Marketing',
      address: '123 Main St, New York, NY 10001',
      status: 'confirmed',
      shippingMode: 'FedEx Express',
      cost: '$12.50',
      source: 'manual',
      assignedGiftBoxes: ['1', '2']
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Engineering',
      address: '456 Oak Ave, San Francisco, CA 94102',
      status: 'confirmed',
      shippingMode: 'UPS Ground',
      cost: '$11.75',
      source: 'bulk',
      assignedGiftBoxes: ['3']
    }
  ]);

  // Mock shipping carriers data
  const carriers = [
    {
      id: 'fedex',
      name: 'FedEx',
      services: ['Standard', 'Express', 'Overnight'],
      estimatedCost: '$12.50',
      estimatedDays: '2-3 business days'
    },
    {
      id: 'ups',
      name: 'UPS',
      services: ['Ground', 'Express', 'Next Day'],
      estimatedCost: '$11.75',
      estimatedDays: '3-5 business days'
    },
    {
      id: 'dhl',
      name: 'DHL',
      services: ['Standard', 'Express', 'Priority'],
      estimatedCost: '$15.20',
      estimatedDays: '2-4 business days'
    },
    {
      id: 'usps',
      name: 'USPS',
      services: ['Priority', 'Express', 'Ground'],
      estimatedCost: '$9.99',
      estimatedDays: '3-5 business days'
    }
  ];

  const handleSaveDefaults = () => {
    const shippingDefaults = {
      autoAssignMode,
      selectedCarrier,
      recipients,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('shippingDefaults', JSON.stringify(shippingDefaults));
    toast.success('Shipping defaults saved successfully');
    console.log('Saved shipping defaults:', shippingDefaults);
  };

  const handleAddRecipient = (recipientData: Omit<Recipient, 'id'>) => {
    if (editingRecipient) {
      setRecipients(prev => prev.map(r => 
        r.id === editingRecipient.id 
          ? { ...recipientData, id: editingRecipient.id, cost: '$12.50' }
          : r
      ));
      setEditingRecipient(null);
    } else {
      const newRecipient: Recipient = {
        ...recipientData,
        id: Math.max(...recipients.map(r => r.id), 0) + 1,
        cost: '$12.50',
        source: 'manual'
      };
      setRecipients(prev => [...prev, newRecipient]);
    }
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setShowAddRecipient(true);
  };

  const handleDeleteRecipient = (id: number) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    setSelectedRecipients(prev => prev.filter(selectedId => selectedId !== id));
    toast.success('Recipient removed');
  };

  const handleSelectRecipient = (id: number) => {
    setSelectedRecipients(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === recipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(recipients.map(r => r.id));
    }
  };

  const handleGiftBoxAssignment = (recipientId: number, giftBoxIds: string[]) => {
    setRecipients(prev => prev.map(r => {
      if (r.id === recipientId) {
        const hasAddress = r.address.trim() !== '';
        const hasGiftBoxes = giftBoxIds.length > 0;
        const newStatus = hasAddress && hasGiftBoxes ? 'confirmed' : 'pending';
        
        return {
          ...r,
          assignedGiftBoxes: giftBoxIds,
          status: newStatus
        };
      }
      return r;
    }));
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'bulk': return 'bg-green-100 text-green-800';
      case 'auto': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGiftBoxDisplayName = (giftBoxId: string) => {
    const giftBox = availableGiftBoxes.find(box => box.id === giftBoxId);
    return giftBox ? `${giftBox.name} (${giftBox.theme})` : 'Unknown Gift Box';
  };

  const getTotalShippingCost = () => {
    return recipients.reduce((total, recipient) => {
      const cost = parseFloat(recipient.cost?.replace('$', '') || '0');
      return total + cost;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping & Fulfillment Defaults</h1>
          <p className="text-gray-600">Set up default shipping preferences and recipient management</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSaveDefaults}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Defaults
          </Button>
        </div>
      </div>

      {/* How This Works Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">How This Works</h3>
              <p className="text-sm text-blue-800">
                All shipping preferences and recipient data added here will auto-fill during the order process. You can still make edits while placing an order.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Default Shipping Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Default Shipping Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-assign carriers by default</h4>
                  <p className="text-sm text-gray-600">
                    Automatically select the best carrier for each recipient based on location and preferences
                  </p>
                </div>
                <Switch
                  checked={autoAssignMode}
                  onCheckedChange={setAutoAssignMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Choose Default Shipping Carrier */}
          {!autoAssignMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Choose Default Shipping Carrier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carriers.map((carrier) => (
                    <div
                      key={carrier.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCarrier === carrier.id
                          ? 'border-linden-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCarrier(carrier.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{carrier.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {carrier.services.join(', ')}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{carrier.estimatedCost}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{carrier.estimatedDays}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Default Recipient Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Default Recipient Management ({recipients.length})
                </CardTitle>
                <Button
                  onClick={() => setShowAddRecipient(true)}
                  className="bg-linden-blue hover:bg-linden-blue/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage default recipients that will pre-populate in your orders. Each recipient must have an address and at least one gift box assigned to be confirmed.
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedRecipients.length === recipients.length && recipients.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Gift Box Assignment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Shipping</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipients.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRecipients.includes(recipient.id)}
                              onCheckedChange={() => handleSelectRecipient(recipient.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{recipient.name}</p>
                              <p className="text-sm text-gray-600">{recipient.email}</p>
                              {recipient.department && (
                                <p className="text-xs text-gray-500">{recipient.department}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-48">
                            <p className="text-sm truncate">{recipient.address || 'Not provided'}</p>
                          </TableCell>
                          <TableCell className="max-w-64">
                            <div className="space-y-1">
                              <Select
                                onValueChange={(value) => {
                                  const currentBoxes = recipient.assignedGiftBoxes || [];
                                  if (!currentBoxes.includes(value)) {
                                    handleGiftBoxAssignment(recipient.id, [...currentBoxes, value]);
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Assign gift box" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableGiftBoxes
                                    .filter(box => !recipient.assignedGiftBoxes?.includes(box.id))
                                    .map((giftBox) => (
                                      <SelectItem key={giftBox.id} value={giftBox.id} className="text-xs">
                                        {getGiftBoxDisplayName(giftBox.id)}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              
                              {/* Display assigned gift boxes */}
                              {recipient.assignedGiftBoxes && recipient.assignedGiftBoxes.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {recipient.assignedGiftBoxes.map((giftBoxId) => (
                                    <Badge key={giftBoxId} variant="secondary" className="text-xs flex items-center gap-1">
                                      {availableGiftBoxes.find(box => box.id === giftBoxId)?.name || 'Unknown'}
                                      <button
                                        onClick={() => {
                                          const updatedBoxes = recipient.assignedGiftBoxes?.filter(id => id !== giftBoxId) || [];
                                          handleGiftBoxAssignment(recipient.id, updatedBoxes);
                                        }}
                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                      >
                                        <X className="h-2 w-2" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {recipient.status === 'confirmed' ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{recipient.shippingMode || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{recipient.cost || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getSourceBadgeColor(recipient.source)}`}>
                              {recipient.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditRecipient(recipient)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteRecipient(recipient.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedRecipients.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedRecipients.length} recipient(s) selected
                    </span>
                    <Button variant="outline" size="sm">
                      Assign Carrier
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Selected
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Defaults Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Shipping Mode:</span>
                  <span className="font-medium">
                    {autoAssignMode ? 'Auto-assign' : 'Manual selection'}
                  </span>
                </div>
                
                {!autoAssignMode && selectedCarrier && (
                  <div className="flex justify-between text-sm">
                    <span>Default Carrier:</span>
                    <span className="font-medium">
                      {carriers.find(c => c.id === selectedCarrier)?.name}
                    </span>
                  </div>
                )}

                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Total Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Confirmed:</span>
                  <span className="font-medium text-green-600">
                    {recipients.filter(r => r.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending:</span>
                  <span className="font-medium text-orange-600">
                    {recipients.filter(r => r.status === 'pending').length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Est. Default Cost:</span>
                  <span>${getTotalShippingCost().toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleSaveDefaults}
              >
                <Save className="h-4 w-4 mr-2" />
                Save These Defaults
              </Button>

              <div className="text-xs text-gray-500 text-center">
                These settings will pre-fill in future orders and can be edited during order creation
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AddRecipientModal
        open={showAddRecipient}
        onOpenChange={(open) => {
          setShowAddRecipient(open);
          if (!open) setEditingRecipient(null);
        }}
        onAddRecipient={handleAddRecipient}
        editingRecipient={editingRecipient}
        availableGiftBoxes={availableGiftBoxes}
      />
    </div>
  );
};

export default StandaloneShipping;
