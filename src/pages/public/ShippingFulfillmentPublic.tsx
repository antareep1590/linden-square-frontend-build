
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
import { ArrowLeft, Package, Truck, Save, Edit, CheckCircle, AlertCircle, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LindenSquareLogo from '@/components/LindenSquareLogo';

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
}

const ShippingFulfillmentPublic = () => {
  const navigate = useNavigate();
  const [autoAssignMode, setAutoAssignMode] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');

  // Sample recipients with shipping info
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
      cost: '$12.50'
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
      cost: '$11.75'
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

  const handleContinueToPayment = () => {
    if (recipients.some(r => r.status === 'pending')) {
      toast.error('Please ensure all recipients have confirmed addresses and shipping details');
      return;
    }
    
    navigate('/public/payment');
  };

  const handleEditAddress = (recipientId: number, newAddress: string) => {
    setRecipients(prev => prev.map(r => 
      r.id === recipientId 
        ? { ...r, address: newAddress, status: newAddress.trim() ? 'confirmed' : 'pending' }
        : r
    ));
  };

  const getTotalShippingCost = () => {
    return recipients.reduce((total, recipient) => {
      const cost = parseFloat(recipient.cost?.replace('$', '') || '0');
      return total + cost;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LindenSquareLogo size="medium" />
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <h1 className="hidden sm:block text-xl font-semibold text-gray-900">Shipping & Fulfillment</h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/public/recipients')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipients
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Shipping Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Preferences
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

            {/* Choose Shipping Carrier */}
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

            {/* Recipient Shipping Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recipient Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                            <div>
                              <p className="font-medium">{recipient.name}</p>
                              <p className="text-sm text-gray-600">{recipient.email}</p>
                              {recipient.department && (
                                <p className="text-xs text-gray-500">{recipient.department}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-48">
                            <Input
                              value={recipient.address}
                              onChange={(e) => handleEditAddress(recipient.id, e.target.value)}
                              placeholder="Enter shipping address"
                              className="text-sm"
                            />
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
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                  <div className="flex justify-between font-semibold">
                    <span>Total Shipping:</span>
                    <span>${getTotalShippingCost().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                  onClick={handleContinueToPayment}
                >
                  Continue to Payment
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  All recipients must have confirmed addresses to proceed
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
