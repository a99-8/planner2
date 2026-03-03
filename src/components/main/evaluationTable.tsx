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
import { ProjectStructure, evaluationData, sync } from "@/lib";
import { useEvaluationSection } from "@/hooks/useSections";

export function EvaluationTable(project: ProjectStructure) {
  const hasData = project.hasData;
  const evaluation = useEvaluationSection(project);
  const data = evaluationData(project);
  const { mainHeaders = [], subHeaders = [], compCount = 0 } = data || {};

  if (!hasData || !evaluation || !evaluationData || !data)
    return <StatusHandler type="noData" />;

  const { get, set } = sync(project);
  const isTypeSingle = get.isTypeSingle();
  const { rows } = evaluation || { rows: [] };

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
            value={get.approximation()} // القيمة من الـ state
            onChange={(e) => set.approximation(Number(e.target.value))}
          />
        </div>
      </div>

      {/* قسم خيار الوزن الموحد */}
      <div
        className={`p-5 border-2 rounded-xl transition-all ${isTypeSingle ? "bg-primary/5 border-primary/20" : "bg-gray-50/50 border-transparent"}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Checkbox
            id="isTypeSingle"
            className="w-5 h-5"
            checked={isTypeSingle}
            onCheckedChange={(checked: boolean) => {
              set.isTypeSingle(checked);
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

        {isTypeSingle && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in slide-in-from-top-2">
            {/* التعامل مع compWeights كـ Object */}
            {Array.from({ length: compCount }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="space-y-2 p-3 rounded-lg bg-background border shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                    مقارنة {index + 1}
                  </span>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="pr-7"
                      value={get.weightForComp(index) || 0} // القيمة من الـ state
                      onChange={(e) =>
                        set.weightForComp(index, Number(e.target.value))
                      }
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                      %
                    </span>
                  </div>
                </div>
              );
            })}
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
              {mainHeaders.map((h: any, i: number) => (
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
              {subHeaders.map((h: any, i: number) => (
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
            {rows.map(
              (
                row: any,
                rowIdx: number, // نستخدم rows هنا
              ) => (
                <TableRow key={rowIdx}>
                  {/* 2. الوصول لـ baseRows من داخل الكائن row */}
                  {row.baseRows.map((cell: any, cellIdx: number) => (
                    <TableCell
                      key={cellIdx}
                      className="text-center border-x p-2"
                    >
                      <span className="font-medium text-sm">{cell}</span>
                    </TableCell>
                  ))}

                  {/* ... خلايا الـ Input ... */}
                  {Array.from({ length: compCount }).map((_, compIdx) => (
                    <TableCell
                      key={`${rowIdx} x ${compIdx}`}
                      className="text-center border-x p-2"
                    >
                      <Input
                        key={`input for cell : ${rowIdx} x ${compIdx}`}
                        className="h-8 w-fit text-center"
                        type="number"
                        // القيمة من الـ state المحلى للـ rowWeights
                        value={get.weightForRow(rowIdx, `comp${compIdx}`) || 0}
                        disabled={isTypeSingle}
                        onChange={(e) =>
                          set.weightForRow(
                            rowIdx,
                            `comp${compIdx}`,
                            Number(e.target.value),
                          )
                        }
                      />
                    </TableCell>
                  ))}

                  {/* 3. الوصول لـ finalRows من داخل الكائن row */}
                  {row.finalRows.map((cell: any, cellIdx: number) => (
                    <TableCell
                      key={cellIdx}
                      className="text-center border-x p-2"
                    >
                      <span className="font-medium text-sm">{cell}</span>
                    </TableCell>
                  ))}
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
