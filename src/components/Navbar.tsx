"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, MessageSquare, FileText, BookOpen } from "lucide-react"; // Added BookOpen icon for flashcards

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "لوحة التحكم", href: "/dashboard" },
  { name: "رفع المحتوى", href: "/upload" },
  { name: "الملخصات", href: "/summaries", icon: FileText },
  { name: "الاختبارات", href: "/quizzes" },
  { name: "البطاقات التعليمية", href: "/flashcards", icon: BookOpen }, // Added icon here
  { name: "مساعد الدردشة", href: "/chat", icon: MessageSquare },
  { name: "المساعدة", href: "/help" },
];

export function Navbar() {
  return (
    <nav className="bg-background border-b px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold text-primary-foreground">
          رفيق الدراسة بالذكاء الاصطناعي
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map((link) => (
          <Button key={link.name} variant="ghost" asChild>
            <Link to={link.href}>
              {link.icon && <link.icon className="h-4 w-4 ml-2" />}
              {link.name}
            </Link>
          </Button>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <Sheet dir="rtl">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">فتح القائمة</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] flex flex-col">
            <Link to="/" className="text-lg font-bold text-primary-foreground mb-4">
              رفيق الدراسة بالذكاء الاصطناعي
            </Link>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Button key={link.name} variant="ghost" asChild className="justify-start">
                  <Link to={link.href}>
                    {link.icon && <link.icon className="h-4 w-4 ml-2" />}
                    {link.name}
                  </Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}