import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
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

const queryClient = new QueryClient();

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
            <Route path="/images/:imageId/:action" element={<Index />} />
            
            {/* Pricing page - public route that handles auth state internally */}
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/purchase"
              element={
                <>
                  <SignedIn>
                    <Purchase />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
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
