import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'; // Added CheckCircle icon
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_FLASHCARDS } from '@/lib/notion';
import { NotionFlashcardPage } from '@/types/notion';
import { CreateFlashcardDialog } from '@/components/CreateFlashcardDialog';

// Function to fetch flashcards from Notion
const fetchFlashcards = async (): Promise<NotionFlashcardPage[]> => {
  if (!NOTION_DATABASE_ID_FLASHCARDS) {
    toast.error("معرف قاعدة بيانات Notion للبطاقات التعليمية غير موجود. يرجى التحقق من ملف .env.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_FLASHCARDS,
      sorts: [
        {
          property: "Created At", // Assuming a 'Created At' property for sorting
          direction: "descending",
        },
      ],
    });

    return response.results as NotionFlashcardPage[];
  } catch (error) {
    console.error("Failed to fetch flashcards from Notion:", error);
    toast.error("فشل تحميل البطاقات التعليمية من Notion.");
    return [];
  }
};

const FlashcardPage = () => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

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

  const handleFlashcardCreated = () => {
    refetch(); // Refetch flashcards to include the new one
    setCurrentIndex(0); // Go to the first card (likely the new one if sorted by creation date)
    setIsFlipped(false);
  };

  const handleMarkAsReviewed = async () => {
    if (!currentFlashcard) {
      toast.error("لا توجد بطاقة تعليمية للمراجعة.");
      return;
    }

    toast.loading("جاري تحديث البطاقة التعليمية...", { id: 'review-flashcard-progress' });

    try {
      await notion.pages.update({
        page_id: currentFlashcard.id,
        properties: {
          "Last Reviewed": {
            date: {
              start: new Date().toISOString().split('T')[0], // Set current date as last reviewed
            },
          },
        },
      });
      toast.success("تم وضع علامة 'تمت المراجعة' على البطاقة التعليمية بنجاح!", { id: 'review-flashcard-progress' });
      refetch(); // Refetch to update the data, especially for dashboard stats
    } catch (error) {
      console.error("Failed to mark flashcard as reviewed:", error);
      toast.error("فشل وضع علامة 'تمت المراجعة'. يرجى المحاولة مرة أخرى.", { id: 'review-flashcard-progress' });
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

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">البطاقات التعليمية</h1>
      {flashcards && flashcards.length > 0 ? (
        <>
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
            <Button onClick={handleMarkAsReviewed} disabled={!currentFlashcard}>
              <CheckCircle className="h-4 w-4 ml-2" />
              تمت المراجعة
            </Button>
          </div>
        </>
      ) : (
        <p className="text-lg text-muted-foreground mb-4">لا توجد بطاقات تعليمية متاحة. ابدأ بإنشاء واحدة!</p>
      )}
      <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>إنشاء بطاقة تعليمية جديدة</Button>

      <CreateFlashcardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onFlashcardCreated={handleFlashcardCreated}
      />
    </div>
  );
};

export default FlashcardPage;