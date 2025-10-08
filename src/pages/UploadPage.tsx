import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_UPLOADS } from '@/lib/notion';

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
    if (!NOTION_DATABASE_ID_UPLOADS) {
      toast.error("معرف قاعدة بيانات Notion للرفع غير موجود. يرجى التحقق من ملف .env.");
      return;
    }

    setLoading(true);
    toast.loading("جاري رفع وتحليل الملف...", { id: 'upload-progress' });

    try {
      // Simulate file upload and AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a new page in Notion for the uploaded file
      await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID_UPLOADS,
        },
        properties: {
          // Ensure your Notion database has a 'Name' property of type 'title'
          Name: {
            title: [
              {
                text: {
                  content: selectedFile.name,
                },
              },
            ],
          },
          // Ensure your Notion database has a 'Status' property of type 'select'
          Status: {
            select: {
              name: "Uploaded", // You might change this to "Processing" or "Completed" later
            },
          },
          // Ensure your Notion database has a 'Summary' property of type 'rich_text'
          Summary: {
            rich_text: [
              {
                text: {
                  content: "ملخص مبدئي: سيتم إنشاء الملخص بواسطة الذكاء الاصطناعي قريباً.",
                },
              },
            ],
          },
          // Ensure your Notion database has a 'File URL' property of type 'url'
          "File URL": {
            url: "https://example.com/placeholder-file-url", // Placeholder URL
          },
        },
      });

      toast.success("تم رفع الملف بنجاح وإنشاء إدخال في Notion!", { id: 'upload-progress' });
      setSelectedFile(null); // Clear selected file after successful upload
    } catch (error) {
      console.error("Failed to upload to Notion:", error);
      toast.error("فشل رفع الملف إلى Notion. يرجى المحاولة مرة أخرى.", { id: 'upload-progress' });
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