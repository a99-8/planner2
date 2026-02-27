// hooks/useMatrix/useMatrixSelectors.ts
import { finalHead, ProjectStructure } from "@/lib";
import { useMemo } from "react";

export const matrixStore = (project: ProjectStructure, settlement: string) => {
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

export const evaluationStore = (project: ProjectStructure) => {
  if (!project) return null;
  const settlements = project?.control?.settlements || [];
  const comNewHeaders = [...settlements, ...finalHead];
  const comparisonsData = project?.comparisons?.comparison || [];
  const compCount = comparisonsData.length;
  const lands = project?.landsTable || {};
  const dependencesData = project?.control?.dependences || [];
  const rowCount = Object.values(lands.tableData)[0].length ?? 0;
  const isTypeSingle = project?.summary?.isTypeSingle || false;
  const approximation = project?.summary?.approximation || 0;
  const weightCompNums = [
    ...Array.from({ length: compCount }).map((_, idx) => ({ idx })),
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
  };
};
