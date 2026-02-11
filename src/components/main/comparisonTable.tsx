"use client";

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
import { useComparison } from "@/hooks/useLayouts";
import StatusHandler from "@/components/custom/StatusHandler";
import { SmartCell } from "@/components/custom/SmartCell";

// components/main/ComparisonTable.tsx
export function ComparisonTable({ projectId }: { projectId: string }) {
  const {
    rowIndices,
    headers,
    addRow,
    removeRow,
    updateValue,
    getValue,
    isLoading,
  } = useComparison(projectId);

  if (isLoading) return <StatusHandler type="loading" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm font-medium">
            عدد المقارنات: {rowIndices.length}
          </span>
        </div>
        <Button onClick={addRow} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> إضافة مقارنة
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table dir="rtl">
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="w-16 text-center border-x">م</TableHead>
              {headers.map((header) => (
                <TableHead key={header} className="text-center border-x">
                  {header}
                </TableHead>
              ))}
              <TableHead className="w-16 text-center border-x text-destructive">
                حذف
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowIndices.map((index) => (
              <TableRow key={index} className="group">
                <TableCell className="text-center font-bold border-x bg-muted/20">
                  {index + 1}
                </TableCell>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    className="p-1 border-x min-w-[140px]"
                  >
                    <SmartCell
                      field={header}
                      onUpdate={(val) => updateValue(index, header, val)}
                      onFetch={async () => getValue(index, header)}
                    />
                  </TableCell>
                ))}
                <TableCell className="p-1 border-x text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
