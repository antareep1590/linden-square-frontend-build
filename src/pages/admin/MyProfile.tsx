import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Camera,
  Save,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  occupation: string;
  bio: string;
}

const mockProfileData: ProfileData = {
  name: "David Chen",
  email: "david.chen@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  birthday: "1990-05-15",
  occupation: "Software Engineer",
  bio: "Passionate about building innovative solutions and making a positive impact on the world."
};

const MyProfile = () => {
  const [profile, setProfile] = useState(mockProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-col items-center pb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile Image" />
            <AvatarFallback>DC</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <CardTitle className="text-lg font-semibold">{profile.name}</CardTitle>
            <p className="text-sm text-gray-500">{profile.occupation}</p>
            <Badge variant="secondary" className="mt-2">Admin</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="w-full justify-center">
              <TabsTrigger value="profile" className="data-[state=active]:text-linden-blue">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:text-linden-blue">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={profile.birthday}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={profile.occupation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="resize-none"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="space-y-4">
                <Card className="shadow-none border-0">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input type="password" id="currentPassword" placeholder="Enter current password" />
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input type="password" id="newPassword" placeholder="Enter new password" />
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input type="password" id="confirmPassword" placeholder="Confirm new password" />
                      <Button className="mt-4">Update Password</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-none border-0">
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account with two-factor authentication.</p>
                    <Button className="mt-4">Enable Two-Factor Authentication</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
