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

export const useMatrixControl = (projectId: string, settlementName: string) => {
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );
  const settings = project?.reference?.settlementsTable?.columnSettings?.[
    settlementName
  ] || {
    isAuto: true,
    isInterpolated: true,
    baseGroup: 0,
    maxValue: 0,
    minValue: 0,
    groupCount: 0,
    baseSettlement: 0,
    increment: 0,
  };

  const updateSettings = async (updatedFields: Partial<typeof settings>) => {
    if (!project) return;

    // 1. محاولة جلب البيانات من settlementsTable أولاً، ثم landsTable كبديل
    const settlementsData = project.reference?.settlementsTable?.dataRow;
    const landsData = project.landsTable?.dataRow;

    // اختيار المصدر الذي يحتوي على بيانات فعلياً
    const dataRow =
      settlementsData && Object.keys(settlementsData).length > 0
        ? settlementsData
        : landsData;

    if (!dataRow) {
      console.error(
        "خطأ: لم يتم العثور على dataRow في أي مكان (landsTable أو settlementsTable)",
      );
      return;
    }

    // 2. تنظيف اسم العمود (إزالة المسافات المخفية)
    const cleanSettlementName = settlementName.trim();
    let actualKey = Object.keys(dataRow).find(
      (key) => key.trim() === cleanSettlementName,
    );

    console.log("المفاتيح المتاحة:", Object.keys(dataRow));
    console.log("العمود المطلوب:", cleanSettlementName);

    let maxValue = 0;
    let minValue = 0;
    let groupCount = 0;
    let isAuto = updatedFields.isAuto ?? settings.isAuto;

    // 3. معالجة القيم إذا وجدنا العمود
    if (actualKey && Array.isArray(dataRow[actualKey])) {
      const rowValues = dataRow[actualKey];
      const numericValues = rowValues
        .map((v) => (v !== null && v !== undefined ? String(v).trim() : ""))
        .filter((v) => v !== "")
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));

      if (numericValues.length > 0) {
        maxValue = Math.max(...numericValues);
        minValue = Math.min(...numericValues);

        const currentBaseGroup = updatedFields.baseGroup ?? settings.baseGroup;
        if (currentBaseGroup > 0) {
          groupCount = Math.ceil((maxValue - minValue) / currentBaseGroup) + 1;
        }
      } else {
        isAuto = false;
      }
    } else {
      console.warn(
        `العمود [${cleanSettlementName}] غير موجود في البيانات المتوفرة.`,
      );
      isAuto = false;
    }

    // 4. الحفظ
    const newSettings = {
      ...settings,
      ...updatedFields,
      isAuto,
      maxValue,
      minValue,
      groupCount,
    };

    try {
      await projectService.updateProjectSection(projectId, {
        [`reference.settlementsTable.columnSettings.${settlementName}`]:
          newSettings,
      } as any);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const applyInterpolation = async () => {
    if (!project) return;
    console.log("applyInterpolation:");
  };

  return {
    settings,
    isLoading: project === undefined,
    updateSettings,
    applyInterpolation,
  };
};
