
import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Package,
  Settings,
  User,
  ShoppingBag,
  Truck,
  FileText,
  Boxes,
  Palette,
  Type,
  ListChecks,
  BarChart,
  TrendingUp,
  Archive,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AdminDashboard from '@/pages/admin/Dashboard';
import AdminClientManagement from '@/pages/admin/ClientManagement';
import AdminGiftCatalog from '@/pages/admin/GiftCatalog';
import AdminPresetGiftBoxSetup from '@/pages/admin/PresetGiftBoxSetup';
import AdminCustomizationSettings from '@/pages/admin/CustomizationSettings';
import AdminPersonalizationSettings from '@/pages/admin/PersonalizationSettings';
import AdminInventory from '@/pages/admin/Inventory';
import AdminCustomers from '@/pages/admin/Customers';
import AdminUsers from '@/pages/admin/Users';
import AdminTrackOrders from '@/pages/admin/TrackOrders';
import AdminShippingDelivery from '@/pages/admin/ShippingDelivery';
import AdminDeliveryManagement from '@/pages/admin/DeliveryManagement';
import AdminInvoices from '@/pages/admin/Invoices';
import AdminSettings from '@/pages/admin/Settings';
import AdminMyProfile from '@/pages/admin/MyProfile';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.split('/').pop() || 'dashboard');

  useEffect(() => {
    setActiveTab(location.pathname.split('/').pop() || 'dashboard');
  }, [location.pathname]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/admin/${tabId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'clients':
        return <AdminClientManagement />;
      case 'gift-catalog':
        return <AdminGiftCatalog />;
      case 'preset-gift-boxes':
        return <AdminPresetGiftBoxSetup />;
      case 'customization-settings':
        return <AdminCustomizationSettings />;
      case 'personalization-settings':
        return <AdminPersonalizationSettings />;
      case 'inventory':
        return <AdminInventory />;
      case 'customers':
        return <AdminCustomers />;
      case 'users':
        return <AdminUsers />;
      case 'track-orders':
        return <AdminTrackOrders />;
      case 'shipping-delivery':
        return <AdminShippingDelivery />;
      case 'delivery-management':
        return <AdminDeliveryManagement />;
      case 'invoices':
        return <AdminInvoices />;
      case 'settings':
        return <AdminSettings />;
      case 'profile':
        return <AdminMyProfile />;
      default:
        return <AdminDashboard />;
    }
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'gift-catalog',
      label: 'Gift Catalog',
      icon: Package,
    },
    {
      id: 'preset-gift-boxes',
      label: 'Preset Gift Boxes',
      icon: Boxes,
    },
    {
      id: 'customization-settings',
      label: 'Customization Settings',
      icon: Palette,
    },
    {
      id: 'personalization-settings',
      label: 'Personalization Settings',
      icon: Type,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Archive,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
    },
    {
      id: 'track-orders',
      label: 'Track Orders',
      icon: ShoppingBag,
    },
    {
      id: 'shipping-delivery',
      label: 'Shipping & Delivery',
      icon: Truck,
    },
    {
      id: 'delivery-management',
      label: 'Delivery Management',
      icon: Truck,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </div>
        <div className="p-4">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer ${activeTab === item.id ? 'bg-gray-100 font-semibold' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleTabClick('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
