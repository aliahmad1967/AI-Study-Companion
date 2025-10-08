import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FlashcardPage = () => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">البطاقات التعليمية</h1>
      <Card className="max-w-md mx-auto h-64 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>بطاقة تعليمية</CardTitle>
          <CardDescription>
            انقر على البطاقة لقلبها.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div
            className="text-2xl font-semibold cursor-pointer p-4 w-full h-full flex items-center justify-center"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {isFlipped ? "هذا هو الجواب!" : "ما هو السؤال؟"}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center gap-4 mt-6">
        <Button variant="outline">
          <ArrowRight className="h-4 w-4 ml-2" />
          البطاقة التالية
        </Button>
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          البطاقة السابقة
        </Button>
      </div>
      <Button className="mt-4">إنشاء مجموعة بطاقات جديدة</Button>
    </div>
  );
};

export default FlashcardPage;