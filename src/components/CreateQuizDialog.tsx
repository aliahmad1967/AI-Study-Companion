"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { notion, NOTION_DATABASE_ID_QUIZZES } from "@/lib/notion";

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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "يجب أن يحتوي العنوان على حرفين على الأقل.",
  }),
  topic: z.string().optional(),
  numberOfQuestions: z.coerce.number().min(1, {
    message: "يجب أن يكون عدد الأسئلة 1 على الأقل.",
  }).max(50, {
    message: "لا يمكن أن يتجاوز عدد الأسئلة 50.",
  }).default(10),
});

interface CreateQuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizCreated: () => void;
}

export function CreateQuizDialog({
  isOpen,
  onClose,
  onQuizCreated,
}: CreateQuizDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      topic: "عام",
      numberOfQuestions: 10,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!NOTION_DATABASE_ID_QUIZZES) {
      toast.error("معرف قاعدة بيانات Notion للاختبارات غير موجود. يرجى التحقق من ملف .env.");
      return;
    }

    toast.loading("جاري إنشاء اختبار جديد في Notion...", { id: 'create-quiz-progress' });

    try {
      await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID_QUIZZES,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: values.title,
                },
              },
            ],
          },
          Topic: {
            select: {
              name: values.topic || "عام",
            },
          },
          "Number of Questions": {
            number: values.numberOfQuestions,
          },
          "Created At": {
            date: {
              start: new Date().toISOString().split('T')[0],
            },
          },
        },
      });

      toast.success("تم إنشاء اختبار جديد بنجاح في Notion!", { id: 'create-quiz-progress' });
      form.reset();
      onQuizCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create quiz in Notion:", error);
      toast.error("فشل إنشاء اختبار جديد. يرجى المحاولة مرة أخرى.", { id: 'create-quiz-progress' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} dir="rtl">
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء اختبار جديد</DialogTitle>
          <DialogDescription>
            املأ التفاصيل لإنشاء اختبار جديد.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الاختبار</FormLabel>
                  <FormControl>
                    <Input placeholder="اختبار عن تاريخ الأندلس" {...field} />
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
                    <Input placeholder="التاريخ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الأسئلة</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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