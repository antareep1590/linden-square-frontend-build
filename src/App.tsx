
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadRecipient from "./pages/UploadRecipient";
import PlaceholderPage from "./pages/PlaceholderPage";
import DashboardLayout from "./layouts/DashboardLayout";
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
          
          {/* Dashboard Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload-recipient" element={<UploadRecipient />} />
            <Route path="choose-gifts" element={<PlaceholderPage title="Choose Gifts" />} />
            <Route path="add-personalization" element={<PlaceholderPage title="Add Personalization" />} />
            <Route path="packaging" element={<PlaceholderPage title="Gift Box & Packaging" />} />
            <Route path="track-orders" element={<PlaceholderPage title="Track Orders" />} />
            <Route path="inventory" element={<PlaceholderPage title="Inventory" />} />
            <Route path="invoices" element={<PlaceholderPage title="Invoices & Payments" />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
