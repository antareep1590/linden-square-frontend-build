
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (recipients: any[]) => void;
}

const BulkUploadModal = ({ isOpen, onClose, onUploadSuccess }: BulkUploadModalProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      // Mock CSV parsing - in real app, would parse the CSV
      const mockData = [
        { name: 'John Smith', email: 'john.smith@company.com', phone: '+1-555-0123', department: 'Engineering' },
        { name: 'Jane Doe', email: 'jane.doe@company.com', phone: '+1-555-0124', department: 'Marketing' },
        { name: 'Bob Johnson', email: 'bob.johnson@company.com', phone: '+1-555-0125', department: 'Sales' }
      ];
      setPreviewData(mockData);
      toast.success('CSV file uploaded and validated');
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const downloadTemplate = () => {
    // Mock template download
    toast.success('CSV template downloaded');
  };

  const handleConfirmUpload = () => {
    if (previewData.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        onUploadSuccess(previewData);
        setIsUploading(false);
        setUploadedFile(null);
        setPreviewData([]);
        onClose();
        toast.success(`${previewData.length} recipients imported successfully`);
      }, 1000);
    }
  };

  const handleClose = () => {
    setUploadedFile(null);
    setPreviewData([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Recipients</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
            <span className="text-sm text-gray-600">
              Use our template to ensure proper formatting
            </span>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {uploadedFile ? uploadedFile.name : 'Upload CSV File'}
              </p>
              <p className="text-sm text-gray-600">
                {uploadedFile 
                  ? 'File uploaded successfully. Preview below.'
                  : 'Click to upload or drag and drop your CSV file here'
                }
              </p>
            </label>
          </div>

          {/* Preview Data */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Preview ({previewData.length} recipients)</h3>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-700">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Phone</span>
                    <span>Department</span>
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {previewData.map((recipient, index) => (
                    <div key={index} className="px-4 py-2 border-b last:border-b-0">
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <span>{recipient.name}</span>
                        <span>{recipient.email}</span>
                        <span>{recipient.phone}</span>
                        <span>{recipient.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Ready to import</p>
                    <p>All recipients will be added to your list. You can add addresses later.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmUpload}
            disabled={previewData.length === 0 || isUploading}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            {isUploading ? 'Importing...' : `Import ${previewData.length} Recipients`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadModal;
