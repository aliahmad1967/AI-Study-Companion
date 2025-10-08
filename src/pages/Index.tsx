import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          رفيق الدراسة بالذكاء الاصطناعي
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          ادرس بذكاء أكبر، وليس بجهد أكبر. قم بتحميل موادك الدراسية ودع الذكاء الاصطناعي يلخصها، ينشئ بطاقات تعليمية، واختبارات لك.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/upload">ابدأ الآن</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/help">تعلم المزيد</Link>
          </Button>
        </div>
      </div>
      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;