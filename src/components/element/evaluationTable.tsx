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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Scale, Loader2 } from "lucide-react";
import { useEvaluation } from "@/hooks/useEvaluation";
import { type CSVRow } from "@/types/csvRow";
import { ExportToExcel } from "@/components/other/ExportToExcel";
import { useSettlements } from "@/hooks/other/useSettlements";
import { useComparison } from "@/hooks/useComparison";
import { finalHead } from "@/constant/finalHead";

export function FinalSummaryTable({ data }: { data: CSVRow[] }) {
  const { selectedColumns } = useSettlements("page_settlements");
  const { rowIds } = useComparison("page_settlements");

  // استخدام الهوك مع تمرير البيانات (data) للتحديث التلقائي
  const {
    snapshot,
    loading,
    rowWeights,
    updateWeight,
    isUniformWeight,
    setIsUniformWeight,
    uniformWeights,
    updateUniformWeight,
  } = useEvaluation("page_settlements", data);

  return (
    <div
      className="w-full space-y-4 overflow-hidden border rounded-xl p-4 bg-card shadow-md"
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Database className="w-5 h-5" />
            نظام التقييم النهائي
          </h3>

          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-primary/20">
            <Checkbox
              id="weight-mode"
              checked={isUniformWeight}
              onCheckedChange={(checked) => setIsUniformWeight(!!checked)}
            />
            <label
              htmlFor="weight-mode"
              className="text-sm font-bold flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Scale className="w-4 h-4 text-primary" />
              وزن موحد لجميع الصفوف
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري معالجة الحسابات...
            </div>
          )}

          <ExportToExcel
            snapshot={snapshot}
            data={data}
            loading={loading}
            selectedColumns={selectedColumns}
            rowIds={rowIds}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="relative overflow-x-auto border rounded-lg shadow-inner bg-white min-h-[300px]">
        {snapshot.rows.length > 0 ? (
          <Table className="border-collapse text-[10px] text-center w-full">
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              {/* Row 1: Headers & Uniform Weights */}
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
                    className="border text-center font-bold bg-primary/5 text-primary p-2"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>مقارنة {id + 1}</span>
                      {isUniformWeight && (
                        <div className="flex items-center gap-1 bg-white p-1 rounded border shadow-sm">
                          <span className="text-[9px] text-muted-foreground">
                            الوزن:
                          </span>
                          <Input
                            type="number"
                            className="h-6 w-16 text-center text-[10px] font-black border-primary/30 focus-visible:ring-1"
                            value={uniformWeights[id] || ""}
                            onChange={(e) =>
                              updateUniformWeight(id, e.target.value)
                            }
                            placeholder="%"
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead
                  rowSpan={2}
                  className="border text-center bg-blue-600 text-white font-bold w-[110px]"
                >
                  المتر الإجمالي
                </TableHead>
              </TableRow>

              {/* Row 2: Sub-headers */}
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
                    {finalHead.map((item) => (
                      <TableHead key={item.key} className={item.className}>
                        {item.name}
                      </TableHead>
                    ))}
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

                  {/* CSV Data Cells */}
                  {snapshot.csvKeys.map((k) => (
                    <TableCell
                      key={`c-${rowIndex}-${k}`}
                      className="border text-center whitespace-nowrap px-2"
                    >
                      {row.original[k]}
                    </TableCell>
                  ))}

                  {/* Calculation Cells */}
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

                      <TableCell
                        className={`border text-center p-1 ${isUniformWeight ? "bg-gray-50" : "bg-blue-50/50"}`}
                      >
                        <Input
                          type="number"
                          disabled={isUniformWeight}
                          className={`h-7 text-[10px] text-center font-bold border-blue-200 focus:ring-0 mx-auto w-16 
                            ${isUniformWeight ? "opacity-60 grayscale border-none shadow-none cursor-not-allowed" : ""}`}
                          value={
                            isUniformWeight
                              ? uniformWeights[id] || ""
                              : rowWeights[rowIndex]?.[id] || ""
                          }
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

                  {/* Grand Total per Row */}
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
            <div className="flex flex-col items-center justify-center p-20 text-center italic text-muted-foreground border-2 border-dashed rounded-lg m-4">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p>لا توجد بيانات متاحة حالياً.</p>
              <p className="text-xs">
                تأكد من اختيار الأعمدة والمقارنات في الصفحات السابقة.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
