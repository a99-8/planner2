import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StatusHandler = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      {/* أيقونة تعبيرية تشبه ثيمات النوافذ في Arch */}
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-2xl opacity-20 bg-primary animate-pulse"></div>
        <FileQuestion
          size={80}
          className="relative text-muted-foreground stroke-[1.5]"
        />
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        المشروع غير موجود
      </h1>

      <p className="text-muted-foreground max-w-md mb-8" dir="rtl">
        عذراً، لم نتمكن من العثور على المشروع الذي تبحث عنه. قد يكون المعرف غير
        صحيح أو تم حذف المشروع من قاعدة البيانات المحلية.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" className="gap-2">
          <Link href="/">
            <Home size={18} />
            العودة للرئيسية
          </Link>
        </Button>
      </div>

      {/* لمسة تقنية للمطورين */}
      <div className="mt-12 p-4 border rounded-lg bg-muted/30 border-dashed">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Error Code: 404_PROJECT_NOT_FOUND_DB
        </p>
      </div>
    </div>
  );
};

export default StatusHandler;
