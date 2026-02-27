"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import StatusHandler from "@/components/custom/StatusHandler";
import { ProjectStructure } from "@/lib";
import { useProjectUpdate } from "@/hooks/useProjectMain";
import { useEvaluationSection } from "@/hooks/useSections/useEvaluationSection";
import { ManagedInput } from "../custom/managedInput";

export function EvaluationTable(project: ProjectStructure) {
  const hasData = project.hasData;
  const update = useProjectUpdate(project.id, project);
  const evaluation = useEvaluationSection(project, update);

  if (!hasData || !evaluation) return <StatusHandler type="noData" />;

  return (
    <div className="space-y-8" dir="rtl">
      {/* قسم الإعدادات العلوية */}
      <div className="flex flex-wrap items-end gap-6 p-4 border rounded-xl bg-card">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-sm font-semibold text-muted-foreground">
            التقريب إلى أقرب:
          </label>
          <Input
            type="number"
            className="w-32"
            value={evaluation.approximation}
            onChange={(e) =>
              evaluation.updateField("approximation", e.target.value)
            }
          />
        </div>
      </div>

      {/* قسم خيار الوزن الموحد */}
      <div
        className={`p-5 border-2 rounded-xl transition-all ${evaluation.getField("typeSingle") ? "bg-primary/5 border-primary/20" : "bg-gray-50/50 border-transparent"}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Checkbox
            id="isTypeSingle"
            className="w-5 h-5"
            // قسر القيمة لتكون boolean دائماً
            checked={evaluation.getField("typeSingle")}
            onCheckedChange={(checked: boolean) => {
              // تأكد أن المسمى هنا هو ما تعالجه في updateField
              evaluation.updateField("isTypeSingle", checked);
            }}
          />
          <div className="grid gap-1">
            <label
              htmlFor="isTypeSingle"
              className="text-sm font-bold leading-none cursor-pointer"
            >
              مرجح موزون موحد لكل المقارنات
            </label>
            <p className="text-xs text-muted-foreground">
              تفعيل هذا الخيار سيطبق الأوزان المدخلة هنا على جميع صفوف الجدول
              أدناه.
            </p>
          </div>
        </div>

        {evaluation.getField("isTypeSingle") && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in slide-in-from-top-2">
            {evaluation.weightCompNums.map((_, i: number) => (
              <div
                key={i}
                className="space-y-2 p-3 rounded-lg bg-background border shadow-sm"
              >
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                  مقارنة {i + 1}
                </span>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    className="pr-7"
                    value={project?.summary?.compweight?.[i] || ""}
                    onChange={(e) =>
                      evaluation.updateWeightCompNums(i, e.target.value)
                    }
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* قسم الجدول الرئيسي */}
      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableCaption className="pb-4">
            خلاصة حسابات تقييم المشروع
          </TableCaption>
          <TableHeader>
            {/* الهيدر الرئيسي بألوان مميزة */}
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {evaluation.mainHeaders.map((h, i) => (
                <TableHead
                  key={i}
                  className="text-center border-x font-bold text-foreground"
                  colSpan={h.colSpan}
                >
                  {h.label}
                </TableHead>
              ))}
            </TableRow>
            {/* الهيدر الفرعي */}
            <TableRow className="bg-background">
              {evaluation.subHeaders.map((h, i) => (
                <TableHead
                  key={i}
                  className="text-center border-x text-xs font-medium uppercase"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {evaluation.rows.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
                className="hover:bg-muted/5 transition-colors"
              >
                {row.map((cell, cellIdx) => (
                  <TableCell key={cellIdx} className="text-center border-x p-2">
                    {typeof cell === "object" && cell?.type === "input" ? (
                      <ManagedInput
                        key={cell.key} // ضروري جداً للحفاظ على الـ DOM
                        className={`h-9 text-center ...`}
                        value={cell.value}
                        disabled={evaluation.getField("isTypeSingle")}
                        onChange={(newVal: number) => {
                          // استدعاء الدالة فقط عند الانتهاء من الكتابة
                          evaluation.updateDataRowFild?.(
                            cell.rowIdx,
                            "weight",
                            cell.compIdx,
                            newVal,
                          );
                        }}
                      />
                    ) : (
                      <span className="font-medium text-sm">{cell}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
