import { useLiveQuery } from "dexie-react-hooks";
import { projectSettlementService } from "@/services/SettlementDataService";
import { projectDataService } from "@/services/projectDataService";

export const useSettlements = (projectId: string) => {
  // 1. جلب الأعمدة الأصلية من جدول البيانات (Lands)
  const originalTable = useLiveQuery(
    () => projectDataService.getTable(projectId, "Lands"),
    [projectId],
  );

  // 2. جلب إعدادات التسوية المحفوظة حالياً
  const settlementRecord = useLiveQuery(
    () => projectSettlementService.getTable(projectId),
    [projectId],
  );

  // استخراج البيانات
  const allAvailableColumns = originalTable?.headers || []; // كل الأعمدة في الـ CSV
  const selectedHeaders = settlementRecord?.headers || []; // الأعمدة التي تم اختيارها للتسوية

  const toggleColumn = async (columnName: string) => {
    try {
      const newSelection = selectedHeaders.includes(columnName)
        ? selectedHeaders.filter((col) => col !== columnName)
        : [...selectedHeaders, columnName];

      await projectSettlementService.saveTable(projectId, newSelection);
    } catch (error) {
      console.error("خطأ أثناء تحديث خيارات التسوية:", error);
    }
  };

  return {
    allAvailableColumns, // القائمة الكاملة للعرض في الـ Popover
    selectedHeaders, // لمعرفة أي Checkbox يجب أن يكون Checked
    toggleColumn,
    isLoading: originalTable === undefined || settlementRecord === undefined,
  };
};
