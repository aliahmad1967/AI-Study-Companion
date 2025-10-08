"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { notion, NOTION_DATABASE_ID_FLASHCARDS } from "@/lib/notion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  question: z.string().min(2, {
    message: "يجب أن يحتوي السؤال على حرفين على الأقل.",
  }),
  answer: z.string().min(2, {
    message: "يجب أن تحتوي الإجابة على حرفين على الأقل.",
  }),
  topic: z.string().optional(),
});

interface CreateFlashcardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFlashcardCreated: () => void;
}

export function CreateFlashcardDialog({
  isOpen,
  onClose,
  onFlashcardCreated,
}: CreateFlashcardDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      topic: "عام",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!NOTION_DATABASE_ID_FLASHCARDS) {
      toast.error("معرف قاعدة بيانات Notion للبطاقات التعليمية غير موجود. يرجى التحقق من ملف .env.");
      return;
    }

    toast.loading("جاري إنشاء بطاقة تعليمية جديدة في Notion...", { id: 'create-flashcard-progress' });

    try {
      await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID_FLASHCARDS,
        },
        properties: {
          Question: {
            title: [
              {
                text: {
                  content: values.question,
                },
              },
            ],
          },
          Answer: {
            rich_text: [
              {
                text: {
                  content: values.answer,
                },
              },
            ],
          },
          Topic: {
            select: {
              name: values.topic || "عام",
            },
          },
          "Created At": {
            date: {
              start: new Date().toISOString().split('T')[0],
            },
          },
        },
      });

      toast.success("تم إنشاء بطاقة تعليمية جديدة بنجاح في Notion!", { id: 'create-flashcard-progress' });
      form.reset();
      onFlashcardCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create flashcard in Notion:", error);
      toast.error("فشل إنشاء بطاقة تعليمية جديدة. يرجى المحاولة مرة أخرى.", { id: 'create-flashcard-progress' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} dir="rtl">
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء بطاقة تعليمية جديدة</DialogTitle>
          <DialogDescription>
            املأ التفاصيل لإنشاء بطاقة تعليمية جديدة.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السؤال</FormLabel>
                  <FormControl>
                    <Input placeholder="ما هو عاصمة فرنسا؟" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الإجابة</FormLabel>
                  <FormControl>
                    <Textarea placeholder="عاصمة فرنسا هي باريس." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموضوع (اختياري)</FormLabel>
                  <FormControl>
                    <Input placeholder="الجغرافيا" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}