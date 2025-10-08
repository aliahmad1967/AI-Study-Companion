import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_QUIZZES } from '@/lib/notion';
import { NotionQuizPage } from '@/types/notion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from 'lucide-react';
import { QuizAttempt } from '@/components/QuizAttempt'; // Import the new component

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Function to fetch a single quiz by ID from Notion
const fetchQuizById = async (quizId: string): Promise<NotionQuizPage | null> => {
  if (!NOTION_DATABASE_ID_QUIZZES) {
    toast.error("معرف قاعدة بيانات Notion للاختبارات غير موجود. يرجى التحقق من ملف .env.");
    return null;
  }

  try {
    const response = await notion.pages.retrieve({ page_id: quizId });
    const quizPage = response as unknown as NotionQuizPage;

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
  const [isAttemptingQuiz, setIsAttemptingQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  const { data: quiz, isLoading, isError } = useQuery<NotionQuizPage | null>({
    queryKey: ['notionQuiz', quizId],
    queryFn: () => (quizId ? fetchQuizById(quizId) : Promise.resolve(null)),
    enabled: !!quizId,
  });

  const handleQuizFinished = (score: number, total: number) => {
    setQuizScore({ score, total });
    setIsAttemptingQuiz(false); // Go back to detail view, but show results
    toast.success(`لقد أكملت الاختبار! حصلت على ${score} من ${total}.`);
  };

  const handleBackToDetails = () => {
    setIsAttemptingQuiz(false);
    setQuizScore(null); // Clear score when going back to details
  };

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
  const questionsContent = quiz.properties.QuestionsContent?.rich_text[0]?.text.content || "[]";

  let questions: Question[] = [];
  try {
    questions = JSON.parse(questionsContent);
  } catch (e) {
    console.error("Failed to parse questions content:", e);
    questions = [{ question: "فشل تحميل الأسئلة.", options: [], correctAnswer: "" }];
  }

  if (isAttemptingQuiz) {
    return (
      <div className="container mx-auto p-4">
        <QuizAttempt
          quizTitle={title}
          questions={questions}
          onQuizFinished={handleQuizFinished}
          onBackToDetails={handleBackToDetails}
        />
      </div>
    );
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
          {quizScore && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md text-center">
              <p className="text-xl font-bold">نتائجك الأخيرة: {quizScore.score} من {quizScore.total}</p>
            </div>
          )}
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
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => setIsAttemptingQuiz(true)} disabled={questions.length === 0}>
              <Play className="h-4 w-4 ml-2" />
              بدء الاختبار
            </Button>
            <Button asChild variant="outline">
              <Link to="/quizzes">
                <ArrowLeft className="h-4 w-4 ml-2" />
                العودة إلى الاختبارات
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizDetailPage;