import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const summaryData = [
  { name: 'يناير', summaries: 4 },
  { name: 'فبراير', summaries: 3 },
  { name: 'مارس', summaries: 5 },
  { name: 'أبريل', summaries: 7 },
  { name: 'مايو', summaries: 6 },
];

const quizData = [
  { name: 'تاريخ', quizzes: 8 },
  { name: 'علوم', quizzes: 5 },
  { name: 'رياضيات', quizzes: 7 },
  { name: 'لغة عربية', quizzes: 6 },
];

const flashcardData = [
  { name: 'تم إنشاؤها', value: 50, color: '#8884d8' },
  { name: 'تم مراجعتها', value: 30, color: '#82ca9d' },
];

const Dashboard = () => {
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="summaries" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الاختبارات المكتملة</CardTitle>
            <CardDescription>توزيع الاختبارات حسب الموضوع.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={quizData}
                  dataKey="quizzes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {quizData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>البطاقات التعليمية</CardTitle>
            <CardDescription>إحصائيات البطاقات التعليمية.</CardDescription>
          </CardHeader>
          <CardContent>
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
                  {flashcardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;