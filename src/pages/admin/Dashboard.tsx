
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Users, 
  Truck, 
  AlertCircle,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  FileText,
  Gift,
  Clock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground">+8 new this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">254</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,400</div>
            <p className="text-xs text-muted-foreground">7 pending payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Inventory Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">7</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Order INV-3423 created by ABC Corp</p>
                  <p className="text-xs text-gray-500">3 gift boxes • 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Gift className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Gift Box Holiday Hamper added to catalog</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Truck className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Packaging assigned to John Doe for Order INV-3410</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Payment of $5,400 received from XYZ Pvt Ltd</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Latest Orders
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">ORD-2023-001</p>
                  <p className="text-sm text-gray-500">Acme Corp • 25 boxes</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 text-white">Delivered</Badge>
                  <Button variant="ghost" size="sm" className="mt-1">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">ORD-2023-002</p>
                  <p className="text-sm text-gray-500">Tech Innovations • 50 boxes</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-500 text-white">In Transit</Badge>
                  <Button variant="ghost" size="sm" className="mt-1">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">ORD-2023-003</p>
                  <p className="text-sm text-gray-500">Global Consulting • 40 boxes</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-amber-500 text-white">Processing</Badge>
                  <Button variant="ghost" size="sm" className="mt-1">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Packaging & Delivery Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Packaging & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Ready to Pack</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Packed</span>
                <Badge variant="outline">8</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">In Transit</span>
                <Badge variant="outline">25</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Delivered</span>
                <Badge variant="outline">156</Badge>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Go to Packaging Console
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Invoices
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">INV-001</p>
                  <p className="text-sm text-gray-500">Acme Corp</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2,500</p>
                  <Badge className="bg-green-500 text-white">Paid</Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">INV-002</p>
                  <p className="text-sm text-gray-500">Tech Innovations</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$4,200</p>
                  <Badge className="bg-amber-500 text-white">Due</Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">INV-003</p>
                  <p className="text-sm text-gray-500">Global Consulting</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$3,100</p>
                  <Badge className="bg-blue-500 text-white">Partial</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-red-600">Low Stock Alerts</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Premium Candles</span>
                    <Badge variant="destructive">5 left</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Wine Bottles</span>
                    <Badge variant="destructive">3 left</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Holiday Box</span>
                    <Badge variant="destructive">2 left</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Recently Added</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Executive Box</span>
                    <Badge variant="outline">25 units</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Holiday Special</span>
                    <Badge variant="outline">40 units</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              Add New Gift Item
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Create Preset Box
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Manage Inventory
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Truck className="h-6 w-6" />
              Packaging Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
