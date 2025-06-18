
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LindenSquareLogo from './LindenSquareLogo';
import { 
  LayoutDashboard, 
  Pen, 
  Package, 
  Truck, 
  Archive, 
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Users,
  Settings,
  UserCog,
  PackageOpen,
  ShoppingCart,
  Mail,
  Palette,
} from 'lucide-react';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  subItems?: SubMenuItem[];
};

type SubMenuItem = {
  name: string;
  icon: React.ReactNode;
  isViewOnly?: boolean;
};

// Client menu items
const clientMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Recipients', path: '/customers', icon: <Users size={20} /> },
  { 
    name: 'Order Management', 
    path: '/gift-box-flow', 
    icon: <ShoppingCart size={20} />,
    subItems: [
      { name: 'Choose Delivery Method', icon: <Mail size={16} />, isViewOnly: true },
      { name: 'Select Recipients', icon: <Users size={16} />, isViewOnly: true },
      { name: 'Customize Your Order', icon: <Palette size={16} />, isViewOnly: true },
      { name: 'Shipping & Fulfillment', icon: <Truck size={16} />, isViewOnly: true }
    ]
  },
  { name: 'Track Orders', path: '/track-orders', icon: <Package size={20} /> },
  { name: 'Invoices & Payments', path: '/invoices', icon: <FileText size={20} /> },
];

// Updated admin menu items with Gift Catalog removed
const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Team', path: '/admin/users', icon: <UserCog size={20} /> },
  { name: 'Client Management', path: '/admin/client-management', icon: <Users size={20} /> },
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSubMenu = (itemName: string) => {
    if (collapsed) return;
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  // Choose the appropriate menu items based on whether we're in admin mode
  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  const isOrderManagementPath = (path: string) => {
    const orderPaths = [
      '/gift-box-flow',
      '/box-listing',
      '/choose-delivery-method',
      '/recipient-selection',
      '/customization',
      '/shipping-fulfillment',
      '/egift-send-options'
    ];
    return orderPaths.some(orderPath => path.includes(orderPath));
  };

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
            <div key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors cursor-pointer',
                  location.pathname === item.path || (item.name === 'Order Management' && isOrderManagementPath(location.pathname))
                    ? 'bg-linden-lightblue text-linden-blue'
                    : 'text-gray-700 hover:bg-gray-100',
                  collapsed ? 'justify-center' : 'justify-between'
                )}
              >
                <div className={cn('flex items-center', collapsed ? 'justify-center' : '')}>
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </div>
                {!collapsed && item.subItems && (
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      'transition-transform',
                      expandedItems.includes(item.name) ? 'rotate-180' : ''
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubMenu(item.name);
                    }}
                  />
                )}
              </Link>

              {/* Sub-items */}
              {!collapsed && item.subItems && expandedItems.includes(item.name) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center px-3 py-2 text-xs rounded-md',
                        subItem.isViewOnly 
                          ? 'text-gray-500 cursor-default' 
                          : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                      )}
                    >
                      {subItem.icon}
                      <span className="ml-2">{subItem.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
