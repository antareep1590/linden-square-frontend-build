
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: Date;
  dueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const InvoiceDetailsModal = ({ isOpen, onClose, invoice }: InvoiceDetailsModalProps) => {
  if (!invoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'overdue':
        return 'bg-red-500 text-white';
      case 'draft':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-linden-blue mb-2">INVOICE</h2>
              <p className="text-gray-600">Linden Square LLC</p>
              <p className="text-gray-600">123 Business Ave</p>
              <p className="text-gray-600">San Francisco, CA 94105</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold mb-2">Invoice #{invoice.id}</p>
              <Badge className={`${getStatusColor(invoice.status)} border-0 capitalize mb-2`}>
                {invoice.status}
              </Badge>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Issue Date: {format(invoice.issueDate, 'MMM d, yyyy')}
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due Date: {format(invoice.dueDate, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bill To */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Bill To
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{invoice.customerName}</p>
              <p className="text-gray-600">{invoice.customerEmail}</p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-4">Items & Services</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-sm">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              {invoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 border-t">
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">{formatCurrency(item.unitPrice)}</div>
                  <div className="col-span-2 text-right font-medium">{formatCurrency(item.total)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Payment Terms</h4>
            <p className="text-sm text-blue-700">
              Payment is due within 30 days of invoice date. Late payments may incur additional fees.
              Please include invoice number with payment.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsModal;
