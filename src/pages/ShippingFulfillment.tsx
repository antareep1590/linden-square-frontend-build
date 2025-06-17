
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Truck, Package, Clock, Edit, Trash2, Users, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface GiftBox {
  id: string;
  name: string;
  theme: string;
  price: number;
  quantity: number;
}

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  status: 'confirmed'; // All recipients are confirmed by default
  shippingMode: string;
  source: 'manual' | 'bulk';
  assignedGiftBox: string;
}

const ShippingFulfillment = () => {
  const navigate = useNavigate();
  const [bulkShippingMode, setBulkShippingMode] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);

  // Mock order data - would come from context/state in real app
  const orderGiftBoxes: GiftBox[] = [
    { id: '1', name: 'Premium Coffee Collection', theme: 'Appreciation', price: 45.00, quantity: 6 }
  ];

  // Sample recipient addresses - all confirmed by default since they appear in this section
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
      source: 'manual',
      assignedGiftBox: 'Premium Coffee Collection'
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
      source: 'bulk',
      assignedGiftBox: 'Premium Coffee Collection'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Sales',
      address: '789 Pine St, Los Angeles, CA 90210',
      status: 'confirmed',
      shippingMode: 'FedEx Standard',
      source: 'manual',
      assignedGiftBox: 'Premium Coffee Collection'
    }
  ]);

  // Mock shipping carriers data (without costs)
  const carriers = [
    {
      id: 'fedex',
      name: 'FedEx',
      services: ['Standard', 'Express', 'Overnight'],
      estimatedDays: '2-3 business days'
    },
    {
      id: 'ups',
      name: 'UPS',
      services: ['Ground', 'Express', 'Next Day'],
      estimatedDays: '3-5 business days'
    },
    {
      id: 'dhl',
      name: 'DHL',
      services: ['Standard', 'Express', 'Priority'],
      estimatedDays: '2-4 business days'
    },
    {
      id: 'usps',
      name: 'USPS',
      services: ['Priority', 'Express', 'Ground'],
      estimatedDays: '3-5 business days'
    }
  ];

  const handleContinue = () => {
    toast.success('Shipping configuration saved');
    navigate('/payment-method', { state: { total: calculateGrandTotal() } });
  };

  const calculateGiftBoxesSubtotal = () => {
    return orderGiftBoxes.reduce((total, box) => total + (box.price * box.quantity), 0);
  };

  const calculateCustomizationsTotal = () => {
    return 0; // For now, customizations are free
  };

  const calculateProcessingFee = () => {
    return calculateGiftBoxesSubtotal() * 0.03; // 3% processing fee
  };

  const calculateGrandTotal = () => {
    return calculateGiftBoxesSubtotal() + calculateCustomizationsTotal() + calculateProcessingFee();
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

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'bulk': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/customization')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customization
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Shipping & Fulfillment</h1>
          <p className="text-gray-600">Configure delivery options and manage recipient addresses</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleContinue}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Shipping Mode */}
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
                  <h4 className="font-medium">Auto-assign carriers for this order</h4>
                  <p className="text-sm text-gray-600">
                    Automatically select the best carrier for each recipient based on location and preferences
                  </p>
                </div>
                <Switch
                  checked={bulkShippingMode}
                  onCheckedChange={setBulkShippingMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Choose Shipping Carrier */}
          {!bulkShippingMode && (
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
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{carrier.estimatedDays}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipient Address Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recipient Address Management ({recipients.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  All recipients listed here are automatically confirmed. Gift box assignments are fixed and cannot be changed at this step.
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedRecipients.length === recipients.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Gift Box Assignment</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
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
                          <TableCell className="font-medium">{recipient.name}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell className="max-w-48 truncate">{recipient.address}</TableCell>
                          <TableCell>
                            <span className="text-sm">{recipient.assignedGiftBox}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getSourceBadgeColor(recipient.source)}`}
                            >
                              {recipient.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                              Confirmed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRecipient(recipient.id)}
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          {/* Shipping Summary */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Confirmed Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping Mode:</span>
                  <span className="font-medium">
                    {bulkShippingMode ? 'Auto-assign' : 'Manual'}
                  </span>
                </div>
                {!bulkShippingMode && selectedCarrier && (
                  <div className="flex justify-between text-sm">
                    <span>Selected Carrier:</span>
                    <span className="font-medium capitalize">{selectedCarrier}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Gift Boxes:</h4>
                {orderGiftBoxes.map(box => (
                  <div key={box.id} className="flex justify-between text-sm">
                    <span>{box.name} (×{box.quantity})</span>
                    <span>${(box.price * box.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateGiftBoxesSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Customizations:</span>
                    <span>${calculateCustomizationsTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee (3%):</span>
                    <span>${calculateProcessingFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t">
                    <span>Total:</span>
                    <span>${calculateGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingFulfillment;
