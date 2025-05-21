
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Upload, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ArrowDownAZ, 
  ArrowDownZA, 
  ArrowDown,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample customer data
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
}

const sampleCustomers: Customer[] = [
  {
    id: "1",
    name: "Jane Smith",
    phone: "(555) 123-4567",
    email: "jane.smith@example.com",
    address: "123 Main St, New York, NY 10001",
    status: "active",
  },
  {
    id: "2",
    name: "John Doe",
    phone: "(555) 987-6543",
    email: "john.doe@example.com",
    address: "456 Park Ave, Boston, MA 02115",
    status: "inactive",
  },
  {
    id: "3",
    name: "Alice Johnson",
    phone: "(555) 555-5555",
    email: "alice.johnson@example.com",
    address: "789 Broadway, San Francisco, CA 94107",
    status: "active",
  },
  {
    id: "4",
    name: "Robert Brown",
    phone: "(555) 333-4444",
    email: "robert.brown@example.com",
    address: "101 Pine St, Seattle, WA 98101",
    status: "active",
  },
  {
    id: "5",
    name: "Emily Wilson",
    phone: "(555) 222-8888",
    email: "emily.wilson@example.com",
    address: "202 Oak Ave, Austin, TX 78701",
    status: "inactive",
  },
];

// Form schema for adding/editing customers
const customerFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<string>("nameAZ");
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "active",
    },
  });

  // Handle opening the add customer modal
  const handleAddCustomer = () => {
    form.reset({
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "active",
    });
    setEditCustomerId(null);
    setCustomerModalOpen(true);
  };

  // Handle opening the edit customer modal
  const handleEditCustomer = (customer: Customer) => {
    form.reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      status: customer.status,
    });
    setEditCustomerId(customer.id);
    setCustomerModalOpen(true);
  };

  // Handle deleting a customer
  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
    toast({
      title: "Customer deleted",
      description: "The customer has been successfully deleted."
    });
  };

  // Handle form submission for adding/editing a customer
  const onSubmit = (data: CustomerFormValues) => {
    if (editCustomerId) {
      // Update existing customer
      setCustomers(
        customers.map((customer) =>
          customer.id === editCustomerId
            ? { ...customer, ...data }
            : customer
        )
      );
      toast({
        title: "Customer updated",
        description: "The customer has been successfully updated."
      });
    } else {
      // Add new customer - ensure all required fields are provided
      const newCustomer: Customer = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        status: data.status,
      };
      setCustomers([...customers, newCustomer]);
      toast({
        title: "Customer added",
        description: "The customer has been successfully added."
      });
    }
    setCustomerModalOpen(false);
  };

  // Handle status change directly from the table
  const handleStatusChange = (id: string, status: "active" | "inactive") => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id ? { ...customer, status } : customer
      )
    );
    toast({
      title: "Status updated",
      description: `Customer status changed to ${status}.`
    });
  };

  // Handle CSV upload
  const handleCsvUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the CSV file
    toast({
      title: "CSV uploaded",
      description: "Your customer data has been uploaded successfully."
    });
    setCsvModalOpen(false);
  };

  // Filter and sort the customers
  const filteredCustomers = customers
    .filter((customer) => {
      // Apply search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "nameAZ":
          return a.name.localeCompare(b.name);
        case "nameZA":
          return b.name.localeCompare(a.name);
        case "newest":
          return parseInt(b.id) - parseInt(a.id);
        case "oldest":
          return parseInt(a.id) - parseInt(b.id);
        default:
          return 0;
      }
    });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCsvModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <Button 
            onClick={handleAddCustomer}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 bg-white rounded-md shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  {sortBy === "nameAZ" && <ArrowDownAZ className="mr-2 h-4 w-4" />}
                  {sortBy === "nameZA" && <ArrowDownZA className="mr-2 h-4 w-4" />}
                  {(sortBy === "newest" || sortBy === "oldest") && (
                    <ArrowDown className="mr-2 h-4 w-4" />
                  )}
                  Sort: {
                    sortBy === "nameAZ" ? "Name A-Z" : 
                    sortBy === "nameZA" ? "Name Z-A" : 
                    sortBy === "newest" ? "Newest First" : "Oldest First"
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("nameAZ")}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" /> Name A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("nameZA")}>
                  <ArrowDownZA className="mr-2 h-4 w-4" /> Name Z-A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  <ArrowDown className="mr-2 h-4 w-4" /> Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  <ArrowDown className="mr-2 h-4 w-4" /> Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <TableRow 
                    key={customer.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="max-w-xs truncate" title={customer.address}>
                      {customer.address}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={customer.status}
                        onValueChange={(value: "active" | "inactive") => 
                          handleStatusChange(customer.id, value)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue>
                            <div className="flex items-center space-x-2">
                              {customer.status === "active" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="capitalize">{customer.status}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Active</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center space-x-2">
                              <XCircle className="h-4 w-4 text-gray-400" />
                              <span>Inactive</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CSV Upload Modal */}
      <Dialog open={csvModalOpen} onOpenChange={setCsvModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Customer CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with your customer data. Ensure your CSV includes Name, Phone, Email, Address, and Status fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCsvUpload}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="csvFile" className="text-sm font-medium">
                  Select CSV File
                </label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setCsvModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Customer Modal */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCustomerId ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Main St, City, State, ZIP"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setCustomerModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editCustomerId ? "Save Changes" : "Add Customer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
