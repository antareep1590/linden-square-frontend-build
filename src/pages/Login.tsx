
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleAdminLogin = () => {
    navigate('/admin/dashboard');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

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
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full bg-linden-blue hover:bg-opacity-90">
                Login as Client
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <Button 
              variant="outline" 
              onClick={handleAdminLogin}
              className="w-full border-linden-gold text-linden-gold hover:bg-linden-gold hover:text-white"
            >
              Login as Admin
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; 2025 Linden Square | <a href="#" className="hover:underline">Terms</a> | <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
