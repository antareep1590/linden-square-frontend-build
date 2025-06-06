
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LindenSquareLogo from './LindenSquareLogo';
import { 
  LayoutDashboard, 
  Gift, 
  Pen, 
  Package, 
  Truck, 
  Archive, 
  FileText,
  ChevronRight,
  ChevronLeft,
  Users,
  Settings,
  UserCog,
  Sparkles,
  PackageOpen
} from 'lucide-react';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

// Client menu items
const clientMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Recipients', path: '/customers', icon: <Users size={20} /> },
  { name: 'Gift Box', path: '/gift-box-flow', icon: <Sparkles size={20} /> },
  { name: 'Track Orders', path: '/track-orders', icon: <Truck size={20} /> },
  { name: 'Invoices & Payments', path: '/invoices', icon: <FileText size={20} /> },
];

// Updated admin menu items with reordering and unique icons
const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Team', path: '/admin/users', icon: <UserCog size={20} /> },
  { name: 'Client Management', path: '/admin/client-management', icon: <Users size={20} /> },
  { name: 'Gift Catalog', path: '/admin/gift-catalog', icon: <Gift size={20} /> },
  { name: 'Preset Gift Box Setup', path: '/admin/preset-setup', icon: <PackageOpen size={20} /> },
  { name: 'Packaging & Delivery', path: '/admin/packaging-delivery', icon: <Package size={20} /> },
  { name: 'Track Orders', path: '/admin/track-orders', icon: <Truck size={20} /> },
  { name: 'Inventory Management', path: '/admin/inventory', icon: <Archive size={20} /> },
  { name: 'Invoices & Payments', path: '/admin/invoices', icon: <FileText size={20} /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Choose the appropriate menu items based on whether we're in admin mode
  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  return (
    <div 
      className={cn(
        'h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col flex-shrink-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
        {!collapsed && (
          <div className="flex-1">
            <LindenSquareLogo size="small" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto flex-shrink-0"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto py-4 bg-white">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.path
                  ? 'bg-linden-lightblue text-linden-blue'
                  : 'text-gray-700 hover:bg-gray-100',
                collapsed ? 'justify-center' : 'justify-start'
              )}
            >
              <div className={cn('flex items-center', collapsed ? 'justify-center' : '')}>
                {item.icon}
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
