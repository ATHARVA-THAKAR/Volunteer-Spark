import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleDashboard from "@/components/RoleDashboard";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import Volunteers from "@/pages/Volunteers";
import CheckIns from "@/pages/CheckIns";
import Analytics from "@/pages/Analytics";
import Welcome from "@/pages/Welcome";
import Auth from "@/pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth/:role" element={<Auth />} />
              <Route path="/auth" element={<Navigate to="/welcome" replace />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<RoleDashboard />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/volunteer" element={<VolunteerDashboard />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/check-ins" element={<CheckIns />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
