import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider
import { Navbar } from "@/components/Navbar"; // Import Navbar

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard"; // Import Dashboard
import UploadPage from "./pages/UploadPage"; // Import UploadPage
import QuizPage from "./pages/QuizPage"; // Import QuizPage
import FlashcardPage from "./pages/FlashcardPage"; // Import FlashcardPage
import HelpPage from "./pages/HelpPage"; // Import HelpPage
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> {/* Wrap with ThemeProvider */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar /> {/* Include Navbar */}
          <div className="pt-4"> {/* Add some padding below the navbar */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} /> {/* New route */}
              <Route path="/upload" element={<UploadPage />} /> {/* New route */}
              <Route path="/quizzes" element={<QuizPage />} /> {/* New route */}
              <Route path="/flashcards" element={<FlashcardPage />} /> {/* New route */}
              <Route path="/help" element={<HelpPage />} /> {/* New route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;