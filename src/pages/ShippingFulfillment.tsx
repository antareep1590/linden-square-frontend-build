
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Truck, Package, Clock, CheckCircle, Edit, Trash2, Users, ShoppingCart } from 'lucide-react';
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
  status: 'confirmed';
  deliveryType: string;
  source: 'manual' | 'bulk';
  assignedGiftBox?: string;
}

const ShippingFulfillment = () => {
  const navigate = useNavigate();
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('');
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
      deliveryType: 'Express Delivery',
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
      deliveryType: 'Normal Delivery',
      source: 'bulk',
      assignedGiftBox: 'Premium Coffee Collection'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Sales',
      address: '789 Pine Rd, Chicago, IL 60601',
      status: 'confirmed',
      deliveryType: 'Slow Delivery',
      source: 'manual',
      assignedGiftBox: 'Premium Coffee Collection'
    }
  ]);

  // Mock delivery types data
  const deliveryTypes = [
    {
      id: 'express',
      name: 'Express Delivery',
      duration: '1-2 business days',
      logo: '/placeholder.svg'
    },
    {
      id: 'normal',
      name: 'Normal Delivery',
      duration: '2-3 business days',
      logo: '/placeholder.svg'
    },
    {
      id: 'slow',
      name: 'Slow Delivery',
      duration: '3-5 business days',
      logo: '/placeholder.svg'
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
            Buy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Choose Delivery Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Choose Delivery Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryTypes.map((deliveryType) => (
                  <div
                    key={deliveryType.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDeliveryType === deliveryType.id
                        ? 'border-linden-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDeliveryType(deliveryType.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{deliveryType.name}</h4>
                        <div className="flex items-center gap-1 text-xs mt-2">
                          <Clock className="h-3 w-3" />
                          <span>{deliveryType.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  All recipients listed here are automatically confirmed. Manage delivery details and type assignments.
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
                        <TableHead>Gift Box</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Delivery Type</TableHead>
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
                          <TableCell>
                            <span className="text-sm">{recipient.assignedGiftBox || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Confirmed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{recipient.deliveryType || '-'}</span>
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
                      Assign Delivery Type
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
          {/* Shipping Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Delivery Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Delivery Configuration */}
              <div className="space-y-3">
                {selectedDeliveryType && (
                  <div className="flex justify-between text-sm">
                    <span>Selected Delivery Type:</span>
                    <span className="font-medium">
                      {deliveryTypes.find(d => d.id === selectedDeliveryType)?.name}
                    </span>
                  </div>
                )}

                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Total Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Confirmed Recipients:</span>
                  <span className="font-medium text-green-600">{recipients.length}</span>
                </div>
              </div>

              {/* Tracking Information */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">After Shipment</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p>✓ Tracking numbers will be automatically generated</p>
                  <p>✓ Recipients will receive email notifications</p>
                  <p>✓ Real-time tracking available in dashboard</p>
                  <p>✓ Delivery confirmations sent to you</p>
                </div>
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
              
              {/* Gift Boxes */}
              <div className="space-y-3">
                <h4 className="font-medium">Gift Boxes</h4>
                {orderGiftBoxes.map((box) => (
                  <div key={box.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{box.name}</p>
                      <p className="text-gray-600">{box.quantity} × ${box.price.toFixed(2)}</p>
                    </div>
                    <span>${(box.price * box.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Gift Boxes Subtotal:</span>
                  <span>${calculateGiftBoxesSubtotal().toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customizations:</span>
                  <span>${calculateCustomizationsTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee (3%):</span>
                  <span>${calculateProcessingFee().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Cost:</span>
                  <span className="text-linden-blue">${calculateGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-linden-blue hover:bg-linden-blue/90 mb-2"
                  onClick={handleContinue}
                >
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingFulfillment;
