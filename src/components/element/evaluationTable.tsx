"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Calculator, Database } from "lucide-react";
import { useEvaluation } from "@/hooks/useEvaluation";
import { type CSVRow } from "@/types/csvRow";
import { ExportToExcel } from "@/components/other/ExportToExcel";
import { useSettlements } from "@/hooks/useSettlements";
import { useComparison } from "@/hooks/useComparison";

export function FinalSummaryTable({ data }: { data: CSVRow[] }) {
  // استخدام الهوك المخصص الذي قمنا بإنشائه سابقاً
  const { selectedColumns } = useSettlements("page_settlements");
  const { rowIds } = useComparison("page_settlements");
  const { snapshot, loading, handleManualUpdate, rowWeights, updateWeight } =
    useEvaluation("page_settlements");

  return (
    <div
      className="w-full space-y-4 overflow-hidden border rounded-xl p-4 bg-card shadow-md"
      dir="rtl"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
          <Database className="w-5 h-5" />
          نظام التقييم النهائي
        </h3>

        <div className="flex gap-2">
          {/* زر التصدير: لن يعمل إلا إذا كانت هناك بيانات (تم الضغط على تحديث) */}
          <ExportToExcel
            snapshot={snapshot}
            data={data} // بيانات الـ CSV القادمة كـ Props
            loading={loading}
            selectedColumns={selectedColumns}
            rowIds={rowIds}
          />

          <Button onClick={() => handleManualUpdate(data)} disabled={loading}>
            {loading ? (
              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <Calculator className="ml-2 h-4 w-4" />
            )}
            تحديث وحفظ الحسابات
          </Button>
        </div>
      </div>

      <div className="relative overflow-x-auto border rounded-lg">
        {snapshot.rows.length > 0 ? (
          <Table className="border-collapse text-[10px] text-center w-full">
            <TableHeader className="bg-muted/50">
              {/* الصف الأول: العناوين الرئيسية */}
              <TableRow className="text-center">
                <TableHead
                  rowSpan={2}
                  className="border text-center font-bold w-12 bg-muted/50"
                >
                  #
                </TableHead>
                <TableHead
                  colSpan={snapshot.csvKeys.length}
                  className="border text-center font-bold bg-muted/30"
                >
                  بيانات CSV
                </TableHead>
                {snapshot.ids.map((id) => (
                  <TableHead
                    key={`h1-${id}`}
                    colSpan={snapshot.cols.length + 4}
                    className="border text-center font-bold bg-primary/5 text-primary"
                  >
                    مقارنة {id + 1}
                  </TableHead>
                ))}
                <TableHead
                  rowSpan={2}
                  className="border text-center bg-blue-600 text-white font-bold w-[110px]"
                >
                  المتر الإجمالي
                </TableHead>
              </TableRow>

              {/* الصف الثاني: العناوين الفرعية */}
              <TableRow className="text-center">
                {snapshot.csvKeys.map((k) => (
                  <TableHead
                    key={`h2-${k}`}
                    className="border text-center opacity-70 font-medium"
                  >
                    {k}
                  </TableHead>
                ))}
                {snapshot.ids.map((id) => (
                  <React.Fragment key={`h2-f-${id}`}>
                    <TableHead className="border text-center bg-muted/20">
                      سعر المتر
                    </TableHead>
                    {snapshot.cols.map((col) => (
                      <TableHead
                        key={`h2-${id}-${col}`}
                        className="border text-center italic"
                      >
                        {col}
                      </TableHead>
                    ))}
                    <TableHead className="border text-center bg-amber-50 text-amber-800">
                      مجموع %
                    </TableHead>
                    <TableHead className="border text-center bg-blue-100 font-bold text-blue-800">
                      الوزن %
                    </TableHead>
                    <TableHead className="border text-center bg-emerald-50 font-bold text-emerald-800">
                      الموزون
                    </TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {snapshot.rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="hover:bg-muted/10 transition-colors text-center"
                >
                  <TableCell className="border text-center font-mono font-bold bg-muted/5">
                    {rowIndex + 1}
                  </TableCell>

                  {/* خلايا بيانات الـ CSV */}
                  {snapshot.csvKeys.map((k) => (
                    <TableCell
                      key={`c-${rowIndex}-${k}`}
                      className="border text-center whitespace-nowrap px-2"
                    >
                      {row.original[k]}
                    </TableCell>
                  ))}

                  {/* تفاصيل المقارنات */}
                  {snapshot.ids.map((id) => (
                    <React.Fragment key={`v-f-${rowIndex}-${id}`}>
                      <TableCell className="border text-center text-muted-foreground italic">
                        {row.totals?.[id]?.basePrice}
                      </TableCell>

                      {snapshot.cols.map((col) => (
                        <TableCell
                          key={`v-${rowIndex}-${id}-${col}`}
                          className="border text-center"
                        >
                          {row.settlements?.[id]?.[col]}%
                        </TableCell>
                      ))}

                      <TableCell className="border text-center font-bold text-amber-700">
                        {row.totals?.[id]?.sum}%
                      </TableCell>

                      {/* خلية إدخال الوزن */}
                      <TableCell className="border text-center bg-blue-50/50 p-1">
                        <Input
                          type="number"
                          className="h-7 text-[10px] text-center font-bold border-blue-200 focus:ring-0 mx-auto w-20"
                          value={rowWeights[rowIndex]?.[id] || ""}
                          onChange={(e) =>
                            updateWeight(rowIndex, id, e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell className="border text-center font-bold text-emerald-700 bg-emerald-50/10">
                        {row.weighted?.[id]?.toFixed(2)}
                      </TableCell>
                    </React.Fragment>
                  ))}

                  {/* المتر الإجمالي النهائي */}
                  <TableCell className="border text-center font-black bg-blue-50 text-blue-900 text-sm">
                    {row.grandTotal?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !loading && (
            <div className="p-20 text-center italic text-muted-foreground border-2 border-dashed rounded-lg">
              الجدول فارغ، يرجى الضغط على زر التحديث.
            </div>
          )
        )}
      </div>
    </div>
  );
}
