import { Loader2, FolderPlus, Database } from "lucide-react";
import { cn } from "@/lib/index";

export interface StatusHandlerProps {
  type: "loading" | "noProject" | "noData" | "error";
  className?: string;
  message?: string;
}

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
    </div>
  );
};

export default StatusHandler;
