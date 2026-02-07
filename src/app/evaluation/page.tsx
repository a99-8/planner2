"use client";

import { useCSVHandler } from "@/hooks/useCSVHandler";
import { NoData } from "@/components/other/noData";
import { FinalSummaryTable } from "@/components/element/evaluationTable";

export default function EvaluationPage() {
  const { data, isMounted } = useCSVHandler("main_dashboard");

  if (!isMounted) {
    return <div className="p-6">جاري مزامنة البيانات...</div>;
  }

  if (data.length === 0) return <NoData />;

  return <FinalSummaryTable data={data} />;
}
