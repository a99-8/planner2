import { ProjectStructure } from "@/lib";

const ProjectDetails = (project: ProjectStructure) => {
  // دالة مساعدة لتحسين مظهر اسم المفتاح (مثال: Price_avg -> السعر: المتوسط)
  const formatDisKey = (key: string) => {
    const [col, action] = key.split("_");
    const actionNames: Record<string, string> = {
      min: "الأصغر",
      max: "الأكبر",
      avg: "المتوسط",
      mid: "الوسيط",
      count: "العدد",
      total: "المجموع",
    };
    return { col, action: actionNames[action] || action };
  };

  const disEntries = Object.entries(project.control?.dis || {});

  return (
    <>
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
        <p className="text-slate-500 text-sm mt-2">
          معرف المشروع:{" "}
          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
            {project.id}
          </span>
        </p>
      </header>

      <div className="space-y-6">
        {/* تفاصيل المشروع الأساسية */}
        <div className="grid gap-6 bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold border-b pb-2 italic text-slate-700">
            تفاصيل المشروع
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 block">آخر تحديث</span>
              <span className="font-medium text-slate-800">
                {project.updatedAt
                  ? new Date(project.updatedAt).toLocaleString("ar-SA")
                  : "غير متوفر"}
              </span>
            </div>
          </div>
        </div>

        {/* قسم عرض الإحصائيات (dis) */}
        {disEntries.length > 0 && (
          <div className="grid gap-6 bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-xl font-bold border-b pb-2 text-slate-700">
              الإحصائيات المحسوبة (DIS)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {disEntries.map(([key, value]: [string, any]) => {
                const { col, action } = formatDisKey(key);
                return (
                  <div
                    key={key}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-semibold">
                        {col}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {action}
                      </span>
                    </div>
                    <div className="text-lg font-mono font-bold text-primary">
                      {typeof value === "number"
                        ? value.toLocaleString("en-US")
                        : value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetails;
