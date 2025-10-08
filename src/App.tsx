import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Removed Navigate
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
// Removed AuthProvider and useAuth
import React from "react";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import QuizPage from "./pages/QuizPage";
import FlashcardPage from "./pages/FlashcardPage";
import HelpPage from "./pages/HelpPage";
// Removed AuthPage
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Removed ProtectedRoute component

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Removed AuthProvider */}
            <Navbar />
            <div className="pt-4">
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Removed AuthPage route */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* No longer protected */}
                <Route path="/upload" element={<UploadPage />} /> {/* No longer protected */}
                <Route path="/quizzes" element={<QuizPage />} /> {/* No longer protected */}
                <Route path="/flashcards" element={<FlashcardPage />} /> {/* No longer protected */}
                <Route path="/chat" element={<ChatPage />} /> {/* No longer protected */}
                <Route path="/help" element={<HelpPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          {/* Removed AuthProvider */}
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;