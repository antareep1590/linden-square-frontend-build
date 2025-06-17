
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Upload, Calendar as CalendarIcon, Send, Clock, Building } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const EGiftSendOptions = () => {
  const navigate = useNavigate();
  const [sendOption, setSendOption] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoUploaded(true);
      toast.success('Logo uploaded successfully');
      event.target.value = '';
    }
  };

  const handleContinue = () => {
    if (sendOption === 'scheduled' && !scheduledDate) {
      toast.error('Please select a send date');
      return;
    }
    navigate('/payment-method');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/customization')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customization
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Digital Gift Settings</h1>
          <p className="text-gray-600">Configure branding and delivery timing for your digital gifts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Brand Logo Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload your company logo to include in the digital gift email notifications.
                  </p>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <Label htmlFor="logo-upload" className="cursor-pointer text-sm font-medium text-linden-blue hover:text-linden-blue/80">
                        {logoUploaded ? 'Change Logo' : 'Upload Logo'}
                      </Label>
                      <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                      {logoUploaded && (
                        <p className="text-xs text-green-600 mt-2">✓ Logo uploaded successfully</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={sendOption} onValueChange={(value: 'now' | 'scheduled') => setSendOption(value)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="now" id="send-now" />
                    <div className="flex-1">
                      <Label htmlFor="send-now" className="flex items-center gap-2 cursor-pointer">
                        <Send className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Send Now</span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Digital gift notifications will be sent immediately after payment confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="scheduled" id="send-scheduled" />
                    <div className="flex-1">
                      <Label htmlFor="send-scheduled" className="flex items-center gap-2 cursor-pointer">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Schedule for Future Date</span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        Choose a specific date to send the digital gift notifications.
                      </p>
                      
                      {sendOption === 'scheduled' && (
                        <div className="mt-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !scheduledDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Digital Gift Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Delivery Method:</span>
                  <span className="font-medium">Digital Email</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo Branding:</span>
                  <span className={logoUploaded ? "text-green-600" : "text-gray-500"}>
                    {logoUploaded ? "✓ Uploaded" : "Not uploaded"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Send Option:</span>
                  <span className="font-medium">
                    {sendOption === 'now' ? 'Send Now' : 'Scheduled'}
                  </span>
                </div>
                {sendOption === 'scheduled' && scheduledDate && (
                  <div className="flex justify-between">
                    <span>Send Date:</span>
                    <span className="font-medium">{format(scheduledDate, "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                >
                  Continue to Payment
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                <p>
                  Recipients will receive an email notification with redemption instructions.
                  They can then provide their shipping address and preferences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EGiftSendOptions;
