import { useLiveQuery } from "dexie-react-hooks";
import { useRef, useMemo, useCallback } from "react";
import {
  formatCSVData,
  parseCSV,
  projectService,
  staticHeaders,
} from "@/lib/index";

// لتحديث قسم الاراضي
export const useLands = (projectId: string) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );

  // استخدام useMemo لتحسين الأداء ومنع إعادة التدوير غير الضرورية للكائنات
  const landsData = useMemo(
    () => ({
      data: project?.landsTable?.dataRow || {},
      headers: project?.landsTable?.header || [],
      fileName: project?.landsTable?.fileName || "لا يوجد ملف مختار",
    }),
    [project],
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: rawRows, name, headers: csvHeaders } = await parseCSV(file);
      if (!rawRows || rawRows.length === 0) return;

      const formattedResult = formatCSVData(name, rawRows, csvHeaders);

      // التأكد من تحديث القسم المخصص فقط
      await projectService.updateProjectSection(projectId, {
        landsTable: {
          fileName: name,
          header: formattedResult.headers,
          dataRow: formattedResult.data,
        },
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error processing CSV:", error);
      // هنا يفضل إضافة Notification للمستخدم لإعلامه بوجود خطأ
    }
  };

  const clearData = useCallback(async () => {
    await projectService.updateProjectSection(projectId, {
      landsTable: { fileName: "", header: [], dataRow: {} },
    });
  }, [projectId]);

  return {
    ...landsData,
    handleFileChange,
    fileInputRef,
    clearData,
    isLoading: project === undefined,
    openFilePicker: () => fileInputRef.current?.click(),
  };
};

// لتحديث قسم المقارنات
export const useComparison = (projectId: string) => {
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );
  const dataRow = project?.comparisons?.dataRow || {};
  const headers = project?.comparisons?.header || [];
  const rowCount = project?.comparisons?.number || 0;
  const rowIndices = Array.from({ length: rowCount }, (_, i) => i);
  const removeRow = async (index: number) => {
    if (!project) return;
    const newDataRow = { ...dataRow };
    headers.forEach((header) => {
      if (newDataRow[header]) newDataRow[header].splice(index, 1);
    });
    const currentMatrix = {
      ...(project.reference?.settlementsTable?.dataRow || {}),
    };
    Object.keys(currentMatrix).forEach((key) => {
      if (Array.isArray(currentMatrix[key])) {
        currentMatrix[key].splice(index, 1);
      }
    });

    await projectService.updateProjectSection(projectId, {
      comparisons: {
        ...project.comparisons,
        dataRow: newDataRow,
        number: Math.max(0, rowCount - 1),
      },
      reference: {
        ...project.reference,
        settlementsTable: {
          ...project.reference.settlementsTable,
          dataRow: { ...currentMatrix }, // نسخة جديدة
        },
      },
      updatedAt: new Date(),
    });
  };

  const updateValue = async (index: number, header: string, value: any) => {
    if (!project) return;
    const newDataRow = { ...project.comparisons.dataRow };
    const columnArray = newDataRow[header] ? [...newDataRow[header]] : [];
    columnArray[index] = value;
    newDataRow[header] = columnArray;

    await projectService.updateProjectSection(projectId, {
      comparisons: { ...project.comparisons, dataRow: newDataRow },
      updatedAt: new Date(),
    });
  };

  const addRow = async () => {
    if (!project) return;
    const currentHeaders =
      project.comparisons.header.length > 0
        ? project.comparisons.header
        : staticHeaders;

    const newDataRow = { ...project.comparisons.dataRow };
    currentHeaders.forEach((h) => {
      newDataRow[h] = [...(newDataRow[h] || []), ""];
    });

    await projectService.updateProjectSection(projectId, {
      comparisons: {
        ...project.comparisons,
        header: currentHeaders,
        dataRow: newDataRow,
        number: (project.comparisons.number || 0) + 1,
      },
      updatedAt: new Date(),
    });
  };

  return {
    rowIndices,
    headers,
    addRow,
    removeRow,
    updateValue,
    getValue: (index: number, header: string) => dataRow[header]?.[index] || "",
    isLoading: project === undefined,
  };
};
