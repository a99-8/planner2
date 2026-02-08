"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { exportFullReportToExcel } from "@/logic/exportFullReportToExcel";

interface ExportToExcelProps {
  snapshot: any;
  data: any[];
  loading: boolean;
  selectedColumns: string[];
  rowIds: number[];
}

export function ExportToExcel({
  snapshot,
  data,
  loading,
  selectedColumns,
  rowIds,
}: ExportToExcelProps) {
  const handleExport = async () => {
    await exportFullReportToExcel({
      snapshot,
      data,
      selectedColumns,
      rowIds,
    });
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading || snapshot.rows.length === 0}
      variant="outline"
      className="gap-2 border-green-600 text-green-600 hover:bg-green-700 hover:text-white transition-all font-bold"
    >
      <FileSpreadsheet className="w-4 h-4" />
      تصدير إالى Excel
    </Button>
  );
}
