import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notion, NOTION_DATABASE_ID_UPLOADS } from '@/lib/notion';
import { NotionUploadPage } from '@/types/notion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

// Function to fetch uploaded summaries from Notion
const fetchSummaries = async (): Promise<NotionUploadPage[]> => {
  if (!NOTION_DATABASE_ID_UPLOADS) {
    toast.error("معرف قاعدة بيانات Notion للرفع غير موجود. يرجى التحقق من ملف .env.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_UPLOADS,
      filter: {
        property: "Status",
        select: {
          equals: "Summarized", // Only fetch documents that have been summarized
        },
      },
      sorts: [
        {
          property: "Created At",
          direction: "descending",
        },
      ],
    });

    return response.results as NotionUploadPage[];
  } catch (error) {
    console.error("Failed to fetch summaries from Notion:", error);
    toast.error("فشل تحميل الملخصات من Notion.");
    return [];
  }
};

const SummariesPage = () => {
  const { data: summaries, isLoading } = useQuery<NotionUploadPage[]>({
    queryKey: ['notionSummariesList'],
    queryFn: fetchSummaries,
  });

  const handleDownloadPdf = (summaryTitle: string, summaryContent: string) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set font for Arabic characters
    // You might need to embed a font that supports Arabic if the default doesn't work well.
    // For simplicity, we'll use a basic font here, but for production, consider 'Amiri' or 'Noto Sans Arabic'.
    // doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal'); // Requires font file to be loaded
    // doc.setFont('Amiri');

    doc.setR2L(true); // Set right-to-left for Arabic text

    let yOffset = 10;
    const margin = 10;
    const maxWidth = doc.internal.pageSize.width - 2 * margin;

    doc.setFontSize(18);
    doc.text(summaryTitle, doc.internal.pageSize.width / 2, yOffset, { align: 'center' });
    yOffset += 10;

    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(summaryContent, maxWidth);
    doc.text(splitText, margin, yOffset);
    yOffset += (splitText.length * 7); // Estimate line height

    doc.save(`${summaryTitle}.pdf`);
    toast.success("تم تنزيل الملخص كملف PDF.");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">الملخصات</h1>
        <p>جاري تحميل الملخصات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">الملخصات</h1>
      <p className="text-lg text-muted-foreground mb-8">
        تصفح ملخصاتك التي تم إنشاؤها بواسطة الذكاء الاصطناعي وقم بتنزيلها.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {summaries && summaries.length > 0 ? (
          summaries.map((summary) => {
            const title = summary.properties.Name.title[0]?.text.content || "ملخص بدون عنوان";
            const content = summary.properties.Summary.rich_text[0]?.text.content || "لا يوجد محتوى ملخص.";
            const createdAt = summary.properties["Created At"]?.date?.start ? new Date(summary.properties["Created At"].date.start).toLocaleDateString('ar-EG') : "تاريخ غير معروف";

            return (
              <Card key={summary.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>تم الإنشاء في: {createdAt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground text-right line-clamp-4">
                    {content}
                  </p>
                </CardContent>
                <div className="p-4 border-t flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPdf(title, content)}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    تنزيل PDF
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <p className="col-span-full text-muted-foreground">لا توجد ملخصات متاحة بعد. ارفع ملفًا لإنشاء واحد!</p>
        )}
      </div>
    </div>
  );
};

export default SummariesPage;