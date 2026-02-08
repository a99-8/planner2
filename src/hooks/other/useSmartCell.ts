import { useState, useEffect } from "react";
import { storage } from "@/logic/storageHandler";

interface UseSmartCellProps {
  type: "comparison" | "matrix" | "header";
  id: string | number;
  field: string;
  extraId?: any;
  onFetch?: () => Promise<any>;
}

export function useSmartCell({
  type,
  id,
  field,
  extraId,
  onFetch,
}: UseSmartCellProps) {
  const [val, setVal] = useState<any>("");

  useEffect(() => {
    const fetchData = async () => {
      if (type === "header") {
        const targetId = extraId !== undefined ? extraId : id;
        const saved = await storage.get(`comp_table_${targetId}_${field}`);
        setVal(saved ?? "");
      } else if (onFetch) {
        const res = await onFetch();
        setVal(res ?? "");
      }
    };

    fetchData();

    if (type === "header") {
      window.addEventListener("settlements_updated", fetchData);
      return () => window.removeEventListener("settlements_updated", fetchData);
    }
  }, [id, field, type, onFetch, extraId]);

  return { val, setVal };
}
