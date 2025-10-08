import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_QUIZZES } from '@/lib/notion';
import { NotionQuizPage } from '@/types/notion';
import { CreateQuizDialog } from '@/components/CreateQuizDialog';
import { Link } from 'react-router-dom'; // Import Link

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const { data: quizzes, isLoading, refetch } = useQuery<NotionQuizPage[]>({
    queryKey: ['notionQuizzesList'],
    queryFn: fetchQuizzes,
  });

  const handleQuizCreated = () => {
    refetch(); // Refetch quizzes to include the new one
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
                <Button key={quiz.id} className="w-full" asChild>
                  <Link to={`/quizzes/${quiz.id}`}>
                    اختبار عن: {quiz.properties.Title.title[0]?.text.content} ({quiz.properties["Number of Questions"]?.number || 0} أسئلة)
                  </Link>
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground">لا توجد اختبارات متاحة. أنشئ واحدًا!</p>
            )}
            <Button className="w-full" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
              إنشاء اختبار جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreateQuizDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onQuizCreated={handleQuizCreated}
      />
    </div>
  );
};

export default QuizPage;