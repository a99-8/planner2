"use client";

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap, AlertCircle } from "lucide-react";
import { useSections } from "@/hooks/useSections";

export function MatrixControl({
  projectId,
  settlement,
}: {
  projectId: string;
  settlement: string;
}) {
  const { matrixdata } = useSections(projectId);
  const data = matrixdata(settlement);
  if (!data) return null;
  const { settings, updateSettings, isDataValid } = data;
  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-dashed space-y-4 mb-4">
      {/* قسم التحكم العلوي */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`auto-${settlement}`}
              checked={settings.isAuto}
              disabled={!isDataValid}
              onCheckedChange={(checked) =>
                updateSettings({ isAuto: !!checked })
              }
            />
            <Label
              htmlFor={`auto-${settlement}`}
              className={`cursor-pointer ${!isDataValid ? "opacity-50" : ""}`}
            >
              تفعيل المجموعات
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id={`linear-${settlement}`}
              checked={settings.isInterpolated}
              onCheckedChange={(checked) =>
                updateSettings({ isInterpolated: !!checked })
              }
            />
            <Label
              htmlFor={`linear-${settlement}`}
              className="text-blue-600 font-bold cursor-pointer"
            >
              توزيع خطي تلقائي
            </Label>
          </div>
        </div>

        {!isDataValid ? (
          <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            <AlertCircle size={12} />
            يرجى التأكد من أن جميع قيم العمود أرقام
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
            <AlertCircle size={12} />
            جميع قيم العمود أرقام
          </div>
        )}
      </div>

      {/* جدول إدخال القيم */}
      <Table className="w-full border bg-background overflow-hidden rounded-md">
        <TableHeader>
          <TableRow className="bg-muted/50 text-[11px]">
            <TableHead className="text-center border h-9 w-24">
              قيمة المجموعة
            </TableHead>
            <TableHead className="text-center border h-9">أصغر قيمة</TableHead>
            <TableHead className="text-center border h-9">أكبر قيمة</TableHead>
            <TableHead className="text-center border h-9 font-bold">
              عدد المجموعات
            </TableHead>
            <TableHead className="text-center border h-9 text-blue-600 font-bold">
              التسوية الأساسية
            </TableHead>
            <TableHead className="text-center border h-9 text-blue-600 font-bold">
              مقدار القفزة
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* قيمة المجموعة الأساسية */}
            <TableCell className="p-0 border">
              <Input
                type="number"
                className="h-9 border-none text-center font-bold focus-visible:ring-0"
                value={settings.baseGroup || ""}
                onChange={(e) =>
                  updateSettings({ baseGroup: Number(e.target.value) })
                }
              />
            </TableCell>

            {/* أصغر قيمة (قراءة فقط من الإعدادات المحسوبة في الـ Hook) */}
            <TableCell className="text-center border font-mono text-xs bg-primary/5">
              {settings.minValue.toLocaleString()}
            </TableCell>

            {/* أكبر قيمة */}
            <TableCell className="text-center border font-mono text-xs bg-primary/5">
              {settings.maxValue.toLocaleString()}
            </TableCell>

            {/* عدد المجموعات (يعرض القيمة المحفوظة في الـ DB مباشرة) */}
            <TableCell className="text-center border font-black text-primary bg-primary/5">
              {settings.groupCount}
            </TableCell>

            {/* التسوية الأساسية */}
            <TableCell className="p-0 border">
              <Input
                type="number"
                className="h-9 border-none text-center text-blue-600 font-bold focus-visible:ring-0"
                value={settings.baseSettlement || ""}
                placeholder="0"
                onChange={(e) =>
                  updateSettings({ baseSettlement: Number(e.target.value) })
                }
              />
            </TableCell>

            {/* مقدار القفزة */}
            <TableCell className="p-0 border">
              <Input
                type="number"
                className="h-9 border-none text-center text-blue-600 font-bold focus-visible:ring-0"
                value={settings.increment || ""}
                placeholder="0"
                onChange={(e) =>
                  updateSettings({ increment: Number(e.target.value) })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* زر تطبيق التوزيع الخطي */}
      {settings.isInterpolated && (
        <Button
          className="w-full gap-2 bg-blue-600 text-white shadow-md transition-all active:scale-[0.98] hover:bg-white hover:text-blue-600 hover:shadow-none hover:border-blue-600 hover:border-2"
          disabled={settings.increment < 0}
        >
          <Zap size={16} className="fill-current" />
          تطبيق التوزيع الخطي على الجدولة
        </Button>
      )}
    </div>
  );
}
