"use client";

import { useCSVHandler } from "@/hooks/useCSVHandler";
import { SettlementsTables } from "@/components/element/matrixTables";

export default function MatrixPage() {
  const { data, isMounted } = useCSVHandler("main_dashboard");

  if (!isMounted) {
    return <div className="p-6">جاري مزامنة البيانات...</div>;
  }

  return <SettlementsTables data={data} />;
}
