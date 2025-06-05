import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { ArrowLeft, Upload } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic
    navigate('/dashboard');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setView('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setView('login');
  };

  const handleAdminLogin = () => {
    navigate('/admin/dashboard');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderLoginForm = () => (
    <>
      <CardHeader className="text-center">
        <h1 className="text-2xl font-semibold text-linden-blue">Welcome Back</h1>
        <p className="text-sm text-gray-500 mt-1">Please sign in to access your account</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleClientLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <Button type="submit" className="w-full bg-linden-blue hover:bg-opacity-90">
            Login as Client
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => setView('forgot')}
            className="text-sm text-linden-blue hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 border-t pt-4">
        <Button 
          onClick={() => setView('signup')}
          className="w-full bg-linden-gold hover:bg-linden-gold/90 text-white font-semibold"
        >
          Sign Up (Client)
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleAdminLogin}
          className="w-full border-linden-gold text-linden-gold hover:bg-linden-gold hover:text-white"
        >
          Login as Admin
        </Button>
      </CardFooter>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <CardHeader className="text-center">
        <h1 className="text-2xl font-semibold text-linden-blue">Create Account</h1>
        <p className="text-sm text-gray-500 mt-1">Join us to start sending amazing gift boxes</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@company.com" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+1 (555) 123-4567" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input 
                id="company" 
                placeholder="Acme Corp" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input 
              id="address" 
              placeholder="123 Main St, City, State, ZIP" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Company Website (Optional)</Label>
            <Input 
              id="website" 
              type="url"
              placeholder="https://company.com" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="logo" 
                type="file"
                accept="image/*"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, SVG (Max 5MB)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <Button type="submit" className="w-full bg-linden-blue hover:bg-opacity-90">
            Create Account
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-4">
        <button 
          onClick={() => setView('login')}
          className="text-sm text-linden-blue hover:underline"
        >
          Already have an account? Sign in
        </button>
      </CardFooter>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <CardHeader className="text-center">
        <h1 className="text-2xl font-semibold text-linden-blue">Reset Password</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your email to receive reset instructions</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
            />
          </div>
          
          <Button type="submit" className="w-full bg-linden-blue hover:bg-opacity-90">
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-4">
        <button 
          onClick={() => setView('login')}
          className="text-sm text-linden-blue hover:underline"
        >
          Back to Login
        </button>
      </CardFooter>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <CardHeader className="text-center">
        <h1 className="text-2xl font-semibold text-linden-blue">Create New Password</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your new password below</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input 
              id="confirmNewPassword" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <Button type="submit" className="w-full bg-linden-blue hover:bg-opacity-90">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="text-linden-blue hover:text-linden-blue/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        <div className="mb-8">
          <LindenSquareLogo size="large" />
        </div>
        
        <Card className="shadow-md">
          {view === 'login' && renderLoginForm()}
          {view === 'signup' && renderSignUpForm()}
          {view === 'forgot' && renderForgotPasswordForm()}
          {view === 'reset' && renderResetPasswordForm()}
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; 2025 Linden Square | <a href="#" className="hover:underline">Terms</a> | <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
