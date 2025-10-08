import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_UPLOADS, NOTION_DATABASE_ID_FLASHCARDS, NOTION_DATABASE_ID_QUIZZES } from '@/lib/notion';

// --- AI Simulation Functions ---
const simulateAISummary = (fileName: string): string => {
  return `ملخص تم إنشاؤه بواسطة الذكاء الاصطناعي لـ "${fileName}": هذا الملف يتناول مواضيع متعددة مثل [الموضوع 1]، [الموضوع 2]، و[الموضوع 3]. النقاط الرئيسية تشمل [نقطة رئيسية 1] و [نقطة رئيسية 2].`;
};

interface SimulatedFlashcard {
  question: string;
  answer: string;
  topic: string;
}

const simulateAIGenerateFlashcards = (fileName: string): SimulatedFlashcard[] => {
  return [
    { question: `ما هو الموضوع الرئيسي في ${fileName}؟`, answer: "الموضوع الرئيسي هو [الموضوع 1].", topic: "عام" },
    { question: `اذكر نقطة رئيسية من ${fileName}.`, answer: "نقطة رئيسية هي [نقطة رئيسية 2].", topic: "عام" },
  ];
};

interface SimulatedQuiz {
  title: string;
  topic: string;
  numberOfQuestions: number;
}

const simulateAIGenerateQuizzes = (fileName: string): SimulatedQuiz[] => {
  return [
    { title: `اختبار قصير عن ${fileName}`, topic: "عام", numberOfQuestions: 5 },
  ];
};
// --- End AI Simulation Functions ---

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadToNotion = async () => {
    if (!selectedFile) {
      toast.error("الرجاء تحديد ملف للرفع.");
      return;
    }
    if (!NOTION_DATABASE_ID_UPLOADS || !NOTION_DATABASE_ID_FLASHCARDS || !NOTION_DATABASE_ID_QUIZZES) {
      toast.error("معرفات قواعد بيانات Notion (للرفع، البطاقات، الاختبارات) غير موجودة. يرجى التحقق من ملف .env.");
      return;
    }

    setLoading(true);
    toast.loading("جاري رفع وتحليل الملف...", { id: 'upload-progress' });

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Create a new page in Notion for the uploaded file (initial entry)
      const uploadPageResponse = await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID_UPLOADS,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: selectedFile.name,
                },
              },
            ],
          },
          Status: {
            select: {
              name: "Uploaded",
            },
          },
          Summary: {
            rich_text: [
              {
                text: {
                  content: "جاري إنشاء الملخص بواسطة الذكاء الاصطناعي...",
                },
              },
            ],
          },
          "File URL": {
            url: "https://example.com/placeholder-file-url", // Placeholder URL
          },
        },
      });

      const uploadedPageId = uploadPageResponse.id;
      toast.loading("جاري تحليل المحتوى وإنشاء الملخص...", { id: 'upload-progress' });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time

      // 2. Simulate AI summary generation and update the Notion page
      const generatedSummary = simulateAISummary(selectedFile.name);
      await notion.pages.update({
        page_id: uploadedPageId,
        properties: {
          Status: {
            select: {
              name: "Summarized",
            },
          },
          Summary: {
            rich_text: [
              {
                text: {
                  content: generatedSummary,
                },
              },
            ],
          },
        },
      });
      toast.success("تم إنشاء الملخص بنجاح!", { id: 'upload-progress' });

      // 3. Simulate AI flashcard generation and create Notion entries
      toast.loading("جاري إنشاء البطاقات التعليمية...", { id: 'flashcard-progress' });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing time
      const generatedFlashcards = simulateAIGenerateFlashcards(selectedFile.name);
      for (const flashcard of generatedFlashcards) {
        await notion.pages.create({
          parent: {
            database_id: NOTION_DATABASE_ID_FLASHCARDS,
          },
          properties: {
            Question: { title: [{ text: { content: flashcard.question } }] },
            Answer: { rich_text: [{ text: { content: flashcard.answer } }] },
            Topic: { select: { name: flashcard.topic } },
          },
        });
      }
      toast.success("تم إنشاء البطاقات التعليمية بنجاح!", { id: 'flashcard-progress' });

      // 4. Simulate AI quiz generation and create Notion entries
      toast.loading("جاري إنشاء الاختبارات...", { id: 'quiz-progress' });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing time
      const generatedQuizzes = simulateAIGenerateQuizzes(selectedFile.name);
      for (const quiz of generatedQuizzes) {
        await notion.pages.create({
          parent: {
            database_id: NOTION_DATABASE_ID_QUIZZES,
          },
          properties: {
            Title: { title: [{ text: { content: quiz.title } }] },
            Topic: { select: { name: quiz.topic } },
            "Number of Questions": { number: quiz.numberOfQuestions },
          },
        });
      }
      toast.success("تم إنشاء الاختبارات بنجاح!", { id: 'quiz-progress' });

      toast.success("اكتملت عملية الرفع والتحليل بنجاح!", { id: 'upload-progress' });
      setSelectedFile(null); // Clear selected file after successful upload
    } catch (error) {
      console.error("Failed to process upload:", error);
      toast.error("فشل في معالجة الملف. يرجى المحاولة مرة أخرى.", { id: 'upload-progress' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">رفع المحتوى الدراسي</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>ارفع ملفاتك الدراسية</CardTitle>
          <CardDescription>
            يمكنك رفع ملفات PDF، Word، أو صور لتحليلها بواسطة الذكاء الاصطناعي.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg mb-4">
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">اسحب وأفلت ملفاتك هنا أو</p>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" disabled={loading}>تصفح الملفات</Button>
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-muted-foreground">
                الملف المحدد: {selectedFile.name}
              </p>
            )}
          </div>
          <Button className="w-full" onClick={handleUploadToNotion} disabled={loading || !selectedFile}>
            {loading ? "جاري التحليل..." : "تحليل المحتوى"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;