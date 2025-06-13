import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Home from 'react-icons/fa6/home';
import Gift from 'react-icons/fa6/gift';
import Package from 'react-icons/fa6/package';
import Users from 'react-icons/fa6/users';
import FileText from 'react-icons/fa6/file-text';
import User from 'react-icons/fa6/user';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      current: location.pathname === '/dashboard'
    },
    {
      label: 'Order Management',
      icon: Gift,
      path: '/gift-box-flow',
      current: location.pathname.includes('/gift-box-flow') || 
               location.pathname.includes('/box-listing') ||
               location.pathname.includes('/customize-box') ||
               location.pathname.includes('/personalization') ||
               location.pathname.includes('/recipients') ||
               location.pathname.includes('/summary')
    },
    {
      label: 'Track Orders',
      icon: Package,
      path: '/track-orders',
      current: location.pathname === '/track-orders'
    },
    {
      label: 'Customers',
      icon: Users,
      path: '/customers',
      current: location.pathname === '/customers'
    },
    {
      label: 'Invoices',
      icon: FileText,
      path: '/invoices',
      current: location.pathname === '/invoices'
    },
    {
      label: 'Profile',
      icon: User,
      path: '/profile',
      current: location.pathname === '/profile'
    }
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
