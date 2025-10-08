import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      <p className="text-lg text-muted-foreground">
        هنا ستظهر إحصائياتك وتقدمك الدراسي.
      </p>
      {/* Placeholder for charts and stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">الملخصات المنشأة</h2>
          <p className="text-3xl font-bold text-primary">5</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">الاختبارات المكتملة</h2>
          <p className="text-3xl font-bold text-primary">12</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">البطاقات التعليمية</h2>
          <p className="text-3xl font-bold text-primary">50</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;