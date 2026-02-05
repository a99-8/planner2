import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function MatrixInput({
  columnName,
  rowValue,
  compIndex,
  updateCellValue,
  getCellValue,
}: any) {
  const [val, setVal] = useState("");

  // جلب القيمة المخزنة عند أول تحميل
  useEffect(() => {
    getCellValue(columnName, rowValue, compIndex).then((savedVal: string) => {
      if (savedVal) setVal(savedVal);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setVal(newValue);
    updateCellValue(columnName, rowValue, compIndex, newValue);
  };

  return (
    <Input
      className="h-8 text-center border-none focus-visible:ring-1 bg-transparent"
      placeholder="0"
      type="number"
      value={val}
      onChange={handleChange}
    />
  );
}
