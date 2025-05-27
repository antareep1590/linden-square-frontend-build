
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Archive, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Mock inventory data
const mockInventory = [
  {
    id: "1",
    name: "Artisan Chocolates",
    category: "Food & Beverage",
    quantity: 120,
    reorderThreshold: 50,
    unitCost: 15.99,
    lastRefilledDate: new Date("2023-10-15")
  },
  {
    id: "2",
    name: "Coffee Mug",
    category: "Drinkware",
    quantity: 35,
    reorderThreshold: 40,
    unitCost: 12.50,
    lastRefilledDate: new Date("2023-09-20")
  },
  {
    id: "3",
    name: "Scented Candle",
    category: "Home & Living",
    quantity: 18,
    reorderThreshold: 25,
    unitCost: 22.00,
    lastRefilledDate: new Date("2023-11-01")
  },
  {
    id: "4",
    name: "Custom Notepad",
    category: "Stationery",
    quantity: 80,
    reorderThreshold: 30,
    unitCost: 8.75,
    lastRefilledDate: new Date("2023-10-10")
  },
  {
    id: "5",
    name: "Leather Journal",
    category: "Stationery",
    quantity: 22,
    reorderThreshold: 20,
    unitCost: 35.00,
    lastRefilledDate: new Date("2023-10-25")
  }
];

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderThreshold: number;
  unitCost: number;
  lastRefilledDate: Date;
}

const categories = [
  "Food & Beverage",
  "Drinkware",
  "Home & Living",
  "Stationery",
  "Technology",
  "Apparel",
  "Health & Beauty"
];

const AdminInventory = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    reorderThreshold: "",
    unitCost: ""
  });

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.reorderThreshold || !newItem.unitCost) {
      toast.error("Please fill in all fields");
      return;
    }

    const newInventoryItem: InventoryItem = {
      id: (inventory.length + 1).toString(),
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity),
      reorderThreshold: parseInt(newItem.reorderThreshold),
      unitCost: parseFloat(newItem.unitCost),
      lastRefilledDate: new Date()
    };

    setInventory([...inventory, newInventoryItem]);
    setNewItem({ name: "", category: "", quantity: "", reorderThreshold: "", unitCost: "" });
    setIsAddModalOpen(false);
    toast.success("Inventory item added successfully");
  };

  const resetForm = () => {
    setNewItem({ name: "", category: "", quantity: "", reorderThreshold: "", unitCost: "" });
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast.success("Item deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Inventory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Initial Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Reorder Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="0"
                    value={newItem.reorderThreshold}
                    onChange={(e) => setNewItem({ ...newItem, reorderThreshold: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost ($)</Label>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.unitCost}
                  onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search inventory by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity Left</TableHead>
              <TableHead className="text-right">Reorder Threshold</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead>Last Refilled Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow 
                  key={item.id}
                  className={isLowStock(item.quantity, item.reorderThreshold) ? "bg-red-50 dark:bg-red-900/20" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={
                      isLowStock(item.quantity, item.reorderThreshold) 
                        ? "font-bold text-red-600 dark:text-red-400" 
                        : ""
                    }>
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.reorderThreshold}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell>{formatDate(item.lastRefilledDate)}</TableCell>
                  <TableCell>
                    {isLowStock(item.quantity, item.reorderThreshold) ? (
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-transparent">
                        Low Stock
                      </div>
                    ) : (
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-transparent">
                        In Stock
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No inventory items found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
