
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import SelectGifts from "./pages/SelectGifts";
import AddPersonalization from "./pages/AddPersonalization";
import GiftBoxPackaging from "./pages/GiftBoxPackaging";
import TrackOrders from "./pages/TrackOrders";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCustomers from "./pages/admin/Customers";
import GiftCatalog from "./pages/admin/GiftCatalog";
import PersonalizationSettings from "./pages/admin/PersonalizationSettings";
import PackagingDelivery from "./pages/admin/PackagingDelivery";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import AdminTrackOrders from "./pages/admin/TrackOrders";
import AdminInventory from "./pages/admin/Inventory";
import AdminInvoices from "./pages/admin/Invoices";
import AdminSettings from "./pages/admin/Settings";
import UserManagement from "./pages/admin/Users";
import MyProfile from "./pages/admin/MyProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Client Dashboard Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="select-gifts" element={<SelectGifts />} />
            <Route path="add-personalization" element={<AddPersonalization />} />
            <Route path="packaging" element={<GiftBoxPackaging />} />
            <Route path="track-orders" element={<TrackOrders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="gift-catalog" element={<GiftCatalog />} />
            <Route path="personalization" element={<PersonalizationSettings />} />
            <Route path="packaging" element={<PackagingDelivery />} />
            <Route path="delivery" element={<DeliveryManagement />} />
            <Route path="track-orders" element={<AdminTrackOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="my-profile" element={<MyProfile />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
