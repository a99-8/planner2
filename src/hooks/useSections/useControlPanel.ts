import { useMemo, useCallback } from "react";
import {
  ConvertingTextArrToNumberArr,
  disCells,
  mainHeaders,
  ProjectStructure,
  staticHeaders,
} from "@/lib";

export const useControlsSection = (
  project: ProjectStructure,
  update: (recipe: (draft: ProjectStructure) => void) => Promise<any>,
) => {
  const landHeader = useMemo(
    () =>
      project?.landsTable?.tableData
        ? Object.keys(project.landsTable.tableData)
        : [],
    [project?.landsTable?.tableData],
  );

  const subHeaders = useMemo(() => {
    const dis = disCells.flatMap((cell: any) =>
      cell.group === "dis" ? `${cell.name}(${cell.id})` : `${cell.name}`,
    );
    return ["جدول الاراضي", ...dis];
  }, []);

  const isDataValid = useCallback(
    (columnName: string) => {
      const values = project?.landsTable?.tableData?.[columnName];
      if (!values) return false;
      return ConvertingTextArrToNumberArr(values).length === values.length;
    },
    [project?.landsTable?.tableData],
  );

  const getCheak = useCallback(
    (columnName: string, actions: string) => {
      if (!project?.control) return false;
      const key = `${columnName}_${actions}`;
      if (
        ["min", "max", "avg", "mid", "count", "total", "dependences"].includes(
          actions,
        )
      ) {
        return (
          !!project.control.dis?.[key] ||
          (project.control.dependences?.includes(columnName) &&
            actions === "dependences")
        );
      }
      const target = project.control[actions as keyof typeof project.control];
      return Array.isArray(target) ? target.includes(columnName) : false;
    },
    [project?.control],
  );

  const toggleColumn = useCallback(
    async (columnName: string, actions: string) => {
      await update((draft) => {
        if (!draft.control) return;

        const columnData =
          ConvertingTextArrToNumberArr(
            project.landsTable.tableData[columnName],
          ) || [];

        switch (actions) {
          case "settlements": {
            const current = draft.control.settlements || [];
            const isExist = current.includes(columnName);
            draft.control.settlements = isExist
              ? current.filter((c) => c !== columnName)
              : [...current, columnName];
            draft.comparisons.header = [
              ...staticHeaders,
              ...draft.control.settlements,
            ];
            if (isExist) delete draft.matrix.settlementsTable[columnName];
            else {
              draft.matrix.settlementsTable[columnName] = {
                name: columnName,
                header: columnData,
                dataRow: {},
                settings: {
                  baseGroup: 0,
                  minValue: Math.min(...columnData),
                  maxValue: Math.max(...columnData),
                  groupCount: 0,
                  baseSettlement: 0,
                  increment: 0,
                  average: 0,
                  incrementEvery: 0,
                },
              };
            }
            break;
          }
          case "dependences": {
            const current = draft.control.dependences || [];
            const isExist = current.includes(columnName);
            draft.control.dependences = isExist
              ? current.filter((c) => c !== columnName)
              : [...current, columnName];
            if (isExist)
              delete draft.control.dis?.[`${columnName}_dependences`];
            // الحساب سيتم تلقائياً في الهوك الآخر
            break;
          }
          case "group":
          case "Interpolated": {
            const current = draft.control[actions] || [];
            draft.control[actions] = current.includes(columnName)
              ? current.filter((c) => c !== columnName)
              : [...current, columnName];
            break;
          }
          default: {
            const key = `${columnName}_${actions}`;
            if (!draft.control.dis) draft.control.dis = {};
            if (draft.control.dis[key] !== undefined)
              delete draft.control.dis[key];
            else {
              const sorted = [...columnData].sort((a, b) => a - b);
              const sum = columnData.reduce((a, b) => a + b, 0);
              const stats: any = {
                min: Math.min(...columnData),
                max: Math.max(...columnData),
                avg: sum / (columnData.length || 1),
                total: sum,
                count: columnData.length,
                mid:
                  sorted.length % 2 !== 0
                    ? sorted[Math.floor(sorted.length / 2)]
                    : (sorted[sorted.length / 2 - 1] +
                        sorted[sorted.length / 2]) /
                      2,
              };
              draft.control.dis[key] = stats[actions] || 0;
            }
          }
        }
      });
    },
    [project, update],
  );

  return useMemo(
    () => ({
      mainHeaders,
      subHeaders,
      landHeader,
      disCells,
      toggleColumn,
      getCheak,
      isDataValid,
    }),
    [landHeader, subHeaders, toggleColumn, getCheak, isDataValid],
  );
};
