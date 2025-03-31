import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/SupabaseAuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Examples from "./pages/Examples";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Purchase from "./pages/Purchase";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-gray-600">Please wait while we check your authentication.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <div className="min-h-screen pt-20">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/images/:imageId/:action" element={<Index />} />
            
            {/* Pricing page - public route that handles auth state internally */}
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase"
              element={
                <ProtectedRoute>
                  <Purchase />
                </ProtectedRoute>
              }
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
