"use client";

import ControlButtons from "@/components/custom/controlButtons";
import { useProjects } from "@/hooks/useProjectMain";
import { GlobalControlButtons } from "@/lib";

export default function ProjectListIHaeder() {
  const { handleAction } = useProjects();

  return (
    <div
      className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500"
      dir="rtl"
    >
      <div id="labels" className="border-b pb-6">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          إدارة مشاريع تقييم المخططات
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          نظام إدارة البيانات المحلي. يمكنك إنشاء، تعديل، أو حذف المشاريع
          المحفوظة في قاعدة بيانات المتصفح.
        </p>
      </div>

      {/* Global Controls */}
      <div
        id="globalButtons"
        className="flex gap-4 flex-wrap bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-300 backdrop-blur-sm"
      >
        {GlobalControlButtons.map((btn) => (
          <ControlButtons
            key={btn.id}
            {...btn}
            onClick={(val?: string) => handleAction(btn.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
