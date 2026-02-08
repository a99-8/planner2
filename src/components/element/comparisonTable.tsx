"use client";

import React from "react";
import { type CSVRow } from "@/types/csvRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ArrowUpDown } from "lucide-react";
import { useSettlements } from "@/hooks/other/useSettlements";
import { useComparison } from "@/hooks/useComparison";
import { prossHeaders } from "@/logic/settlementsHeaders";
import { NoData } from "../other/noData";
import { SmartCell } from "../other/smartCell";

interface ComparisonTableProps {
  data: CSVRow[];
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  const { rowIds, addRow, removeRow, updateCompValue, getCompValue } =
    useComparison("page_settlements");

  const { selectedColumns } = useSettlements("page_settlements");
  const allHeaders = prossHeaders(selectedColumns);

  if (data.length === 0) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm font-medium">
            عدد المقارنات الحالية: {rowIds.length}
          </span>
        </div>

        <Button
          onClick={addRow}
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة مقارنة جديدة
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-card text-card-foreground">
        <div className="overflow-x-auto w-full">
          <Table dir="rtl">
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 text-center font-bold border-x">
                  م
                </TableHead>

                {allHeaders.map((header) => (
                  <TableHead
                    key={header}
                    className="text-center font-bold border-x whitespace-nowrap px-4"
                  >
                    {header}
                  </TableHead>
                ))}

                <TableHead className="w-16 text-center font-bold border-x text-destructive">
                  إجراءات
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rowIds.map((rowId, index) => (
                <TableRow
                  key={rowId}
                  className="group hover:bg-muted/40 transition-colors animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <TableCell className="text-center font-bold border-x bg-muted/20 text-muted-foreground w-16">
                    {index + 1}
                  </TableCell>

                  {allHeaders.map((header) => (
                    <TableCell
                      key={`${rowId}-${header}`}
                      className="p-1 border-x min-w-[140px]"
                    >
                      <SmartCell
                        type="comparison"
                        id={rowId}
                        field={header}
                        onUpdate={(val) => updateCompValue(rowId, header, val)}
                        onFetch={() => getCompValue(rowId, header)}
                      />
                    </TableCell>
                  ))}

                  <TableCell className="p-1 border-x text-center w-16">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive opacity-50 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                      onClick={() => {
                        if (confirm("هل أنت متأكد من حذف هذه المقارنة؟")) {
                          removeRow(rowId);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {rowIds.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={allHeaders.length + 2}
                    className="h-24 text-center text-muted-foreground italic"
                  >
                    لا توجد مقارنات حالياً، ابدأ بإضافة واحدة!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
