
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
import { Package, Truck, CheckCircle, AlertCircle, DollarSign, Clock, Edit, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'confirmed';
  shippingMode: string;
  cost: string;
  assignedGiftBoxes?: string[];
}

const ShippingFulfillmentPublic = () => {
  const navigate = useNavigate();
  const [autoAssignMode, setAutoAssignMode] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [tempAddress, setTempAddress] = useState('');

  // Sample recipients (would come from previous step)
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      status: 'confirmed',
      shippingMode: 'FedEx Express',
      cost: '$12.50',
      assignedGiftBoxes: ['1']
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, San Francisco, CA 94102',
      status: 'confirmed',
      shippingMode: 'UPS Ground',
      cost: '$11.75',
      assignedGiftBoxes: ['1']
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

  const handleEditAddress = (recipientId: number, currentAddress: string) => {
    setEditingAddress(recipientId);
    setTempAddress(currentAddress);
  };

  const handleSaveAddress = (recipientId: number) => {
    setRecipients(prev => prev.map(r => 
      r.id === recipientId 
        ? { ...r, address: tempAddress, status: tempAddress.trim() ? 'confirmed' : 'pending' }
        : r
    ));
    setEditingAddress(null);
    setTempAddress('');
    toast.success('Address updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setTempAddress('');
  };

  const getTotalShippingCost = () => {
    return recipients.reduce((total, recipient) => {
      const cost = parseFloat(recipient.cost?.replace('$', '') || '0');
      return total + cost;
    }, 0);
  };

  const handleContinueToPayment = () => {
    const pendingRecipients = recipients.filter(r => r.status === 'pending');
    if (pendingRecipients.length > 0) {
      toast.error('Please ensure all recipients have valid addresses');
      return;
    }
    
    navigate('/public/payment-method', { 
      state: { 
        total: getTotalShippingCost() + 150.00, // Base order cost + shipping
        recipients: recipients.length
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Shipping & Fulfillment</h1>
              <p className="text-gray-600">Configure shipping preferences and verify recipient addresses</p>
            </div>
            <Button 
              onClick={handleContinueToPayment}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={recipients.filter(r => r.status === 'pending').length > 0}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Shipping Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-assign carriers</h4>
                    <p className="text-sm text-gray-600">
                      Automatically select the best carrier for each recipient based on location
                    </p>
                  </div>
                  <Switch
                    checked={autoAssignMode}
                    onCheckedChange={setAutoAssignMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Manual Carrier Selection */}
            {!autoAssignMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Choose Shipping Carrier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carriers.map((carrier) => (
                      <div
                        key={carrier.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedCarrier === carrier.id
                            ? 'border-blue-600 bg-blue-50'
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

            {/* Recipients Address Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recipient Addresses ({recipients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Shipping</TableHead>
                        <TableHead>Cost</TableHead>
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
                            </div>
                          </TableCell>
                          <TableCell className="max-w-64">
                            {editingAddress === recipient.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={tempAddress}
                                  onChange={(e) => setTempAddress(e.target.value)}
                                  placeholder="Enter address"
                                  className="text-sm"
                                />
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveAddress(recipient.id)}
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">{recipient.address}</p>
                            )}
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
                            <span className="text-sm">{recipient.shippingMode}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{recipient.cost}</span>
                          </TableCell>
                          <TableCell>
                            {editingAddress !== recipient.id && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditAddress(recipient.id, recipient.address)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedRecipients.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mt-4">
                    <span className="text-sm font-medium">
                      {selectedRecipients.length} recipient(s) selected
                    </span>
                    <Button variant="outline" size="sm">
                      Update Carrier
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Selected
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Shipping Summary</CardTitle>
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
                      <span>Selected Carrier:</span>
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
                  <div className="flex justify-between text-sm">
                    <span>Order Subtotal:</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping Cost:</span>
                    <span>${getTotalShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${(150.00 + getTotalShippingCost()).toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleContinueToPayment}
                  disabled={recipients.filter(r => r.status === 'pending').length > 0}
                >
                  Continue to Payment
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  {recipients.filter(r => r.status === 'pending').length > 0 
                    ? 'Please confirm all addresses to continue'
                    : 'All addresses confirmed'
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingFulfillmentPublic;
