import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Saarthi from "./pages/Saarthi";
import Analytics from "./pages/Analytics";
import Career from "./pages/Career";
import Community from "./pages/Community";
import Social from "./pages/Social";
import Clubs from "./pages/Clubs";
import Marketplace from "./pages/Marketplace";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

/** Redirects unauthenticated users to /login */
const Protected = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 rounded-lg bg-primary animate-spin" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Identity...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected */}
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/saarthi" element={<Protected><Saarthi /></Protected>} />
            <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
            <Route path="/career" element={<Protected><Career /></Protected>} />
            <Route path="/community" element={<Protected><Community /></Protected>} />
            <Route path="/social" element={<Protected><Social /></Protected>} />
            <Route path="/clubs" element={<Protected><Clubs /></Protected>} />
            <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
            <Route path="/gamification" element={<Protected><Gamification /></Protected>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
