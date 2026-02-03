"use client";

import { useCSVHandler } from "@/hooks/useCSVHandler";
import { SettlementsPopover } from "@/components/settlementsPopover";

export default function ComparisonPage() {
  const { data, fileName, isMounted } = useCSVHandler("main_dashboard");

  if (!isMounted) {
    return <div className="p-6">جاري مزامنة البيانات...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{fileName}</h1>

      {data.length > 0 ? (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p>
              Quick statistics: The number of rows retrieved is :{" "}
              {data.length + 1}
            </p>
          </div>

          <div className="flex justify-center w-full">
            <SettlementsPopover data={data} />
          </div>
        </div>
      ) : (
        <p className="text-red-500">لم يتم رفع أي ملف في الصفحة الرئيسية!</p>
      )}
    </div>
  );
}
