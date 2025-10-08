import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HelpPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">المساعدة ودليل المستخدم</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>كيف تستخدم رفيق الدراسة بالذكاء الاصطناعي؟</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <p>مرحبًا بك في رفيق الدراسة بالذكاء الاصطناعي! هذا الدليل سيساعدك على البدء:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>سجّل حسابًا جديدًا أو قم بتسجيل الدخول:</strong> ابدأ بإنشاء حساب جديد أو تسجيل الدخول إذا كان لديك حساب بالفعل للوصول إلى جميع الميزات.</li>
            <li><strong>ارفع ملف الدراسة (PDF، Word، أو صورة):</strong> انتقل إلى صفحة "رفع المحتوى" لرفع ملفاتك الدراسية. يدعم التطبيق ملفات PDF، Word، والصور.</li>
            <li><strong>سيقوم الذكاء الاصطناعي بتلخيص المحتوى:</strong> بعد الرفع، سيقوم الذكاء الاصطناعي بتحليل محتواك وإنشاء ملخصات ونقاط رئيسية تلقائيًا.</li>
            <li><strong>أنشئ بطاقات مراجعة واختبر نفسك:</strong> استخدم الملخصات لإنشاء بطاقات تعليمية واختبارات تفاعلية لمراجعة المواد بفعالية.</li>
            <li><strong>راقب تقدمك في لوحة الإحصاءات:</strong> تتبع أدائك وتقدمك الدراسي من خلال لوحة التحكم التي تعرض إحصائيات مفصلة.</li>
            <li><strong>حمّل الملخص كـ PDF أو شاركه مع زملائك:</strong> يمكنك تصدير الملخصات والبطاقات التعليمية كملفات PDF أو مشاركتها بسهولة مع أصدقائك.</li>
          </ol>
          <p className="mt-6">إذا كان لديك أي أسئلة أخرى، فلا تتردد في التواصل معنا.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;