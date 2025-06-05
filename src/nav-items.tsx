
import React from 'react';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import GiftBoxFlow from './pages/GiftBoxFlow';
import TrackOrders from './pages/TrackOrders';
import Invoices from './pages/Invoices';
import Profile from './pages/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCustomers from './pages/admin/Customers';
import AdminGiftCatalog from './pages/admin/GiftCatalog';
import AdminPersonalizationSettings from './pages/admin/PersonalizationSettings';
import AdminPackagingDelivery from './pages/admin/PackagingDelivery';
import AdminDeliveryManagement from './pages/admin/DeliveryManagement';
import AdminTrackOrders from './pages/admin/TrackOrders';
import AdminInventory from './pages/admin/Inventory';
import AdminInvoices from './pages/admin/Invoices';
import AdminSettings from './pages/admin/Settings';
import AdminUsers from './pages/admin/Users';
import AdminMyProfile from './pages/admin/MyProfile';

export const navItems = [
  // Client routes
  { to: '/dashboard', page: <Dashboard /> },
  { to: '/customers', page: <Customers /> },
  { to: '/gift-box-flow', page: <GiftBoxFlow /> },
  { to: '/track-orders', page: <TrackOrders /> },
  { to: '/invoices', page: <Invoices /> },
  { to: '/profile', page: <Profile /> },
  
  // Admin routes
  { to: '/admin/dashboard', page: <AdminDashboard /> },
  { to: '/admin/customers', page: <AdminCustomers /> },
  { to: '/admin/gift-catalog', page: <AdminGiftCatalog /> },
  { to: '/admin/personalization', page: <AdminPersonalizationSettings /> },
  { to: '/admin/packaging', page: <AdminPackagingDelivery /> },
  { to: '/admin/delivery', page: <AdminDeliveryManagement /> },
  { to: '/admin/track-orders', page: <AdminTrackOrders /> },
  { to: '/admin/inventory', page: <AdminInventory /> },
  { to: '/admin/invoices', page: <AdminInvoices /> },
  { to: '/admin/settings', page: <AdminSettings /> },
  { to: '/admin/users', page: <AdminUsers /> },
  { to: '/admin/my-profile', page: <AdminMyProfile /> },
];
