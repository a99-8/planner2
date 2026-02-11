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
import { Zap } from "lucide-react";
import { ColumnDetails } from "@/lib/types";

interface MatrixControlProps {
  columnName: string;
  details: ColumnDetails;
  globalControllingValue: number;
  onUpdateControl: (data: any) => void;
  onUpdateGlobalValue: (val: number) => void;
  onApplyLinear: () => void;
}

export const MatrixControl = ({
  columnName,
  details,
  globalControllingValue,
  onUpdateControl,
  onUpdateGlobalValue,
  onApplyLinear,
}: MatrixControlProps) => {
  const { minVal, maxVal, groupCount, settings } = details;

  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-dashed space-y-4 mb-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`auto-${columnName}`}
            checked={settings.isAuto}
            onCheckedChange={(v) => onUpdateControl({ isAuto: !!v })}
          />
          <Label htmlFor={`auto-${columnName}`}>تفعيل المجموعات</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`linear-${columnName}`}
            checked={settings.isInterpolated}
            onCheckedChange={(v) => onUpdateControl({ isInterpolated: !!v })}
          />
          <Label
            htmlFor={`linear-${columnName}`}
            className="text-blue-600 font-bold"
          >
            توزيع خطي تلقائي
          </Label>
        </div>
      </div>

      <Table className="w-full border bg-background overflow-hidden rounded-md">
        <TableHeader>
          <TableRow className="bg-muted/50 text-[11px]">
            <TableHead className="text-center border h-9">
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
            <TableCell className="p-0 border">
              <Input
                type="number"
                className="h-9 border-none text-center font-bold"
                value={globalControllingValue || ""}
                onChange={(e) =>
                  onUpdateGlobalValue(parseFloat(e.target.value))
                }
              />
            </TableCell>
            <TableCell className="text-center border font-mono text-xs">
              {minVal}
            </TableCell>
            <TableCell className="text-center border font-mono text-xs">
              {maxVal}
            </TableCell>
            <TableCell className="text-center border font-black text-primary bg-primary/5">
              {groupCount}
            </TableCell>
            <TableCell className="p-0 border">
              <Input
                type="number"
                className="h-9 border-none text-center text-blue-600 font-bold"
                value={settings.baseSettlement || ""}
                onChange={(e) =>
                  onUpdateControl({
                    baseSettlement: parseFloat(e.target.value),
                  })
                }
              />
            </TableCell>
            <TableCell className="p-0 border">
              <Input
                type="number"
                className="h-9 border-none text-center text-blue-600 font-bold"
                value={settings.increment || ""}
                onChange={(e) =>
                  onUpdateControl({ increment: parseFloat(e.target.value) })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {settings.isInterpolated && (
        <Button
          variant="default"
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={onApplyLinear}
        >
          <Zap size={16} fill="currentColor" /> تطبيق التوزيع الخطي على الجدولة
        </Button>
      )}
    </div>
  );
};
