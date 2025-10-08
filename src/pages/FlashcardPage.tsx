import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_FLASHCARDS } from '@/lib/notion';
import { NotionFlashcardPage } from '@/types/notion';

// Mock data fetching function for Flashcards
const fetchFlashcards = async (): Promise<NotionFlashcardPage[]> => {
  // Simulate API call to Notion
  await new Promise(resolve => setTimeout(resolve, 700));
  // In a real scenario, you would query NOTION_DATABASE_ID_FLASHCARDS
  // For now, return mock data
  return [
    {
      id: '1',
      properties: {
        Question: { title: [{ text: { content: "ما هي عاصمة مصر؟" } }] },
        Answer: { rich_text: [{ text: { content: "القاهرة" } }] },
        Topic: { select: { id: '1', name: 'جغرافيا', color: 'blue' } },
        "Last Reviewed": { date: null },
      },
    },
    {
      id: '2',
      properties: {
        Question: { title: [{ text: { content: "من هو مؤلف رواية 'الحرب والسلام'؟" } }] },
        Answer: { rich_text: [{ text: { content: "ليو تولستوي" } }] },
        Topic: { select: { id: '2', name: 'أدب', color: 'green' } },
        "Last Reviewed": { date: null },
      },
    },
    {
      id: '3',
      properties: {
        Question: { title: [{ text: { content: "ما هو العنصر الكيميائي الذي رمزه O؟" } }] },
        Answer: { rich_text: [{ text: { content: "الأكسجين" } }] },
        Topic: { select: { id: '3', name: 'علوم', color: 'red' } },
        "Last Reviewed": { date: null },
      },
    },
  ];
};

const FlashcardPage = () => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const { data: flashcards, isLoading, refetch } = useQuery<NotionFlashcardPage[]>({
    queryKey: ['notionFlashcardsList'],
    queryFn: fetchFlashcards,
  });

  const currentFlashcard = flashcards?.[currentIndex];

  const handleNextFlashcard = () => {
    if (flashcards && currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else if (flashcards && flashcards.length > 0) {
      setCurrentIndex(0); // Loop back to the first card
      setIsFlipped(false);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    } else if (flashcards && flashcards.length > 0) {
      setCurrentIndex(flashcards.length - 1); // Loop to the last card
      setIsFlipped(false);
    }
  };

  const handleCreateNewFlashcard = async () => {
    if (!NOTION_DATABASE_ID_FLASHCARDS) {
      toast.error("معرف قاعدة بيانات Notion للبطاقات التعليمية غير موجود. يرجى التحقق من ملف .env.");
      return;
    }

    toast.loading("جاري إنشاء بطاقة تعليمية جديدة في Notion...", { id: 'create-flashcard-progress' });

    try {
      // Simulate AI generation or user input for new flashcard
      await new Promise(resolve => setTimeout(resolve, 1500));

      await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID_FLASHCARDS,
        },
        properties: {
          // Ensure your Notion database has a 'Question' property of type 'title'
          Question: {
            title: [
              {
                text: {
                  content: `سؤال جديد ${flashcards ? flashcards.length + 1 : 1}`,
                },
              },
            ],
          },
          // Ensure your Notion database has an 'Answer' property of type 'rich_text'
          Answer: {
            rich_text: [
              {
                text: {
                  content: "هذه إجابة لبطاقة تعليمية جديدة تم إنشاؤها.",
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
        },
      });

      toast.success("تم إنشاء بطاقة تعليمية جديدة بنجاح في Notion!", { id: 'create-flashcard-progress' });
      refetch(); // Refetch flashcards to include the new one
    } catch (error) {
      console.error("Failed to create flashcard in Notion:", error);
      toast.error("فشل إنشاء بطاقة تعليمية جديدة. يرجى المحاولة مرة أخرى.", { id: 'create-flashcard-progress' });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">البطاقات التعليمية</h1>
        <p>جاري تحميل البطاقات التعليمية...</p>
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">البطاقات التعليمية</h1>
        <p className="text-lg text-muted-foreground mb-4">لا توجد بطاقات تعليمية متاحة. ابدأ بإنشاء واحدة!</p>
        <Button onClick={handleCreateNewFlashcard}>إنشاء مجموعة بطاقات جديدة</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">البطاقات التعليمية</h1>
      <Card className="max-w-md mx-auto h-64 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>بطاقة تعليمية ({currentIndex + 1} من {flashcards.length})</CardTitle>
          <CardDescription>
            انقر على البطاقة لقلبها.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div
            className="text-2xl font-semibold cursor-pointer p-4 w-full h-full flex items-center justify-center"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {isFlipped ? currentFlashcard?.properties.Answer.rich_text[0]?.text.content : currentFlashcard?.properties.Question.title[0]?.text.content}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center gap-4 mt-6">
        <Button variant="outline" onClick={handlePreviousFlashcard}>
          <ArrowRight className="h-4 w-4 ml-2" />
          البطاقة السابقة
        </Button>
        <Button variant="outline" onClick={handleNextFlashcard}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          البطاقة التالية
        </Button>
      </div>
      <Button className="mt-4" onClick={handleCreateNewFlashcard}>إنشاء مجموعة بطاقات جديدة</Button>
    </div>
  );
};

export default FlashcardPage;