
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Archive, Plus, Edit, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import AddInventoryItemModal from "@/components/admin/AddInventoryItemModal";
import AddGiftBoxModal from "@/components/admin/AddGiftBoxModal";

// Mock data for gift items
const mockInventory = [
  {
    id: "1",
    name: "Artisan Chocolates",
    sku: "AC-001",
    category: "Food & Beverage",
    quantity: 120,
    reorderThreshold: 50,
    unitCost: 15.99,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-10-15")
  },
  {
    id: "2",
    name: "Coffee Mug",
    sku: "CM-002",
    category: "Drinkware",
    quantity: 35,
    reorderThreshold: 40,
    unitCost: 12.50,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-09-20")
  },
  {
    id: "3",
    name: "Scented Candle",
    sku: "SC-003",
    category: "Home & Living",
    quantity: 18,
    reorderThreshold: 25,
    unitCost: 22.00,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-11-01")
  },
  {
    id: "4",
    name: "Custom Notepad",
    sku: "CN-004",
    category: "Stationery",
    quantity: 80,
    reorderThreshold: 30,
    unitCost: 8.75,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-10-10")
  },
  {
    id: "5",
    name: "Leather Journal",
    sku: "LJ-005",
    category: "Stationery",
    quantity: 22,
    reorderThreshold: 20,
    unitCost: 35.00,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-10-25")
  }
];

// Mock data for gift boxes
const mockGiftBoxes = [
  {
    id: "GB-001",
    boxName: "Premium Executive Box",
    sku: "PEB-2023",
    qtyInHand: 15,
    reorderThreshold: 10,
    unitCost: 125.99,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-10-20"),
    componentSkus: ["Artisan Chocolates", "Leather Journal", "Premium Pen Set"]
  },
  {
    id: "GB-002",
    boxName: "Holiday Celebration",
    sku: "HC-2023",
    qtyInHand: 8,
    reorderThreshold: 15,
    unitCost: 89.99,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-11-01"),
    componentSkus: ["Scented Candle", "Holiday Treats", "Gift Card"]
  },
  {
    id: "GB-003",
    boxName: "Welcome Package",
    sku: "WP-2023",
    qtyInHand: 25,
    reorderThreshold: 20,
    unitCost: 45.99,
    status: 'active' as const,
    lastRefilledDate: new Date("2023-10-15"),
    componentSkus: ["Coffee Mug", "Custom Notepad", "Company Swag"]
  }
];

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderThreshold: number;
  unitCost: number;
  status: 'active' | 'inactive';
  lastRefilledDate: Date;
}

