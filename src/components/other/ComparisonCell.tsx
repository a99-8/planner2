import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function ComparisonCell({
  rowIndex,
  header,
  updateCompValue,
  getCompValue,
}: {
  rowIndex: number;
  header: string;
  updateCompValue: any;
  getCompValue: any;
}) {
  const [value, setValue] = useState("");

  // جلب البيانات المخزنة عند التحميل
  useEffect(() => {
    getCompValue(rowIndex, header).then((saved: string) => {
      if (saved) setValue(saved);
    });
  }, [rowIndex, header]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    updateCompValue(rowIndex, header, newVal);
  };

  return (
    <Input
      className="text-center h-8 border-none focus-visible:ring-1 bg-transparent"
      value={value}
      onChange={handleChange}
      placeholder="..."
    />
  );
}
