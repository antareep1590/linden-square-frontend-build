
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, User, Palette, MessageSquare, Bell, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { toast } from 'sonner';

const ProfileStandalone = () => {
  const navigate = useNavigate();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    companyName: 'TechCorp Solutions',
    contactName: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    website: 'https://techcorp.com'
  });

  const [brandingData, setBrandingData] = useState({
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#F59E0B',
    welcomeMessage: 'Welcome to TechCorp\'s Gift Portal',
    companyDescription: 'Building innovative solutions for tomorrow\'s challenges.',
    portalTheme: 'professional'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    campaignReminders: true,
    recipientUpdates: true
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandingChange = (field: string, value: any) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully!');
  };

  const handlePreviewPortal = () => {
    toast.info('Portal preview will open with your custom branding');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LindenSquareLogo size="medium" />
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <h1 className="hidden sm:block text-xl font-semibold text-gray-900">My Profile</h1>
            </div>
            <Button variant="outline" onClick={handleBackToHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={(e) => handleProfileChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Primary Contact</Label>
                  <Input
                    id="contactName"
                    value={profileData.contactName}
                    onChange={(e) => handleProfileChange('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => handleProfileChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => handleProfileChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => handleProfileChange('zipCode', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Brand Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Customization
              </CardTitle>
              <p className="text-sm text-gray-600">
                Customize how your gift portal appears to your team and recipients
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {brandingData.logo ? (
                      <img src={brandingData.logo} alt="Logo preview" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-gray-500">
                      Recommended: 200x80px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={brandingData.primaryColor}
                      onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={brandingData.primaryColor}
                      onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={brandingData.secondaryColor}
                      onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={brandingData.secondaryColor}
                      onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Portal Theme */}
              <div className="space-y-2">
                <Label htmlFor="portalTheme">Portal Theme</Label>
                <Select value={brandingData.portalTheme} onValueChange={(value) => handleBrandingChange('portalTheme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Portal Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={brandingData.welcomeMessage}
                  onChange={(e) => handleBrandingChange('welcomeMessage', e.target.value)}
                  placeholder="Welcome message for your gift portal"
                />
              </div>

              {/* Company Description */}
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={brandingData.companyDescription}
                  onChange={(e) => handleBrandingChange('companyDescription', e.target.value)}
                  placeholder="Brief description of your company"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handlePreviewPortal} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via text message</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about order status changes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Campaign Reminders</Label>
                    <p className="text-sm text-gray-500">Reminders for upcoming campaigns</p>
                  </div>
                  <Switch
                    checked={notificationSettings.campaignReminders}
                    onCheckedChange={(checked) => handleNotificationChange('campaignReminders', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Recipient Updates</Label>
                    <p className="text-sm text-gray-500">Notifications when recipients receive gifts</p>
                  </div>
                  <Switch
                    checked={notificationSettings.recipientUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('recipientUpdates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleBackToHome}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-linden-blue hover:bg-linden-blue/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStandalone;
