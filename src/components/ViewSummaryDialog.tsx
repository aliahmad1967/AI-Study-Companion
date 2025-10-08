"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      </DialogContent>
    </Dialog>
  );
}