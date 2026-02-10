import { useLiveQuery } from "dexie-react-hooks";
import { useRef } from "react";
import { formatCSVData, parseCSV, projectService } from "@/lib/index";

export const useLands = (projectId: string) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. مراقبة المشروع بالكامل لجلب بيانات الأراضي
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );

  // 2. استخراج حالة الأراضي من الهيكل الموحد
  const state = {
    data: project?.landsTable?.dataRow || {},
    headers: project?.landsTable?.header || [],
    fileName: project?.landsTable?.fileName || "لا يوجد ملف مختار",
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: rawRows, name, headers: csvHeaders } = await parseCSV(file);
      if (!rawRows || rawRows.length === 0) return;

      // تنسيق البيانات حسب منطق تطبيقك
      const formattedResult = formatCSVData(name, rawRows, csvHeaders);

      // 3. التحديث الموحد: نرسل البيانات الجديدة لحقل landsTable فقط
      await projectService.updateProjectSection(projectId, {
        landsTable: {
          fileName: name,
          header: formattedResult.headers,
          dataRow: formattedResult.data, // تأكد أن formatCSVData تعيد البيانات بهذا الشكل
        },
      });

      // تفريغ المدخل للسماح برفع نفس الملف مجدداً إذا لزم الأمر
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error processing CSV:", error);
    }
  };

  const clearData = async () => {
    // إرسال قيم فارغة لتصفير جدول الأراضي في الهيكل الموحد
    await projectService.updateProjectSection(projectId, {
      landsTable: { fileName: "", header: [], dataRow: {} },
    });
  };

  return {
    ...state,
    handleFileChange,
    fileInputRef,
    clearData,
    isLoading: project === undefined,
    openFilePicker: () => fileInputRef.current?.click(),
  };
};
