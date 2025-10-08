"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, LogIn, LogOut, MessageSquare } from "lucide-react"; // Import MessageSquare icon

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const navLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "لوحة التحكم", href: "/dashboard", authRequired: true },
  { name: "رفع المحتوى", href: "/upload", authRequired: true },
  { name: "الاختبارات", href: "/quizzes", authRequired: true },
  { name: "البطاقات التعليمية", href: "/flashcards", authRequired: true },
  { name: "مساعد الدردشة", href: "/chat", authRequired: true, icon: MessageSquare }, // Add chat link
  { name: "المساعدة", href: "/help" },
];

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('فشل تسجيل الخروج: ' + error.message);
    } else {
      toast.success('تم تسجيل الخروج بنجاح!');
    }
  };

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
          (!link.authRequired || user) && (
            <Button key={link.name} variant="ghost" asChild>
              <Link to={link.href}>
                {link.icon && <link.icon className="h-4 w-4 ml-2" />}
                {link.name}
              </Link>
            </Button>
          )
        ))}
        {!user ? (
          <Button variant="ghost" asChild>
            <Link to="/auth">
              <LogIn className="h-4 w-4 ml-2" />
              تسجيل الدخول
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        )}
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
                (!link.authRequired || user) && (
                  <Button key={link.name} variant="ghost" asChild className="justify-start">
                    <Link to={link.href}>
                      {link.icon && <link.icon className="h-4 w-4 ml-2" />}
                      {link.name}
                    </Link>
                  </Button>
                )
              ))}
              {!user ? (
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 ml-2" />
                    تسجيل الدخول
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}