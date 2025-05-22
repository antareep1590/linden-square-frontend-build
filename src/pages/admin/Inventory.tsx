import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Archive, Pencil, Plus, RefreshCcw, X } from "lucide-react";
import { toast } from "sonner";

type InventoryStatus = "active" | "inactive";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  reorderThreshold: number;
  lastRefilledDate: Date;
  status: InventoryStatus;
};

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Artisan Chocolates",
    quantity: 120,
    reorderThreshold: 50,
    lastRefilledDate: new Date("2023-10-15"),
    status: "active"
  },
  {
    id: "2",
    name: "Coffee Mug",
    quantity: 35,
    reorderThreshold: 40,
    lastRefilledDate: new Date("2023-09-20"),
    status: "active"
  },
  {
    id: "3",
    name: "Scented Candle",
    quantity: 18,
    reorderThreshold: 25,
    lastRefilledDate: new Date("2023-11-01"),
    status: "active"
  },
  {
    id: "4",
    name: "Custom Notepad",
    quantity: 80,
    reorderThreshold: 30,
    lastRefilledDate: new Date("2023-10-10"),
    status: "active"
  },
  {
    id: "5",
    name: "Leather Journal",
    quantity: 22,
    reorderThreshold: 20,
    lastRefilledDate: new Date("2023-10-25"),
    status: "active"
  },
  {
    id: "6",
    name: "Seasonal Ornament",
    quantity: 45,
    reorderThreshold: 30,
    lastRefilledDate: new Date("2023-09-05"),
    status: "inactive"
  }
];

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isThresholdDialogOpen, setIsThresholdDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(0);
  const [newThreshold, setNewThreshold] = useState<number>(0);

  // Filter inventory based on search term and status
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (statusFilter === "all" || item.status === statusFilter)
  );

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if quantity is below threshold
  const isLowStock = (quantity: number, threshold: number) => {
    return quantity < threshold;
  };

  // Handle restock action
  const handleRestockItem = () => {
    if (!currentItem || restockAmount <= 0) return;
    
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              quantity: item.quantity + restockAmount,
              lastRefilledDate: new Date()
            } 
          : item
      )
    );
    
    toast.success(`Restocked ${currentItem.name} with ${restockAmount} units`);
    setIsRestockDialogOpen(false);
    setRestockAmount(0);
  };

  // Handle update threshold
  const handleUpdateThreshold = () => {
    if (!currentItem || newThreshold <= 0) return;
    
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.id === currentItem.id 
          ? { ...item, reorderThreshold: newThreshold } 
          : item
      )
    );
    
    toast.success(`Updated reorder threshold for ${currentItem.name} to ${newThreshold} units`);
    setIsThresholdDialogOpen(false);
    setNewThreshold(0);
  };

  // Handle toggle item status
  const handleToggleStatus = (id: string) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.id === id 
          ? { ...item, status: item.status === "active" ? "inactive" : "active" } 
          : item
      )
    );
    
    const targetItem = inventory.find(item => item.id === id);
    const newStatus = targetItem?.status === "active" ? "inactive" : "active";
    toast.success(`${targetItem?.name} is now ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => toast.info("Add new item functionality to be implemented")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-muted/20 p-4 rounded-lg">
        <div className="flex flex-1 flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
          <Label htmlFor="notifications" className="font-medium">
            Low Inventory Alerts
          </Label>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Reorder Threshold</TableHead>
              <TableHead>Last Refilled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow 
                  key={item.id}
                  className={
                    item.status === "inactive" 
                      ? "bg-gray-100 dark:bg-gray-800" 
                      : isLowStock(item.quantity, item.reorderThreshold)
                        ? "bg-red-50 dark:bg-red-900/20" 
                        : ""
                  }
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={
                      isLowStock(item.quantity, item.reorderThreshold) && item.status === "active"
                        ? "font-bold text-red-600 dark:text-red-400" 
                        : ""
                    }>
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.reorderThreshold}</TableCell>
                  <TableCell>{formatDate(item.lastRefilledDate)}</TableCell>
                  <TableCell>
                    {item.status === "active" ? (
                      isLowStock(item.quantity, item.reorderThreshold) ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-transparent">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-transparent">
                          In Stock
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-transparent">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={item.status === "inactive"}
                        onClick={() => {
                          setCurrentItem(item);
                          setIsRestockDialogOpen(true);
                        }}
                      >
                        <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                        Restock
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentItem(item);
                          setNewThreshold(item.reorderThreshold);
                          setIsThresholdDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant={item.status === "active" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleToggleStatus(item.id)}
                      >
                        {item.status === "active" ? (
                          <X className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No inventory items found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Inventory</DialogTitle>
            <DialogDescription>
              Add inventory for {currentItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="amount">Amount to add</Label>
              <Input 
                id="amount" 
                type="number" 
                min="1"
                value={restockAmount || ''}
                onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm text-muted-foreground">
                Current quantity: {currentItem?.quantity || 0}
              </Label>
              <Label className="text-sm text-muted-foreground">
                New quantity will be: {(currentItem?.quantity || 0) + restockAmount}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestockItem} disabled={restockAmount <= 0}>
              Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Threshold Dialog */}
      <Dialog open={isThresholdDialogOpen} onOpenChange={setIsThresholdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reorder Threshold</DialogTitle>
            <DialogDescription>
              Update the reorder threshold for {currentItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="threshold">New threshold</Label>
              <Input 
                id="threshold" 
                type="number" 
                min="1"
                value={newThreshold || ''}
                onChange={(e) => setNewThreshold(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm text-muted-foreground">
                Current threshold: {currentItem?.reorderThreshold || 0}
              </Label>
              {currentItem && newThreshold < currentItem.quantity ? (
                <Label className="text-sm text-green-600">
                  Stock level is above threshold
                </Label>
              ) : currentItem ? (
                <Label className="text-sm text-red-600">
                  Stock level is below threshold - will trigger alerts
                </Label>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsThresholdDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateThreshold} disabled={newThreshold <= 0}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {notificationsEnabled && (
        <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <h3 className="font-medium mb-2">Low Inventory Alerts Enabled</h3>
          <p className="text-sm">You will receive notifications when inventory items fall below their reorder threshold.</p>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
