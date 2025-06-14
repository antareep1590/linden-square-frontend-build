import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Download, Package, Truck, Users, Save, RefreshCw, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import BulkUploadModal from '@/components/BulkUploadModal';
import AddRecipientModal from '@/components/AddRecipientModal';

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
}

const StandaloneShipping = () => {
  const [autoAssignCarriers, setAutoAssignCarriers] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  
  // Sample recipient addresses
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
      source: 'auto'
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
      source: 'bulk'
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
    // Save shipping defaults to local storage or backend
    const shippingDefaults = {
      autoAssignCarriers,
      selectedCarrier,
      recipients: recipients.filter(r => r.status === 'confirmed')
    };
    localStorage.setItem('shippingDefaults', JSON.stringify(shippingDefaults));
    toast.success('Shipping defaults saved successfully');
    console.log('Saved shipping defaults:', shippingDefaults);
  };

  const handleLoadDefaults = () => {
    // Load shipping defaults from local storage or backend
    const saved = localStorage.getItem('shippingDefaults');
    if (saved) {
      const defaults = JSON.parse(saved);
      setAutoAssignCarriers(defaults.autoAssignCarriers || false);
      setSelectedCarrier(defaults.selectedCarrier || '');
      if (defaults.recipients) {
        setRecipients(defaults.recipients);
      }
      toast.success('Shipping defaults loaded');
    } else {
      toast.info('No saved defaults found');
    }
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

  const handleBulkUploadSuccess = (newRecipients: any[]) => {
    const formattedRecipients: Recipient[] = newRecipients.map((r, index) => ({
      id: Math.max(...recipients.map(r => r.id), 0) + index + 1,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      department: r.department || '',
      address: r.address || '',
      status: r.address ? 'confirmed' : 'pending',
      shippingMode: r.address ? 'FedEx Standard' : '',
      cost: r.address ? '$12.50' : '',
      source: 'bulk'
    }));
    
    setRecipients(prev => [...prev, ...formattedRecipients]);
    setShowBulkUpload(false);
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
      case 'auto': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadTemplate = () => {
    toast.success('CSV template downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping & Fulfillment Defaults</h1>
          <p className="text-gray-600">Set up default shipping preferences and recipient addresses</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLoadDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Saved
          </Button>
          <Button 
            onClick={handleSaveDefaults}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Defaults
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                About Shipping Defaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Configure your default shipping preferences and recipient addresses here. 
                  These settings will automatically populate in future gift orders.
                </p>
                <p>
                  You can add frequently used recipient addresses, set carrier preferences, 
                  and enable auto-assignment rules to streamline your order process.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Recipients added here will be available as quick-select 
                    options during order creation, saving you time on repeated shipments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Preferences */}
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
                  <h4 className="font-medium">Auto-assign carriers</h4>
                  <p className="text-sm text-gray-600">
                    Automatically select the best carrier for each recipient based on location and preferences
                  </p>
                </div>
                <Switch
                  checked={autoAssignCarriers}
                  onCheckedChange={setAutoAssignCarriers}
                />
              </div>
            </CardContent>
          </Card>

          {/* Choose Shipping Carrier */}
          {!autoAssignCarriers && (
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
                              <span>{carrier.estimatedCost}</span>
                            </div>
                            <div className="flex items-center gap-1">
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

          {/* CSV Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Bulk Upload Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
                <span className="text-sm text-gray-600">
                  Use our template to ensure proper formatting
                </span>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload CSV File
                  </p>
                  <p className="text-sm text-gray-600">
                    Upload recipient addresses to add to your defaults
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowBulkUpload(true)}
                  className="bg-linden-blue hover:bg-linden-blue/90"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Default Recipients ({recipients.length})
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
                  Manage your default recipient list. These addresses will be available for quick selection in future orders.
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
                        <TableHead>Status</TableHead>
                        <TableHead>Default Shipping</TableHead>
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
                            {recipient.status === 'confirmed' ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{recipient.shippingMode || '-'}</span>
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
                      Assign Default Carrier
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
                  <span>Auto-assign Carriers:</span>
                  <span className={autoAssignCarriers ? 'text-green-600' : 'text-gray-400'}>
                    {autoAssignCarriers ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                {!autoAssignCarriers && selectedCarrier && (
                  <div className="flex justify-between text-sm">
                    <span>Default Carrier:</span>
                    <span className="font-medium">
                      {carriers.find(c => c.id === selectedCarrier)?.name}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Total Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Confirmed Addresses:</span>
                  <span className="font-medium text-green-600">
                    {recipients.filter(r => r.status === 'confirmed').length}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Pending Addresses:</span>
                  <span className="font-medium text-orange-600">
                    {recipients.filter(r => r.status === 'pending').length}
                  </span>
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
                These settings will be used as defaults in future orders
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUploadSuccess={handleBulkUploadSuccess}
      />

      <AddRecipientModal
        open={showAddRecipient}
        onOpenChange={(open) => {
          setShowAddRecipient(open);
          if (!open) setEditingRecipient(null);
        }}
        onAddRecipient={handleAddRecipient}
        editingRecipient={editingRecipient}
      />
    </div>
  );
};

export default StandaloneShipping;
