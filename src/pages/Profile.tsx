
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, User, Building, Mail, Phone, Save, Palette, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    address: '123 Main St, City, State, ZIP',
    website: 'https://company.com'
  });

  const [brandingData, setBrandingData] = useState({
    companyLogo: '',
    selectedTheme: 'blue',
    welcomeMessage: 'Welcome to our gifting portal!'
  });

  const themes = [
    { value: 'blue', label: 'Professional Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Natural Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Creative Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Energetic Orange', color: 'bg-orange-500' },
    { value: 'dark', label: 'Modern Dark', color: 'bg-gray-800' },
    { value: 'light', label: 'Clean Light', color: 'bg-gray-100' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandingChange = (field: string, value: string) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSaveBranding = () => {
    toast.success('Branding settings saved! Changes will be applied across your portal.');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a file service
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandingData(prev => ({
          ...prev,
          companyLogo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      toast.success('Logo uploaded successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and branding preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Company Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Custom Branding Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Custom Branding Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {brandingData.companyLogo ? (
                  <div className="space-y-2">
                    <img 
                      src={brandingData.companyLogo} 
                      alt="Company Logo" 
                      className="mx-auto h-16 w-auto"
                    />
                    <p className="text-sm text-gray-600">Logo uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload your company logo</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-linden-blue file:text-white hover:file:bg-linden-blue/90"
                />
              </div>
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG, SVG (Max 5MB)</p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <Label>Portal Theme</Label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      brandingData.selectedTheme === theme.value
                        ? 'border-linden-blue bg-linden-blue/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleBrandingChange('selectedTheme', theme.value)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                      <span className="text-sm font-medium">{theme.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Custom Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={brandingData.welcomeMessage}
                onChange={(e) => handleBrandingChange('welcomeMessage', e.target.value)}
                placeholder="Enter a custom welcome message for your portal..."
                rows={3}
              />
            </div>

            {/* Theme Preview */}
            <div className="space-y-2">
              <Label>Theme Preview</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  {brandingData.companyLogo ? (
                    <img src={brandingData.companyLogo} alt="Logo" className="h-8 w-auto" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  )}
                  <div className="flex-1">
                    <div className="h-2 bg-gray-300 rounded w-24 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className={`p-3 rounded ${themes.find(t => t.value === brandingData.selectedTheme)?.color || 'bg-blue-500'} text-white`}>
                  <p className="text-sm">{brandingData.welcomeMessage}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveBranding} className="w-full bg-linden-gold hover:bg-linden-gold/90">
              <Save className="h-4 w-4 mr-2" />
              Save Branding Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Portal Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Notification Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Email notifications for delivery updates</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Campaign completion alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Weekly summary reports</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Portal Features</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Allow recipient address changes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Enable gift customization options</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Require delivery confirmation</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
