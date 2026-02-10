import { useLiveQuery } from "dexie-react-hooks";
import { projectDataService } from "@/services/projectDataService";
import { parseCSV } from "@/logic/csvParser";
import { formatCSVData } from "@/func/formadTable";
import { useRef } from "react";

export const useLands = (projectId: string) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // مراقبة البيانات مباشرة
  const savedTable = useLiveQuery(
    () => projectDataService.getTable(projectId, "Lands"),
    [projectId],
  );

  // استخراج الحالة من البيانات المستلمة أو وضع قيم افتراضية
  const state = {
    data: savedTable?.data || {},
    headers: savedTable?.headers || [],
    fileName: savedTable?.fileName || "No file chosen",
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: rawRows, name, headers } = await parseCSV(file);
      if (!rawRows || rawRows.length === 0) return;

      const formattedResult = formatCSVData(name, rawRows, headers);

      // بمجرد الحفظ هنا، سيقوم useLiveQuery بتحديث الواجهة تلقائياً
      await projectDataService.saveTable(projectId, "Lands", formattedResult);

      event.target.value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearData = async () => {
    await projectDataService.deleteTable(projectId, "Lands");
  };

  return {
    ...state,
    handleFileChange,
    fileInputRef,
    clearData,
    isMounted: savedTable !== undefined, // يعمل كبديل لـ loading
    openFilePicker: () => fileInputRef.current?.click(),
  };
};
