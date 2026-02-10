"use client";

import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { InputSelector } from "@/components/other/ui/inputSelector";
import { useSmartCell } from "@/hooks/other/useSmartCell";
import { specialFields } from "@/constant/specialFields";

interface SmartCellProps {
  type: "comparison" | "matrix" | "header";
  id: string | number;
  field: string;
  extraId?: any;
  onUpdate?: (val: any) => void;
  onFetch?: () => Promise<any>;
}

export function SmartCell(props: SmartCellProps) {
  const { type, id, field, onUpdate } = props;
  const { val, setVal } = useSmartCell(props);

  const handleUpdate = (newValue: any) => {
    const safeVal = newValue ?? "";
    setVal(safeVal);
    onUpdate?.(safeVal);

    if (type === "comparison") {
      window.dispatchEvent(new Event("settlements_updated"));
    }
  };

  if (type === "header") {
    return (
      <TableCell className="font-bold bg-muted/30 text-center border whitespace-nowrap min-w-[140px]">
        مقارنة {id} {val ? `(${val})` : ""}
      </TableCell>
    );
  }

  if (type === "comparison" && specialFields.includes(field)) {
    return (
      <div className="flex justify-center p-1">
        <InputSelector inputType={field} value={val} onChange={handleUpdate} />
      </div>
    );
  }

  return (
    <Input
      className="h-8 text-center border-none focus-visible:ring-1 bg-transparent"
      placeholder={type === "matrix" ? "0" : ""}
      type={type === "matrix" ? "number" : "text"}
      value={val}
      onChange={(e) => handleUpdate(e.target.value)}
    />
  );
}
