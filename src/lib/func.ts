// hooks/useMatrix/useMatrixSelectors.ts
import { disCells, finalHead, ProjectStructure } from "@/lib";
import { useMemo } from "react";

export const matrixData = (project: ProjectStructure, settlement: string) => {
  if (!project) return null;

  const currentTable = project?.matrix?.settlementsTable?.[settlement];
  const settings = currentTable?.settings || {};
  const average = settings.average || 0;
  const isDataValid = settings.maxValue !== 0 || settings.minValue !== 0;
  const newDataRow = { ...currentTable?.dataRow };

  const frRow = Array.from(
    new Set(
      currentTable?.header || project?.landsTable?.tableData?.settlement || [],
    ),
  ).sort((a, b) =>
    String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  const sortedRows = [...frRow].sort((a, b) => Number(a) - Number(b));
  const midIndex = Math.floor((sortedRows.length - 1) / 2);

  const frCol =
    project?.comparisons?.comparison?.map((c: any) => c.dataRow[settlement]) ||
    [];

  return {
    currentTable,
    settings,
    average,
    isDataValid,
    frRow,
    frCol,
    newDataRow,
    sortedRows,
    midIndex,
    isAuto: (project.control?.group || []).includes(settlement),
    isInterpolated: (project.control?.Interpolated || []).includes(settlement),
  };
};

export const evaluationData = (project: ProjectStructure) => {
  return useMemo(() => {
    if (!project) return null;
    // -----------------
    // تعريف المتغيرات العامة
    // -----------------

    const settlements = project?.control?.settlements || [];
    const comNewHeaders = [...settlements, ...finalHead];
    const comparisonsData = project?.comparisons?.comparison || [];
    const compCount = comparisonsData.length;
    const lands = project?.landsTable || {};
    const dependencesData = project?.control?.dependences || [];
    const rowCount = Object.values(lands.tableData)[0].length ?? 0;
    const isTypeSingle = project?.summary?.isTypeSingle || false;
    const approximation = project?.summary?.approximation || 0;
    const depTotals: Record<string, number> = {};
    dependencesData.forEach((col) => (depTotals[col] = 0));
    const safeApprox = approximation > 0 ? approximation : 1;
    const weightCompNums = [
      ...Array.from({ length: compCount }).map((_, idx) => ({ idx })),
    ];

    // -----------------
    // تعريف رؤس الجدول
    // -----------------
    const mainHeaders = [
      { label: "بيانات جدول الأراضي", colSpan: settlements.length + 1 },
      ...Array.from({ length: compCount }).map((_, idx) => ({
        label: `المقارنة ${idx + 1}`,
        colSpan: settlements.length + 1,
      })),
      { label: "المرجح الموزون ", colSpan: compCount },
      { label: "القيمة بعد التقريب", colSpan: 2 },
    ];
    if (dependencesData.length > 0) {
      mainHeaders.push({
        label: "القيمة النهائية",
        colSpan: dependencesData.length,
      });
    }

    const subHeaders = [
      // بيانات الاراضي
      "#",
      ...settlements,
      // بيانات تسويات المقارنات
      ...Array.from({ length: compCount }).flatMap(() =>
        settlements.map((header) => `تسوية : ${header}`),
      ),
      // سعر المتر لكل مقارنة
      ...Array.from({ length: compCount }).flatMap(
        () => "سعر المتر بعد التسويات",
      ),
      // المرجح الموزون لكل مقارنة
      ...Array.from({ length: compCount }).flatMap(
        (_, index) => `المرجح الموزون للمقارنة : ${index + 1}`,
      ),
      // الاعمدة النهائية
      "قيمة المتر النهائية",
      "قيمة المتر بعد التقريب",
      // قسم الاعتماديات
      ...dependencesData.map((col) => `سعر المتر * ${col}`),
    ];
    return {
      settlements,
      comNewHeaders,
      comparisonsData,
      compCount,
      lands,
      dependencesData,
      rowCount,
      isTypeSingle,
      approximation,
      weightCompNums,
      subHeaders,
      mainHeaders,
      depTotals,
      safeApprox,
    };
  }, [project]);
};

export const controlsData = (project: ProjectStructure) => {
  return useMemo(() => {
    if (!project) return null;

    const landHeader = project?.landsTable?.tableData
      ? Object.keys(project.landsTable.tableData)
      : [];

    const dis = disCells.flatMap((cell: any) =>
      cell.group === "dis" ? `${cell.name}(${cell.id})` : `${cell.name}`,
    );

    const subHeaders = ["جدول الاراضي", ...dis];

    return {
      landHeader,
      subHeaders,
    };
  }, [project]);
};
