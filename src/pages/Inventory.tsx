
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
import { Archive, Plus } from "lucide-react";
import { toast } from "sonner";

// Mock inventory data
const mockInventory = [
  {
    id: "1",
    name: "Artisan Chocolates",
    quantity: 120,
    reorderThreshold: 50,
    lastRefilledDate: new Date("2023-10-15")
  },
  {
    id: "2",
    name: "Coffee Mug",
    quantity: 35,
    reorderThreshold: 40,
    lastRefilledDate: new Date("2023-09-20")
  },
  {
    id: "3",
    name: "Scented Candle",
    quantity: 18,
    reorderThreshold: 25,
    lastRefilledDate: new Date("2023-11-01")
  },
  {
    id: "4",
    name: "Custom Notepad",
    quantity: 80,
    reorderThreshold: 30,
    lastRefilledDate: new Date("2023-10-10")
  },
  {
    id: "5",
    name: "Leather Journal",
    quantity: 22,
    reorderThreshold: 20,
    lastRefilledDate: new Date("2023-10-25")
  }
];

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorderThreshold: number;
  lastRefilledDate: Date;
}

const Inventory = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    reorderThreshold: ""
  });

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.reorderThreshold) {
      toast.error("Please fill in all fields");
      return;
    }

    const newInventoryItem: InventoryItem = {
      id: (inventory.length + 1).toString(),
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      reorderThreshold: parseInt(newItem.reorderThreshold),
      lastRefilledDate: new Date()
    };

    setInventory([...inventory, newInventoryItem]);
    setNewItem({ name: "", quantity: "", reorderThreshold: "" });
    setIsAddModalOpen(false);
    toast.success("Inventory item added successfully");
  };

  const resetForm = () => {
    setNewItem({ name: "", quantity: "", reorderThreshold: "" });
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
            placeholder="Search inventory..."
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
              <TableHead className="text-right">Quantity Left</TableHead>
              <TableHead className="text-right">Reorder Threshold</TableHead>
              <TableHead>Last Refilled Date</TableHead>
              <TableHead>Status</TableHead>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
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

export default Inventory;
