
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context-provider";
import { useAuth } from "@/hooks/use-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "@/components/Dashboard"; // For protected routes

const queryClient = new QueryClient();

// Helper component for protected routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    // You might want a more sophisticated loading screen here,
    // but for now, this prevents premature redirects.
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Handle admin approval pending state specifically for dashboard access
  if (profile && profile.role === 'admin' && !profile.is_approved) {
     // Redirect to a page that shows "Approval Pending" or back to Index which handles this.
     // For simplicity, Index.tsx already handles this, so allowing it to proceed there.
     // If Dashboard itself should not be rendered, add specific logic here or in Dashboard.
  }


  return children;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();

  // Display a global loading indicator while auth state is being determined
  if (loading && !user) { // Only show global loader if no user yet, otherwise Index/Dashboard handle their own loading
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {/* Example of a protected route if you had a separate dashboard page */}
      {/* <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard userRole={profile?.role || 'user'} userName={profile?.full_name || ''} />
          </ProtectedRoute>
        }
      /> */}
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
