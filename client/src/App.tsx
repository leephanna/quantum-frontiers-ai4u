import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Docs from "./pages/Docs";
import About from "./pages/About";
import SubmitJob from "./pages/SubmitJob";
import JobsList from "./pages/JobsList";
import JobDetail from "./pages/JobDetail";
import Leaderboard from "./pages/Leaderboard";
import RunCardView from "./pages/RunCardView";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/docs"} component={Docs} />
      <Route path={"/about"} component={About} />
      <Route path={"/submit"} component={SubmitJob} />
      <Route path={"/jobs"} component={JobsList} />
      <Route path={"/jobs/:id"} component={JobDetail} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/run/:id"} component={RunCardView} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
