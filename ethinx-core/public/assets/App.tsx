import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Ecosystem from "./pages/Ecosystem";
import Subsystems from "./pages/Subsystems";
import Cockpit from "./pages/Cockpit";
import Archetypes from "./pages/Archetypes";
import Architecture from "./pages/Architecture";
import API from "./pages/API";
import Philosophy from "./pages/Philosophy";
import About from "./pages/About";
import Contact from "./pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/ecosystem"} component={Ecosystem} />
      <Route path={"/subsystems"} component={Subsystems} />
      <Route path={"/subsystems/:slug"} component={Subsystems} />
      <Route path={"/cockpit"} component={Cockpit} />
      <Route path={"/archetypes"} component={Archetypes} />
      <Route path={"/archetypes/:slug"} component={Archetypes} />
      <Route path={"/architecture"} component={Architecture} />
      <Route path={"/api"} component={API} />
      <Route path={"/philosophy"} component={Philosophy} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
