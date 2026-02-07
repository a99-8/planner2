"use client";

import { useCSVHandler } from "@/hooks/useCSVHandler";
import { SettlementsTables } from "@/components/element/matrixTables";
import { NoData } from "@/components/other/noData";

export default function MatrixPage() {
  const { data, isMounted } = useCSVHandler("main_dashboard");

  if (!isMounted) {
    return <div className="p-6">جاري مزامنة البيانات...</div>;
  }

  if (data.length === 0) return <NoData />;

  return <SettlementsTables data={data} />;
}
