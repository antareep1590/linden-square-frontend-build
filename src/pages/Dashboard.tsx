
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, Users, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockOrders = [
  { 
    id: 'ORD-001', 
    giftName: 'Corporate Welcome Box', 
    recipients: 24, 
    status: 'Processing', 
    date: '2025-04-02' 
  },
  { 
    id: 'ORD-002', 
    giftName: 'Holiday Gift Bundle', 
    recipients: 56, 
    status: 'Pending Addresses', 
    date: '2025-03-28' 
  },
  { 
    id: 'ORD-003', 
    giftName: 'Employee Appreciation Kit', 
    recipients: 12, 
    status: 'Completed', 
    date: '2025-03-15' 
  },
  { 
    id: 'ORD-004', 
    giftName: 'Client Thank You Package', 
    recipients: 8, 
    status: 'Shipped', 
    date: '2025-03-10' 
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your Linden Square dashboard.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gifts Ordered</CardTitle>
            <Gift className="h-4 w-4 text-linden-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Address Submissions</CardTitle>
            <Users className="h-4 w-4 text-linden-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">Across 2 orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Remaining</CardTitle>
            <Package className="h-4 w-4 text-linden-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">384</div>
            <p className="text-xs text-muted-foreground">Items in stock</p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-medium mb-4">Latest Bulk Orders</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Gift Name</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.giftName}</TableCell>
                    <TableCell>{order.recipients}</TableCell>
                    <TableCell>
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-block
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'Pending Addresses' ? 'bg-amber-100 text-amber-800' : ''}
                        ${order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' : ''}
                      `}>
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