interface GiftBox {
  id: string;
  boxName: string;
  sku: string;
  qtyInHand: number;
  reorderThreshold: number;
  unitCost: number;
  status: 'active' | 'inactive';
  lastRefilledDate: Date;
  componentSkus: string[];
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
  const [giftBoxes, setGiftBoxes] = useState(mockGiftBoxes);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quantityFilter, setQuantityFilter] = useState("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("gift-products");
  
  // Gift box filters
  const [boxStatusFilter, setBoxStatusFilter] = useState("all");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  
  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingBox, setEditingBox] = useState<GiftBox | null>(null);

  // Filter inventory based on all filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === "low") {
      matchesStatus = item.quantity < item.reorderThreshold;
    } else if (statusFilter === "in-stock") {
      matchesStatus = item.quantity >= item.reorderThreshold;
    }
    
    let matchesQuantity = true;
    if (quantityFilter === "low") {
      matchesQuantity = item.quantity < 25;
    } else if (quantityFilter === "medium") {
      matchesQuantity = item.quantity >= 25 && item.quantity < 100;
    } else if (quantityFilter === "high") {
      matchesQuantity = item.quantity >= 100;
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesQuantity;
  });

  // Filter gift boxes
  const filteredGiftBoxes = giftBoxes.filter(box => {
    const matchesSearch = box.boxName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         box.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = boxStatusFilter === "all" || 
                         (boxStatusFilter === "in-stock" && box.qtyInHand >= box.reorderThreshold) ||
                         (boxStatusFilter === "low-stock" && box.qtyInHand < box.reorderThreshold) ||
                         (boxStatusFilter === "out-of-stock" && box.qtyInHand === 0);
    
    const matchesQuantityRange = (!minQuantity || box.qtyInHand >= parseInt(minQuantity)) &&
                                (!maxQuantity || box.qtyInHand <= parseInt(maxQuantity));
    
    return matchesSearch && matchesStatus && matchesQuantityRange;
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setQuantityFilter("all");
    setBoxStatusFilter("all");
    setMinQuantity("");
    setMaxQuantity("");
  };

  const handleAddItem = (item: InventoryItem) => {
    if (editingItem) {
      setInventory(inventory.map(i => i.id === item.id ? item : i));
      setEditingItem(null);
    } else {
      setInventory([...inventory, item]);
    }
  };

  const handleAddBox = (box: GiftBox) => {
    if (editingBox) {
      setGiftBoxes(giftBoxes.map(b => b.id === box.id ? box : b));
      setEditingBox(null);
    } else {
      setGiftBoxes([...giftBoxes, box]);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleEditBox = (box: GiftBox) => {
    setEditingBox(box);
    setIsBoxModalOpen(true);
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-500" };
    if (quantity < threshold) return { label: "Low Stock", color: "bg-amber-500" };
    return { label: "In Stock", color: "bg-green-500" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gift-products">Gift Products</TabsTrigger>
          <TabsTrigger value="gift-boxes">Gift Boxes</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Button 
            className="flex items-center gap-2 mb-4"
            onClick={() => {
              if (activeTab === "gift-products") {
                setEditingItem(null);
                setIsItemModalOpen(true);
              } else {
                setEditingBox(null);
                setIsBoxModalOpen(true);
              }
            }}
          >
            <Plus className="h-4 w-4" />
            Add New {activeTab === "gift-products" ? "Item" : "Gift Box"}
          </Button>
        </div>

        {/* Enhanced Filters Section */}
        <div className="bg-muted/20 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search by Product Name</Label>
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === "gift-products" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quantity Range</Label>
                  <Select value={quantityFilter} onValueChange={setQuantityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Quantities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quantities</SelectItem>
                      <SelectItem value="low">Low (0-24)</SelectItem>
                      <SelectItem value="medium">Medium (25-99)</SelectItem>
                      <SelectItem value="high">High (100+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeTab === "gift-boxes" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={boxStatusFilter} onValueChange={setBoxStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Min Quantity</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Max Quantity</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Refill Date</Label>
              <Input type="date" placeholder="Filter by date" />
            </div>
          </div>

          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {activeTab === "gift-products" ? filteredInventory.length : filteredGiftBoxes.length} items
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="gift-products" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
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
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.reorderThreshold}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                      <TableCell>{formatDate(item.lastRefilledDate)}</TableCell>
                      <TableCell>
                        {isLowStock(item.quantity, item.reorderThreshold) ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge variant="secondary">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="gift-boxes" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Box Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty In Hand</TableHead>
                  <TableHead className="text-right">Reorder Threshold</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Refill Date</TableHead>
                  <TableHead>Component SKUs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGiftBoxes.length > 0 ? (
                  filteredGiftBoxes.map((box) => {
                    const stockStatus = getStockStatus(box.qtyInHand, box.reorderThreshold);
                    return (
                      <TableRow key={box.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {box.boxName}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{box.sku}</TableCell>
                        <TableCell className="text-right font-medium">{box.qtyInHand}</TableCell>
                        <TableCell className="text-right">{box.reorderThreshold}</TableCell>
                        <TableCell className="text-right">{formatCurrency(box.unitCost)}</TableCell>
                        <TableCell>
                          <Badge className={`${stockStatus.color} text-white border-0`}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(box.lastRefilledDate)}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="cursor-help">
                                  {box.componentSkus.length} components
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div>
                                  <p className="font-medium mb-1">Components:</p>
                                  <ul className="text-sm space-y-1">
                                    {box.componentSkus.map((sku, index) => (
                                      <li key={index}>• {sku}</li>
                                    ))}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditBox(box)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No gift boxes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Item Modal */}
      <AddInventoryItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onItemAdded={handleAddItem}
        editingItem={editingItem}
      />

      {/* Add/Edit Gift Box Modal */}
      <AddGiftBoxModal
        isOpen={isBoxModalOpen}
        onClose={() => {
          setIsBoxModalOpen(false);
          setEditingBox(null);
        }}
        onBoxAdded={handleAddBox}
        editingBox={editingBox}
      />
    </div>
  );
};

export default AdminInventory;
