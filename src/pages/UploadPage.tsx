import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from 'lucide-react';

const UploadPage = () => {
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
            <Input id="file-upload" type="file" className="hidden" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline">تصفح الملفات</Button>
            </label>
          </div>
          <Button className="w-full">تحليل المحتوى</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;