import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { notion, NOTION_DATABASE_ID_UPLOADS, NOTION_DATABASE_ID_FLASHCARDS, NOTION_DATABASE_ID_QUIZZES } from '@/lib/notion';
import { NotionUploadPage, NotionFlashcardPage, NotionQuizPage } from '@/types/notion';
import { toast } from 'sonner';

// Function to fetch and process uploads count for the bar chart
const fetchUploadsCount = async () => {
  if (!NOTION_DATABASE_ID_UPLOADS) {
    toast.error("معرف قاعدة بيانات Notion للرفع غير موجود. يرجى التحقق من ملف .env.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_UPLOADS,
      filter: {
        property: "Created At", // Assuming a 'Created At' date property
        date: {
          is_not_empty: true,
        },
      },
    });

    const uploads = response.results as NotionUploadPage[];
    const monthlyCounts: { [key: string]: number } = {};
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    uploads.forEach(upload => {
      const dateStr = upload.properties["Created At"]?.date?.start;
      if (dateStr) {
        const date = new Date(dateStr);
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];
        monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
      }
    });

    // Sort by month order for consistent chart display
    const sortedData = monthNames
      .map(name => ({ name, summaries: monthlyCounts[name] || 0 }))
      .filter(item => item.summaries > 0); // Only show months with data

    return sortedData;
  } catch (error) {
    console.error("Failed to fetch uploads from Notion:", error);
    toast.error("فشل تحميل بيانات الملخصات من Notion.");
    return [];
  }
};

// Function to fetch and process quizzes data for the pie chart
const fetchQuizzesData = async () => {
  if (!NOTION_DATABASE_ID_QUIZZES) {
    toast.error("معرف قاعدة بيانات Notion للاختبارات غير موجود. يرجى التحقق من ملف .env.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_QUIZZES,
      filter: {
        property: "Topic", // Assuming a 'Topic' select property
        select: {
          is_not_empty: true,
        },
      },
    });

    const quizzes = response.results as NotionQuizPage[];
    const topicCounts: { [key: string]: number } = {};

    quizzes.forEach(quiz => {
      const topicName = quiz.properties.Topic?.select?.name;
      if (topicName) {
        topicCounts[topicName] = (topicCounts[topicName] || 0) + 1;
      }
    });

    return Object.keys(topicCounts).map(topic => ({
      name: topic,
      quizzes: topicCounts[topic],
    }));
  } catch (error) {
    console.error("Failed to fetch quizzes from Notion:", error);
    toast.error("فشل تحميل بيانات الاختبارات من Notion.");
    return [];
  }
};

// Function to fetch and process flashcards data for the pie chart
const fetchFlashcardsData = async () => {
  if (!NOTION_DATABASE_ID_FLASHCARDS) {
    toast.error("معرف قاعدة بيانات Notion للبطاقات التعليمية غير موجود. يرجى التحقق من ملف .env.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_FLASHCARDS,
    });

    const flashcards = response.results as NotionFlashcardPage[];
    const totalFlashcards = flashcards.length;
    const reviewedFlashcards = flashcards.filter(card => card.properties["Last Reviewed"]?.date?.start).length;

    return [
      { name: 'تم إنشاؤها', value: totalFlashcards, color: '#8884d8' },
      { name: 'تم مراجعتها', value: reviewedFlashcards, color: '#82ca9d' },
    ];
  } catch (error) {
    console.error("Failed to fetch flashcards from Notion:", error);
    toast.error("فشل تحميل بيانات البطاقات التعليمية من Notion.");
    return [];
  }
};

const Dashboard = () => {
  const { data: summaryData, isLoading: isLoadingSummaries } = useQuery({
    queryKey: ['notionUploads'],
    queryFn: fetchUploadsCount,
  });

  const { data: quizData, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['notionQuizzes'],
    queryFn: fetchQuizzesData,
  });

  const { data: flashcardData, isLoading: isLoadingFlashcards } = useQuery({
    queryKey: ['notionFlashcards'],
    queryFn: fetchFlashcardsData,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF'];

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      <p className="text-lg text-muted-foreground">
        هنا ستظهر إحصائياتك وتقدمك الدراسي.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>الملخصات المنشأة</CardTitle>
            <CardDescription>عدد الملخصات التي أنشأتها شهريًا.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSummaries ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">جاري التحميل...</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="summaries" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الاختبارات المكتملة</CardTitle>
            <CardDescription>توزيع الاختبارات حسب الموضوع.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingQuizzes ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">جاري التحميل...</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={quizData}
                    dataKey="quizzes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {quizData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>البطاقات التعليمية</CardTitle>
            <CardDescription>إحصائيات البطاقات التعليمية.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFlashcards ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">جاري التحميل...</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={flashcardData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {flashcardData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;