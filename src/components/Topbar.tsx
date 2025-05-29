
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface TopbarProps {
  isAdmin?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // For now, just redirect to login page
    navigate('/');
  };

  const handleProfile = () => {
    if (isAdmin) {
      navigate('/admin/my-profile');
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-end bg-white">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-sm font-medium">
              {isAdmin ? 'Admin User' : 'Client Name'}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className={isAdmin ? "bg-linden-gold text-white" : "bg-linden-blue text-white"}>
                {isAdmin ? 'AU' : 'CN'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Topbar;
