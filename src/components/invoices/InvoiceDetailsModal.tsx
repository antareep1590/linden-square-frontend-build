
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Building, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: string;
  giftBoxName: string;
  giftItems: string[];
}

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  // Mock itemized breakdown
  const itemizedItems = [
    { description: "Premium Gift Box Set", quantity: 25, unitPrice: 45.00, total: 1125.00 },
    { description: "Custom Packaging", quantity: 25, unitPrice: 8.00, total: 200.00 },
    { description: "Shipping & Handling", quantity: 1, unitPrice: 150.00, total: 150.00 },
    { description: "Processing Fee", quantity: 1, unitPrice: 25.00, total: 25.00 }
  ];

  const subtotal = itemizedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleDownload = () => {
    console.log('Downloading invoice:', invoice.id);
    // In a real app, this would trigger a PDF download
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </DialogTitle>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Invoice #{invoice.id}</CardTitle>
                  <p className="text-gray-600 mt-1">Linden Square Gifting Solutions</p>
                </div>
                <Badge className={
                  invoice.status === "paid" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Billed To:</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.client}</p>
                    <p>123 Business Ave</p>
                    <p>Business City, BC 12345</p>
                    <p>contact@{invoice.client.toLowerCase().replace(' ', '')}.com</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Invoice Date:</span>
                  </div>
                  <p className="text-sm text-gray-600">{format(new Date(invoice.date), "MMMM d, yyyy")}</p>
                  
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Amount Due:</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itemized Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Itemized Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-gray-600">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items */}
                {itemizedItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 py-2 text-sm">
                    <div className="col-span-6">{item.description}</div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">${item.unitPrice.toFixed(2)}</div>
                    <div className="col-span-2 text-right">${item.total.toFixed(2)}</div>
                  </div>
                ))}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Payment Method:</p>
                  <p className="text-sm text-gray-600">Corporate Credit Card</p>
                  <p className="text-sm text-gray-600">**** **** **** 4567</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Payment Terms:</p>
                  <p className="text-sm text-gray-600">Net 30 days</p>
                  <p className="text-sm text-gray-600">
                    Due: {format(new Date(new Date(invoice.date).getTime() + 30 * 24 * 60 * 60 * 1000), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsModal;
