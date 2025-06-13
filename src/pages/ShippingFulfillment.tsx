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
import { ArrowLeft, Truck, Upload, Download, Package, MapPin, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ShippingFulfillment = () => {
  const navigate = useNavigate();
  const [bulkShippingMode, setBulkShippingMode] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);

  // Mock shipping carriers data
  const carriers = [
    {
      id: 'fedex',
      name: 'FedEx',
      logo: '/placeholder.svg',
      services: ['Standard', 'Express', 'Overnight'],
      estimatedCost: '$12.50',
      estimatedDays: '2-3 business days'
    },
    {
      id: 'ups',
      name: 'UPS',
      logo: '/placeholder.svg',
      services: ['Ground', 'Express', 'Next Day'],
      estimatedCost: '$11.75',
      estimatedDays: '3-5 business days'
    },
    {
      id: 'dhl',
      name: 'DHL',
      logo: '/placeholder.svg',
      services: ['Standard', 'Express', 'Priority'],
      estimatedCost: '$15.20',
      estimatedDays: '2-4 business days'
    },
    {
      id: 'usps',
      name: 'USPS',
      logo: '/placeholder.svg',
      services: ['Priority', 'Express', 'Ground'],
      estimatedCost: '$9.99',
      estimatedDays: '3-5 business days'
    }
  ];

  // Mock recipient data for preview
  const mockRecipients = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@company.com',
      address: '123 Main St, Anytown, CA 12345',
      status: 'validated',
      assignedCarrier: 'FedEx',
      estimatedCost: '$12.50'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      address: '456 Oak Ave, Somewhere, CA 67890',
      status: 'validated',
      assignedCarrier: 'UPS',
      estimatedCost: '$11.75'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@company.com',
      address: 'Invalid address format',
      status: 'error',
      assignedCarrier: '',
      estimatedCost: ''
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Mock CSV parsing - in real app this would parse the actual file
      setCsvData(mockRecipients);
      toast.success('CSV file uploaded and processed successfully');
    }
  };

  const downloadTemplate = () => {
    // Mock template download
    toast.success('CSV template downloaded');
  };

  const handleContinue = () => {
    toast.success('Shipping configuration saved');
    navigate('/payment-method');
  };

  const handlePayLater = () => {
    // Generate invoice and send email
    toast.success('Invoice link sent to your email. You can complete the payment later.');
    console.log('Generating invoice for order and sending to client email');
  };

  const getTotalShippingCost = () => {
    return csvData.reduce((total, recipient) => {
      const cost = parseFloat(recipient.estimatedCost?.replace('$', '') || '0');
      return total + cost;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/recipient-selection')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipients
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
            Continue to Pay
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-linden-gold text-linden-gold hover:bg-linden-gold hover:text-white"
            onClick={handlePayLater}
          >
            Pay Later
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bulk Shipping Toggle */}
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

          {/* Shipping Carrier Selection */}
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

          {/* CSV Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Bulk Upload Recipient Addresses
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

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {uploadedFile ? uploadedFile.name : 'Upload CSV File'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {uploadedFile 
                      ? 'File uploaded successfully. Preview below.'
                      : 'Click to upload or drag and drop your CSV file here'
                    }
                  </p>
                </label>
              </div>

              {csvData.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Address Validation Preview</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Carrier</TableHead>
                          <TableHead>Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.map((recipient) => (
                          <TableRow key={recipient.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{recipient.name}</p>
                                <p className="text-sm text-gray-600">{recipient.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <span className="text-sm">{recipient.address}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {recipient.status === 'validated' ? (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Validated
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-600 border-red-600">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  Error
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {recipient.assignedCarrier || '-'}
                            </TableCell>
                            <TableCell>
                              {recipient.estimatedCost || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipping Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Shipping Configuration */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Shipping Mode:</span>
                  <span className="font-medium">
                    {bulkShippingMode ? 'Auto-assign' : 'Manual selection'}
                  </span>
                </div>
                
                {!bulkShippingMode && selectedCarrier && (
                  <div className="flex justify-between text-sm">
                    <span>Selected Carrier:</span>
                    <span className="font-medium">
                      {carriers.find(c => c.id === selectedCarrier)?.name}
                    </span>
                  </div>
                )}

                {csvData.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Total Recipients:</span>
                      <span className="font-medium">{csvData.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Validated Addresses:</span>
                      <span className="font-medium text-green-600">
                        {csvData.filter(r => r.status === 'validated').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Address Errors:</span>
                      <span className="font-medium text-red-600">
                        {csvData.filter(r => r.status === 'error').length}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Est. Shipping Cost:</span>
                      <span>${getTotalShippingCost().toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                  onClick={handleContinue}
                  disabled={csvData.length === 0}
                >
                  Continue to Pay
                </Button>
                {csvData.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Upload recipient addresses to continue
                  </p>
                )}
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
        </div>
      </div>
    </div>
  );
};

export default ShippingFulfillment;
