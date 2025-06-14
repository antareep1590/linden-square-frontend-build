import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Info, Package, DollarSign, Clock, Truck, MapPin, Users, Save, CheckCircle, AlertCircle, X, Search } from 'lucide-react';
import BulkUploadModal from '@/components/BulkUploadModal';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  address?: string;
  carrier?: string;
  shippingMethod?: string;
  estimatedDelivery?: string;
  cost?: number;
}

const StandaloneShipping = () => {
  const [defaultCarrier, setDefaultCarrier] = useState('');
  const [defaultShippingMethod, setDefaultShippingMethod] = useState('');
  const [defaultDeliverySpeed, setDefaultDeliverySpeed] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '555-0123',
      department: 'Marketing',
      address: '123 Main St, New York, NY 10001',
      carrier: 'FedEx',
      shippingMethod: 'Ground',
      estimatedDelivery: '2024-01-20',
      cost: 15.99
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '555-0124',
      department: 'Engineering',
      address: '456 Oak Ave, San Francisco, CA 94102',
      carrier: 'UPS',
      shippingMethod: 'Express',
      estimatedDelivery: '2024-01-18',
      cost: 24.99
    }
  ]);

  const [selectedRecipients, setSelectedRecipients] = useState<Set<number>>(new Set());

  const carriers = ['FedEx', 'UPS', 'USPS', 'DHL'];
  const shippingMethods = ['Ground', 'Express', '2-Day', 'Overnight'];
  const deliverySpeeds = ['Standard (5-7 days)', 'Expedited (3-5 days)', 'Express (1-2 days)'];

  const handleSelectRecipient = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRecipients);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRecipients(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecipients(new Set(recipients.map(r => r.id)));
    } else {
      setSelectedRecipients(new Set());
    }
  };

  const handleBulkAssignCarrier = (carrier: string) => {
    setRecipients(prev => prev.map(recipient => 
      selectedRecipients.has(recipient.id) 
        ? { ...recipient, carrier }
        : recipient
    ));
  };

  const handleBulkAssignShipping = (method: string) => {
    setRecipients(prev => prev.map(recipient => 
      selectedRecipients.has(recipient.id) 
        ? { ...recipient, shippingMethod: method }
        : recipient
    ));
  };

  const handleRemoveRecipient = (id: number) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    setSelectedRecipients(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleBulkUpload = (uploadedRecipients: any[]) => {
    const newRecipients = uploadedRecipients.map((r, index) => ({
      id: recipients.length + index + 1,
      name: r.name,
      email: r.email,
      phone: r.phone,
      department: r.department,
      address: r.address || '',
      carrier: defaultCarrier || 'FedEx',
      shippingMethod: defaultShippingMethod || 'Ground',
      estimatedDelivery: '2024-01-22',
      cost: 15.99
    }));
    
    setRecipients(prev => [...prev, ...newRecipients]);
    setIsBulkUploadOpen(false);
  };

  const handleSave = () => {
    console.log('Saving shipping defaults:', {
      defaultCarrier,
      defaultShippingMethod,
      defaultDeliverySpeed,
      recipients
    });
  };

  const totalShippingCost = recipients.reduce((sum, r) => sum + (r.cost || 0), 0);
  const avgDeliveryTime = recipients.length > 0 ? '3-5 days' : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping & Fulfillment Defaults</h1>
          <p className="text-gray-600">Set default shipping preferences and manage recipient addresses</p>
        </div>
        <Button onClick={handleSave} className="bg-linden-blue hover:bg-linden-blue/90">
          <Save className="h-4 w-4 mr-2" />
          Save Defaults
        </Button>
      </div>

      {/* How This Works Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How This Works</h3>
              <p className="text-sm text-blue-800">
                All shipping preferences and recipient data added here will auto-fill during the order process. You can still make edits while placing an order.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                    <p className="text-2xl font-bold">{recipients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Shipping Cost</p>
                    <p className="text-2xl font-bold">${totalShippingCost.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
                    <p className="text-2xl font-bold">{avgDeliveryTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Default Shipping Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Default Shipping Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="defaultCarrier">Default Carrier</Label>
                  <Select value={defaultCarrier} onValueChange={setDefaultCarrier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map(carrier => (
                        <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultShippingMethod">Default Shipping Method</Label>
                  <Select value={defaultShippingMethod} onValueChange={setDefaultShippingMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingMethods.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultDeliverySpeed">Default Delivery Speed</Label>
                  <Select value={defaultDeliverySpeed} onValueChange={setDefaultDeliverySpeed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliverySpeeds.map(speed => (
                        <SelectItem key={speed} value={speed}>{speed}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipients Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recipients & Shipping Details ({recipients.length})
                </div>
                <Button 
                  onClick={() => setIsBulkUploadOpen(true)}
                  variant="outline"
                  className="border-linden-blue text-linden-blue hover:bg-linden-blue hover:text-white"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add filter section with labels */}
              <div className="mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="recipientSearch" className="text-sm font-medium mb-2 block">Search Recipients</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="recipientSearch"
                        placeholder="Search by name, email, or department..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="carrierFilter" className="text-sm font-medium mb-2 block">Filter by Carrier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All carriers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Carriers</SelectItem>
                        {carriers.map(carrier => (
                          <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="statusFilter" className="text-sm font-medium mb-2 block">Filter by Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {selectedRecipients.size > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedRecipients.size} recipient(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Select onValueChange={handleBulkAssignCarrier}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Set Carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          {carriers.map(carrier => (
                            <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select onValueChange={handleBulkAssignShipping}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Set Method" />
                        </SelectTrigger>
                        <SelectContent>
                          {shippingMethods.map(method => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedRecipients.size === recipients.length && recipients.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Shipping Method</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRecipients.has(recipient.id)}
                            onCheckedChange={(checked) => handleSelectRecipient(recipient.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{recipient.name}</TableCell>
                        <TableCell>{recipient.email}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={recipient.address}>
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {recipient.address}
                          </div>
                        </TableCell>
                        <TableCell>{recipient.carrier}</TableCell>
                        <TableCell>{recipient.shippingMethod}</TableCell>
                        <TableCell>{recipient.estimatedDelivery}</TableCell>
                        <TableCell>${recipient.cost?.toFixed(2)}</TableCell>
                        <TableCell>
                          {recipient.carrier && recipient.shippingMethod ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs">Ready</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-xs">Incomplete</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRecipient(recipient.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {recipients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <p>No recipients added yet</p>
                  <p className="text-sm">Use bulk upload to add recipients with addresses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setIsBulkUploadOpen(true)}
                variant="outline" 
                className="w-full"
              >
                Import Recipients
              </Button>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Settings Summary:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Default Carrier:</span>
                    <span className="text-right">{defaultCarrier || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Default Method:</span>
                    <span className="text-right">{defaultShippingMethod || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Default Speed:</span>
                    <span className="text-right">{defaultDeliverySpeed || 'Not set'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <Button 
                onClick={handleSave}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Save All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadSuccess={handleBulkUpload}
      />
    </div>
  );
};

export default StandaloneShipping;
