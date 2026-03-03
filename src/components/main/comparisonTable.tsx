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
import { ComparisonCell } from "../custom/comparisonCell";
import { ProjectStructure, sync } from "@/lib";

export function ComparisonTable(project: ProjectStructure) {
  const { get, set } = sync(project);
  const comps = get.comparisons();
  const headers = project?.comparisons?.header || [];
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* رأس الجدول والتحكم */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-sm font-medium">
              عدد المقارنات: {comps.length}
            </span>
          </div>
          <Button
            onClick={set.addComparison}
            size="sm"
            variant={"ghost"}
            className="gap-2 hover:border-2 hover:shadow-none shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            إضافة مقارنة
          </Button>
        </div>

        <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
          <Table dir="rtl">
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead className="w-16 text-center border-l">م</TableHead>
                {headers.map((header: any, index: any) => (
                  <TableHead
                    key={`head-${header}-${index}`}
                    className="text-center border-x"
                  >
                    {header}
                  </TableHead>
                ))}
                <TableHead className="w-16 text-center border-r text-destructive font-bold">
                  إجراء
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comps.map((comp: any) => (
                <TableRow
                  key={`row-${comp.num}`}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {/* التسلسل الرقمي */}
                  <TableCell className="text-center font-bold border-l bg-muted/20 w-12">
                    {comp.num}
                  </TableCell>

                  {/* خلايا البيانات */}
                  {headers.map((header: any, colIndex: any) => (
                    <TableCell
                      key={`cell-${comp.num}-${header}-${colIndex + 1}`}
                      className="p-1 border-x min-w-[140px]"
                    >
                      <ComparisonCell
                        key={`cell-${comp.num}-${header}-${colIndex + 1}`}
                        field={header}
                        value={get.ComparisonsValue(comp.num, header)}
                        onChange={(val) =>
                          set.ComparisonsValue(comp.num, header, val)
                        }
                      />
                    </TableCell>
                  ))}

                  {/* زر الحذف */}
                  <TableCell className="p-1 border-r text-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => set.deleteComparison(comp.num)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* رسالة في حال عدم وجود بيانات */}
        {comps.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            لا توجد مقارنات مضافة حالياً. اضغط على "إضافة مقارنة" للبدء.
          </div>
        )}
      </div>
    </>
  );
}
