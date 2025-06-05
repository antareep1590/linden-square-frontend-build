
import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
