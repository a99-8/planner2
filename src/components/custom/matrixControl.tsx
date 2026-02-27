"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Settings2, SlidersHorizontal } from "lucide-react";
import { makeGroupBase, ProjectStructure } from "@/lib";
import { useProjectUpdate } from "@/hooks/useProjectMain";
import { useMatrixSection } from "@/hooks/useSections/useMatrixSection";

export function MatrixControl({
  project,
  settlement,
}: {
  project: ProjectStructure;
  settlement: string;
}) {
  const update = useProjectUpdate(project.id, project);
  const matrixdata = useMatrixSection(project, update);
  const data = matrixdata(settlement);

  if (!data) return null;

  const { settings, updateSettings, InterpolatedFunc, isAuto, isInterpolated } =
    data;

  return (
    <div className="space-y-6 mb-4">
      {/* الجدول الأول: إعدادات المجموعة - يظهر فقط في حالة isAuto */}
      {isAuto && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-1">
            <Settings2 size={16} />
            إعدادات المجموعة التلقائية
          </div>
          <Table className="w-full border bg-background overflow-hidden rounded-md shadow-sm">
            <TableHeader>
              <TableRow className="bg-muted/50 text-[11px]">
                <TableHead className="text-center border h-9">
                  قيمة المجموعة
                </TableHead>
                <TableHead className="text-center border h-9">
                  أصغر قيمة
                </TableHead>
                <TableHead className="text-center border h-9">
                  أكبر قيمة
                </TableHead>
                <TableHead className="text-center border h-9 font-bold">
                  عدد المجموعات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="p-0 border w-1/4">
                  <Select
                    value={String(settings.baseGroup || "")}
                    onValueChange={(val) =>
                      updateSettings({ baseGroup: Number(val) })
                    }
                    dir="rtl"
                  >
                    <SelectTrigger className="w-full border-none focus:ring-0">
                      <SelectValue placeholder="اختر القيمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>قيمة المجموعة</SelectLabel>
                        {makeGroupBase(
                          settings.minValue,
                          settings.maxValue,
                        ).map((value: number, index: number) => (
                          <SelectItem key={index} value={String(value)}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center border font-mono text-xs bg-primary/5 italic">
                  {settings.minValue.toLocaleString()}
                </TableCell>
                <TableCell className="text-center border font-mono text-xs bg-primary/5 italic">
                  {settings.maxValue.toLocaleString()}
                </TableCell>
                <TableCell className="text-center border font-black text-primary bg-primary/5">
                  {settings.groupCount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* الجدول الثاني: إعدادات التسوية - يظهر فقط في حالة isInterpolated */}
      {isInterpolated && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-1">
            <SlidersHorizontal size={16} />
            إعدادات التوزيع الخطي (Interpolation)
          </div>
          <Table className="w-full border bg-background overflow-hidden rounded-md shadow-sm">
            <TableHeader>
              <TableRow className="bg-blue-50/50 text-[11px]">
                <TableHead className="text-center border h-9 text-blue-700 font-bold">
                  التسوية الأساسية
                </TableHead>
                <TableHead className="text-center border h-9 text-blue-700 font-bold">
                  مقدار القفزة
                </TableHead>
                <TableHead className="text-center border h-9 text-blue-700 font-bold">
                  معدل القفزة
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
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
                <TableCell className="p-0 border">
                  <Input
                    type="number"
                    className="h-9 border-none text-center text-blue-600 font-bold focus-visible:ring-0"
                    value={settings.incrementEvery || ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateSettings({ incrementEvery: Number(e.target.value) })
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* زر التطبيق يظهر فقط مع الجدول الثاني */}
          <Button
            className="w-full gap-2 bg-blue-600 text-white shadow-md transition-all active:scale-[0.98] hover:bg-blue-700"
            disabled={settings.increment < 0}
            onClick={InterpolatedFunc}
          >
            <Zap size={16} className="fill-current" />
            تطبيق التوزيع الخطي على الجدولة
          </Button>
        </div>
      )}
    </div>
  );
}
