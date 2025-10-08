import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QuizPage = () => {
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
            <Button className="w-full">اختبار عن: تاريخ الأندلس</Button>
            <Button className="w-full">اختبار عن: أساسيات البرمجة</Button>
            <Button className="w-full" variant="outline">إنشاء اختبار جديد</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;