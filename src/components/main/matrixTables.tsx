"use client";

import { MatrixControl } from "@/components/custom/matrixControl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import StatusHandler from "@/components/custom/StatusHandler";
import { Calculator, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectStructure, sync } from "@/lib";
import { useMatrixSection } from "@/hooks/useSections";

export function MatrixTables(project: ProjectStructure) {
  const hasData = project.hasData;
  const settlements = project.control?.settlements || [];
  const matrixdata = useMatrixSection(project);
  const { get, set } = sync(project);
  if (!hasData) {
    return <StatusHandler type="noData" />;
  }
  return (
    <Accordion type="multiple" defaultValue={["item-1"]} className="space-y-4">
      {settlements.map((settlement: string, index: number) => {
        const data = matrixdata(settlement);
        if (!data) return null;

        const { frRow, frCol, average, isInterpolated } = data;

        return (
          <AccordionItem
            value={`item-${index + 1}`}
            key={index}
            className="border rounded-xl px-4 bg-card shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-right">
                    مصفوفة تسوية: {settlement}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-4 font-mono text-[10px]"
                >
                  {frRow.length} x {frCol.length}
                </Badge>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-6">
              <div className="space-y-4" dir="rtl">
                {/* أدوات التحكم بالمصفوفة */}
                <div className="bg-muted/30 p-3 rounded-lg border border-dashed">
                  <MatrixControl project={project} settlement={settlement} />
                </div>

                {/* الجدول الرئيسي */}
                <div className="rounded-xl border shadow-sm overflow-hidden border-collapse">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="bg-primary/3 font-bold text-center border-l border-b min-w-[160px] text-primary">
                          {settlement}
                        </TableHead>
                        {frCol.map((valueSettement: any, setId: number) => (
                          <TableHead
                            key={`${settlement}-h-${setId}`}
                            className="text-center border-l border-b min-w-[110px] text-[11px] font-black uppercase"
                          >
                            مقارنة {setId + 1}
                            <div className="text-[9px] text-muted-foreground font-normal truncate max-w-[100px]">
                              {valueSettement}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {frRow.map((valueLands: any, LandsId: number) => (
                        <TableRow
                          key={`${settlement}-r-${LandsId}`}
                          className="group transition-colors hover:bg-primary/1"
                        >
                          <TableCell className="border-l font-bold bg-muted/5 text-xs text-right py-3 px-4">
                            {valueLands}
                          </TableCell>

                          {frCol.map((_: any, setInputId: number) => {
                            const isDisabled =
                              isInterpolated && valueLands !== average;

                            return (
                              <TableCell
                                key={`${settlement}-cell-${LandsId}-${setInputId}`}
                                className={`p-0 border-l transition-all ${isDisabled ? "bg-muted/20" : "hover:bg-background"}`}
                              >
                                <Input
                                  className={`h-10 text-center border-none rounded-none bg-transparent focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-primary ${
                                    isDisabled
                                      ? "opacity-30 cursor-not-allowed"
                                      : "font-medium"
                                  }`}
                                  placeholder="0"
                                  value={get.matrixCell(
                                    project?.matrix?.settlementsTable?.[
                                      settlement
                                    ],
                                    valueLands,
                                    setInputId,
                                  )}
                                  onChange={(e) =>
                                    set.matrixCell(
                                      settlement,
                                      valueLands,
                                      setInputId,
                                      e.target.value,
                                    )
                                  }
                                  disabled={isDisabled}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end pt-2 flex-row-reverse">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                    <Info className="w-3 h-3" />
                    يتم حفظ البيانات تلقائياً عند التغيير
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
