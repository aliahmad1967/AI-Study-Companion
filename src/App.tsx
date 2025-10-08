import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import React from "react";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import QuizPage from "./pages/QuizPage";
import FlashcardPage from "./pages/FlashcardPage";
import HelpPage from "./pages/HelpPage";
import ChatPage from "./pages/ChatPage";
import SummariesPage from "./pages/SummariesPage";
import QuizDetailPage from "./pages/QuizDetailPage"; // Import the new page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Navbar />
            <div className="pt-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/quizzes" element={<QuizPage />} />
                <Route path="/quizzes/:quizId" element={<QuizDetailPage />} /> {/* New route */}
                <Route path="/flashcards" element={<FlashcardPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/summaries" element={<SummariesPage />} />
                <Route path="/help" element={<HelpPage />} />
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