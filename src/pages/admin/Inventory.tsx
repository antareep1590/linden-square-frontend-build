
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Inventory status type
type InventoryStatus = "active" | "inactive";

// Inventory item interface
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorderThreshold: number;
  lastRefilledDate: Date;
  status: InventoryStatus;
}

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
    status: "inactive"
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
  }
];

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter inventory based on search term and status
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  // Handle status change
  const handleStatusChange = (itemId: string, newStatus: InventoryStatus) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
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
        <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Quantity Left</TableHead>
              <TableHead className="text-right">Reorder Threshold</TableHead>
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
                  <TableCell className="font-medium">{item.name}</TableCell>
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
                    <Select 
                      value={item.status} 
                      onValueChange={(value: InventoryStatus) => handleStatusChange(item.id, value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Restock</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No inventory items found matching your filters.
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
