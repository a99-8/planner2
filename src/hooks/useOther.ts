import { useLiveQuery } from "dexie-react-hooks";
import { projectService, staticHeaders } from "@/lib/index";
import { useState, useEffect, useCallback } from "react";

// لتحديث التسويات
export const useSettlements = (projectId: string) => {
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );

  const toggleColumn = async (columnName: string) => {
    if (!project) return;

    const currentSettlements = project.settlements || [];
    const isSelected = currentSettlements.includes(columnName);
    const newSettlements = isSelected
      ? currentSettlements.filter((col) => col !== columnName)
      : [...currentSettlements, columnName];
    const newComparisonHeaders = [...staticHeaders, ...newSettlements];
    const newDataRow = { ...project.comparisons.dataRow };
    newComparisonHeaders.forEach((header) => {
      if (!newDataRow[header]) {
        const rowCount =
          project.comparisons.header.length > 0
            ? project.comparisons.dataRow[project.comparisons.header[0]]
                ?.length || 0
            : 0;
        newDataRow[header] = new Array(rowCount).fill("");
      }
    });

    await projectService.updateProjectSection(projectId, {
      settlements: newSettlements,
      comparisons: {
        ...project.comparisons,
        header: newComparisonHeaders,
        dataRow: newDataRow,
      },
    });
  };

  return {
    selectedHeaders: project?.settlements || [],
    allAvailableColumns: project?.landsTable?.header || [],
    toggleColumn,
  };
};

interface SmartCellProps {
  field: string;
  onUpdate?: (val: any) => void;
  onFetch?: () => Promise<any>;
}

export function useSmartCell({ field, onUpdate, onFetch }: SmartCellProps) {
  const [val, setVal] = useState<any>("");

  // 1. جلب البيانات من Dexie
  const dbValue = useLiveQuery(async () => {
    return onFetch ? await onFetch() : "";
  }, [field]);

  // 2. مزامنة الحالة المحلية عند تغير بيانات القاعدة
  useEffect(() => {
    if (dbValue !== undefined) setVal(dbValue);
  }, [dbValue]);

  // 3. دالة التحديث الموحدة
  const handleUpdate = useCallback(
    (newValue: any) => {
      const safeVal = newValue ?? "";
      setVal(safeVal); // تحديث الواجهة فوراً
      onUpdate?.(safeVal); // تنفيذ التحديث الخارجي (DB write)
      window.dispatchEvent(new Event("settlements_updated"));
    },
    [onUpdate],
  );

  return { val, handleUpdate };
}
