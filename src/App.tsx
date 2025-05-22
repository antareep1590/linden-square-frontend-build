
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
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
            {/* Placeholder routes for other admin pages */}
            <Route path="gift-catalog" element={<NotFound />} />
            <Route path="personalization" element={<NotFound />} />
            <Route path="packaging" element={<NotFound />} />
            <Route path="delivery" element={<NotFound />} />
            <Route path="track-orders" element={<NotFound />} />
            <Route path="inventory" element={<NotFound />} />
            <Route path="invoices" element={<NotFound />} />
            <Route path="settings" element={<NotFound />} />
            <Route path="users" element={<NotFound />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
