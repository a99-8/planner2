import { Loader2, FolderPlus, Database } from "lucide-react";
import { StatusHandlerProps, cn } from "@/lib";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StatusHandler = ({ type, className, message }: StatusHandlerProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center transition-all duration-300",
        className,
      )}
    >
      {type === "loading" && (
        <div className="py-12 space-y-4 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">
            {message || "جاري جلب البيانات من القرص..."}
          </p>
        </div>
      )}

      {type === "noProject" && (
        <div className="w-full py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
          <FolderPlus className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">
            {message || "لا توجد مشاريع حالياً"}
          </p>
          <p className="text-slate-400 text-xs">
            ابدأ بالضغط على "إنشاء مشروع جديد" للبدء
          </p>
        </div>
      )}

      {type === "noData" && (
        <div className="w-full py-10 border rounded-xl bg-slate-50/20 text-center space-y-2">
          <Database className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">
            {message || "لا توجد بيانات متاحة للعرض حالياً"}
          </p>
        </div>
      )}

      {type === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      {type === "projectNotFound" && (
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
            عذراً، لم نتمكن من العثور على المشروع الذي تبحث عنه. قد يكون المعرف
            غير صحيح أو تم حذف المشروع من قاعدة البيانات المحلية.
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
      )}
    </div>
  );
};

export default StatusHandler;
