"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Import DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; // Import Button
import { Share2 } from 'lucide-react'; // Import Share2 icon
import { toast } from 'sonner'; // Import toast for notifications

interface ViewSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  createdAt: string;
}

export function ViewSummaryDialog({
  isOpen,
  onClose,
  title,
  content,
  createdAt,
}: ViewSummaryDialogProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `ملخص: ${title}`,
          text: content,
        });
        toast.success("تمت مشاركة الملخص بنجاح!");
      } else {
        await navigator.clipboard.writeText(content);
        toast.success("تم نسخ الملخص إلى الحافظة!");
      }
    } catch (error) {
      console.error("Failed to share or copy summary:", error);
      toast.error("فشل في مشاركة أو نسخ الملخص.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} dir="rtl">
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            تم الإنشاء في: {createdAt}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 border rounded-md mt-4">
          <p className="text-base text-foreground whitespace-pre-wrap text-right">
            {content}
          </p>
        </ScrollArea>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 ml-2" />
            مشاركة
          </Button>
          <Button onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}