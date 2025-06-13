
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (recipients: any[]) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const downloadTemplate = () => {
    const csvContent = "Name,Email,Phone,Department\nJohn Smith,john@company.com,555-0123,Engineering\nJane Doe,jane@company.com,555-0124,Marketing";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipients_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    
    // Mock CSV parsing - in real app this would parse the actual file
    const mockData = [
      { id: Date.now() + 1, name: 'John Smith', email: 'john@company.com', phone: '555-0123', department: 'Engineering', valid: true },
      { id: Date.now() + 2, name: 'Jane Doe', email: 'jane@company.com', phone: '555-0124', department: 'Marketing', valid: true },
      { id: Date.now() + 3, name: 'Bob Wilson', email: 'invalid-email', phone: '555-0125', department: 'Sales', valid: false },
    ];

    setPreviewData(mockData);
    
    const validationErrors = mockData
      .filter(row => !row.valid)
      .map(row => `Row ${mockData.indexOf(row) + 1}: Invalid email format`);
    
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      toast.success('CSV file processed successfully');
    } else {
      toast.error(`${validationErrors.length} validation errors found`);
    }
  };

  const handleUpload = () => {
    const validRecipients = previewData.filter(row => row.valid);
    if (validRecipients.length === 0) {
      toast.error('No valid recipients to upload');
      return;
    }

    onUploadComplete(validRecipients);
    toast.success(`${validRecipients.length} recipients uploaded successfully`);
    handleClose();
  };

  const handleClose = () => {
    setCsvFile(null);
    setPreviewData([]);
    setErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Recipients</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium">Need a template?</h4>
              <p className="text-sm text-gray-600">Download our CSV template to ensure proper formatting</p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="csv-file" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {csvFile ? csvFile.name : 'Choose CSV file'}
                </p>
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop your CSV file here
                </p>
              </label>
            </div>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-red-800">Validation Errors</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Preview ({previewData.length} rows)</h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {previewData.filter(row => row.valid).length} valid
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <X className="h-4 w-4" />
                    {previewData.filter(row => !row.valid).length} errors
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index} className={row.valid ? '' : 'bg-red-50'}>
                        <TableCell>
                          {row.valid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.department}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={previewData.filter(row => row.valid).length === 0}
              className="bg-linden-blue hover:bg-linden-blue/90"
            >
              Upload {previewData.filter(row => row.valid).length} Recipients
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadModal;
