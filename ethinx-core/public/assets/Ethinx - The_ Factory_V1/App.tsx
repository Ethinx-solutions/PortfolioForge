import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";
import Home from "./pages/Home";
import ExecutionTracker from "./pages/ExecutionTracker";
import RevenueForge from "./pages/RevenueForge";
import NeuralRecon from "./pages/NeuralRecon";
import Blueprint from "./pages/Blueprint";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/execution"} component={ExecutionTracker} />
        <Route path={"/revenue-forge"} component={RevenueForge} />
        <Route path={"/neural-recon"} component={NeuralRecon} />
        <Route path={"/blueprint"} component={Blueprint} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AudioProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
