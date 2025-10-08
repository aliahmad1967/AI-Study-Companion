import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_QUIZZES } from '@/lib/notion';
import { NotionQuizPage } from '@/types/notion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

// Function to fetch a single quiz by ID from Notion
const fetchQuizById = async (quizId: string): Promise<NotionQuizPage | null> => {
  if (!NOTION_DATABASE_ID_QUIZZES) {
    toast.error("معرف قاعدة بيانات Notion للاختبارات غير موجود. يرجى التحقق من ملف .env.");
    return null;
  }

  try {
    const response = await notion.pages.retrieve({ page_id: quizId });
    // Notion API returns a generic PageObjectResponse, need to cast and check properties
    const quizPage = response as unknown as NotionQuizPage;

    // Basic validation to ensure it's a quiz page
    if (quizPage.properties && 'Title' in quizPage.properties && 'QuestionsContent' in quizPage.properties) {
      return quizPage;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch quiz with ID ${quizId} from Notion:`, error);
    toast.error("فشل تحميل تفاصيل الاختبار من Notion.");
    return null;
  }
};

const QuizDetailPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const { data: quiz, isLoading, isError } = useQuery<NotionQuizPage | null>({
    queryKey: ['notionQuiz', quizId],
    queryFn: () => (quizId ? fetchQuizById(quizId) : Promise.resolve(null)),
    enabled: !!quizId, // Only run query if quizId is available
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">تفاصيل الاختبار</h1>
        <p>جاري تحميل تفاصيل الاختبار...</p>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">تفاصيل الاختبار</h1>
        <p className="text-lg text-destructive">عذرًا، لم يتم العثور على الاختبار أو حدث خطأ.</p>
        <Button asChild className="mt-4">
          <Link to="/quizzes">
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة إلى الاختبارات
          </Link>
        </Button>
      </div>
    );
  }

  const title = quiz.properties.Title.title[0]?.text.content || "اختبار بدون عنوان";
  const topic = quiz.properties.Topic?.select?.name || "عام";
  const numberOfQuestions = quiz.properties["Number of Questions"]?.number || 0;
  const questionsContent = quiz.properties.QuestionsContent?.rich_text[0]?.text.content || "لا توجد أسئلة متاحة.";

  let questions: any[] = [];
  try {
    questions = JSON.parse(questionsContent);
  } catch (e) {
    console.error("Failed to parse questions content:", e);
    questions = [{ question: "فشل تحميل الأسئلة.", options: [], correctAnswer: "" }];
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">تفاصيل الاختبار: {title}</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            الموضوع: {topic} | عدد الأسئلة: {numberOfQuestions}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <h2 className="text-2xl font-semibold mb-4">الأسئلة:</h2>
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={index} className="mb-4 p-3 border rounded-md bg-muted/50">
                <p className="font-medium text-lg mb-2">
                  {index + 1}. {q.question}
                </p>
                {q.options && q.options.length > 0 && (
                  <ul className="list-disc list-inside mr-4 text-muted-foreground">
                    {q.options.map((option: string, optIndex: number) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                )}
                <p className="text-sm text-green-600 mt-2">
                  الإجابة الصحيحة: {q.correctAnswer}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">لا توجد أسئلة لعرضها.</p>
          )}
          <Button asChild className="mt-6">
            <Link to="/quizzes">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة إلى الاختبارات
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizDetailPage;