"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { storage } from "@/logic/storageHandler";
import { prossHeaders } from "@/logic/settlementsHeaders";

interface ExportToExcelProps {
  snapshot: any; // النتائج من useEvaluation
  data: any[]; // بيانات الـ CSV الأصلية
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
  const generateExport = async () => {
    const workbook = XLSX.utils.book_new();

    // --- 1. صفحة الخلاصة النهائية ---
    if (snapshot.rows.length > 0) {
      const summaryData = snapshot.rows.map((row: any, index: number) => {
        const flatRow: any = { م: index + 1 };
        snapshot.csvKeys.forEach((key: string) => {
          flatRow[key] = row.original[key];
        });
        snapshot.ids.forEach((id: number) => {
          const label = `مقارنة ${id + 1}`;
          flatRow[`${label} - مجموع %`] = (row.totals?.[id]?.sum || 0) + "%";
          flatRow[`${label} - الموزون`] = row.weighted?.[id] || 0;
        });
        flatRow["المتر الإجمالي النهائي"] = row.grandTotal || 0;
        return flatRow;
      });
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "1- الخلاصة النهائية",
      );
    }

    // --- 2. صفحة بيانات المقارنات ---
    const allCompHeaders = prossHeaders(selectedColumns);
    const comparisonsData = await Promise.all(
      rowIds.map(async (rowId, index) => {
        const rowEntry: any = { م: index + 1 };
        for (const header of allCompHeaders) {
          const val = await storage.get(`comp_table_${rowId}_${header}`);
          rowEntry[header] = val || "-";
        }
        return rowEntry;
      }),
    );
    const compSheet = XLSX.utils.json_to_sheet(comparisonsData);
    XLSX.utils.book_append_sheet(workbook, compSheet, "2- بيانات المقارنات");

    // --- 3. صفحة مصفوفة التسويات (تم تصحيح المفتاح هنا) ---
    const matrixExportData: any[] = [];

    // جلب قيم المقارنة للهيدر (مثل المساحة)
    const compHeaderValues: Record<string, Record<number, string>> = {};
    for (const colName of selectedColumns) {
      compHeaderValues[colName] = {};
      for (const rId of rowIds) {
        const val = await storage.get(`comp_table_${rId}_${colName}`);
        compHeaderValues[colName][rId] = val || "0";
      }
    }

    for (const colName of selectedColumns) {
      const uniqueValues = Array.from(
        new Set(data.map((r) => r[colName]?.toString() || "")),
      ).filter(Boolean);

      for (const val of uniqueValues) {
        const entry: any = { العنصر: colName, "القيمة في CSV": val };

        for (const rId of rowIds) {
          const compValue = compHeaderValues[colName][rId];
          const headerName = `مقارنة ${rowIds.indexOf(rId) + 1} (${compValue})`;

          // التصحيح: المفتاح يطابق useMatrix تماماً
          // الترتيب: matrix_{columnName}_{compIndex}_{rowValue}
          const storageKey = `matrix_${colName}_${rId}_${val}`;
          const settlementVal = await storage.get(storageKey);

          entry[headerName] = settlementVal || "0";
        }
        matrixExportData.push(entry);
      }
    }
    const matrixSheet = XLSX.utils.json_to_sheet(matrixExportData);
    XLSX.utils.book_append_sheet(workbook, matrixSheet, "3- مصفوفة التسويات");

    // --- 4. صفحة بيانات الـ CSV الأصلية ---
    const mainSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, mainSheet, "4- بيانات CSV الأصلية");

    // تصدير الملف
    XLSX.writeFile(
      workbook,
      `تقرير_التقييم_الشامل_${new Date().getTime()}.xlsx`,
    );
  };

  return (
    <Button
      onClick={generateExport}
      disabled={loading || snapshot.rows.length === 0}
      variant="outline"
      className="gap-2 border-green-600 text-green-600 hover:bg-green-700 hover:text-white transition-all font-bold"
    >
      <Download className="w-4 h-4" />
      تصدير التقرير الكامل
    </Button>
  );
}
