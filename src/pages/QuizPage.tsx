import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_QUIZZES } from '@/lib/notion';
import { NotionQuizPage } from '@/types/notion';

// Function to fetch quizzes from Notion
const fetchQuizzes = async (): Promise<NotionQuizPage[]> => {
  if (!NOTION_DATABASE_ID_QUIZZES) {
    toast.error("معرف قاعدة بيانات Notion للاختبارات غير موجود. يرجى التحقق من ملف .env.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_QUIZZES,
      sorts: [
        {
          property: "Created At", // Assuming a 'Created At' property for sorting
          direction: "descending",
        },
      ],
    });

    return response.results as NotionQuizPage[];
  } catch (error) {
    console.error("Failed to fetch quizzes from Notion:", error);
    toast.error("فشل تحميل الاختبارات من Notion.");
    return [];
  }
};

const QuizPage = () => {
  const { data: quizzes, isLoading, refetch } = useQuery<NotionQuizPage[]>({
    queryKey: ['notionQuizzesList'],
    queryFn: fetchQuizzes,
  });

  const handleCreateNewQuiz = async () => {
    if (!NOTION_DATABASE_ID_QUIZZES) {
      toast.error("معرف قاعدة بيانات Notion للاختبارات غير موجود. يرجى التحقق من ملف .env.");
      return;
    }

    toast.loading("جاري إنشاء اختبار جديد في Notion...", { id: 'create-quiz-progress' });

    try {
      // Simulate AI generation or user input for new quiz
      await new Promise(resolve => setTimeout(resolve, 1500));

      await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID_QUIZZES,
        },
        properties: {
          // Ensure your Notion database has a 'Title' property of type 'title'
          Title: {
            title: [
              {
                text: {
                  content: `اختبار جديد ${quizzes ? quizzes.length + 1 : 1}`,
                },
              },
            ],
          },
          // Ensure your Notion database has a 'Topic' property of type 'select'
          Topic: {
            select: {
              name: "عام", // Default topic, user can change in Notion
            },
          },
          // Ensure your Notion database has a 'Number of Questions' property of type 'number'
          "Number of Questions": {
            number: 10, // Default number of questions
          },
          // Assuming a 'Created At' property of type 'date'
          "Created At": {
            date: {
              start: new Date().toISOString().split('T')[0], // Current date
            },
          },
        },
      });

      toast.success("تم إنشاء اختبار جديد بنجاح في Notion!", { id: 'create-quiz-progress' });
      refetch(); // Refetch quizzes to include the new one
    } catch (error) {
      console.error("Failed to create quiz in Notion:", error);
      toast.error("فشل إنشاء اختبار جديد. يرجى المحاولة مرة أخرى.", { id: 'create-quiz-progress' });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">الاختبارات</h1>
        <p>جاري تحميل الاختبارات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">الاختبارات</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>اختبر معلوماتك</CardTitle>
          <CardDescription>
            اختر موضوعًا لبدء اختبار جديد تم إنشاؤه بواسطة الذكاء الاصطناعي.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Button key={quiz.id} className="w-full">
                  اختبار عن: {quiz.properties.Title.title[0]?.text.content}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground">لا توجد اختبارات متاحة. أنشئ واحدًا!</p>
            )}
            <Button className="w-full" variant="outline" onClick={handleCreateNewQuiz}>
              إنشاء اختبار جديد
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;