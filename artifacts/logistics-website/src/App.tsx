import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Tracking from "@/pages/tracking";
import Quote from "@/pages/quote";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import { Chatbot } from "@/components/chatbot";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useLocation } from "wouter";

const queryClient = new QueryClient();

function Router() {
  usePageTracking();
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/quote" component={Quote} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      {!isAdmin && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
