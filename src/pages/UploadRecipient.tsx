
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const UploadRecipient: React.FC = () => {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate processing CSV and adding recipients
    // In a real app, you would parse the CSV here
    setTimeout(() => {
      const mockRecipients: Recipient[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-123-4567', address: '123 Main St, Anytown, CA 12345' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543', address: '456 Oak Ave, Somewhere, CA 67890' },
        { id: '3', name: 'Robert Johnson', email: 'robert@example.com', phone: '555-456-7890', address: '789 Pine Rd, Nowhere, CA 54321' },
      ];
      
      setRecipients(mockRecipients);
      
      toast({
        title: "CSV uploaded successfully",
        description: `${mockRecipients.length} recipients imported.`,
      });
      
      // Reset the input so the same file can be uploaded again if needed
      event.target.value = '';
    }, 500);
  };

  const handleAddRecipient = () => {
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }
    
    const newRecipient: Recipient = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      address
    };
    
    setRecipients([...recipients, newRecipient]);
    
    // Clear form
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    
    toast({
      title: "Recipient added",
      description: `${name} has been added to the recipients list.`,
    });
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    
    toast({
      title: "Recipient removed",
      description: "The recipient has been removed from the list.",
    });
  };

  const handleSaveAndContinue = () => {
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please add at least one recipient.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Recipients saved",
      description: `${recipients.length} recipients have been saved.`,
    });
    
    // In a real app, you would save the recipients and navigate to the next page
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Upload Recipients</h1>
        <p className="text-gray-500">Add the people who will receive your gifts.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Recipients</CardTitle>
          <CardDescription>
            Upload a CSV file or manually enter recipient information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-4">Upload your CSV file with recipient information</p>
                <Label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="bg-linden-blue text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                    Choose File
                  </div>
                  <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
                </Label>
                <p className="mt-2 text-xs text-gray-500">Accepted formats: CSV</p>
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, State ZIP" />
                </div>
              </div>
              <Button onClick={handleAddRecipient} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Recipient
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {recipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recipient Preview</CardTitle>
            <CardDescription>
              {recipients.length} recipients added
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell>{recipient.name}</TableCell>
                      <TableCell>{recipient.email}</TableCell>
                      <TableCell>{recipient.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{recipient.address}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeRecipient(recipient.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveAndContinue} className="bg-linden-blue hover:bg-opacity-90">
              <Save className="mr-2 h-4 w-4" /> Save and Continue
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default UploadRecipient;
