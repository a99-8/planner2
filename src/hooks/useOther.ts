import { useLiveQuery } from "dexie-react-hooks";
import { projectService, staticHeaders } from "@/lib/index";

export const useSettlements = (projectId: string) => {
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );

  const toggleColumn = async (columnName: string) => {
    if (!project) return;

    const currentSettlements = project.settlements || [];
    const newSettlementsTable: Record<string, any> = {
      ...project.matrix.settlementsTable,
    };
    let newSettlements: string[];

    if (currentSettlements.includes(columnName)) {
      // delete function
      newSettlements = currentSettlements.filter((col) => col !== columnName);
      delete newSettlementsTable[columnName];
    } else {
      //add function
      newSettlements = [...currentSettlements, columnName]; // update settlements
      const getColumnValues = (headerKey: string) => {
        // get row of value from comparisons
        return project.comparisons.comparison.map((c) => ({
          compNum: c.num,
          value: c.dataRow[headerKey]?.[0],
        }));
      };
      newSettlementsTable[columnName] = {
        // new settlements table
        name: columnName,
        header: project?.landsTable?.dataRow[columnName] || [],
        dataRow: {},
        settings: {
          isAuto: false,
          isInterpolated: false,
          baseGroup: 0,
          minValue: Math.min(...project?.landsTable?.dataRow[columnName]) || 0,
          maxValue: Math.max(...project?.landsTable?.dataRow[columnName]) || 0,
          groupCount: 0,
          baseSettlement: 0,
          increment: 0,
        },
      };
    }

    const newComparisonHeaders = [...staticHeaders, ...newSettlements];
    // 4. الحفظ النهائي
    await projectService.updateProjectSection(projectId, {
      settlements: newSettlements,
      comparisons: {
        ...project.comparisons,
        header: newComparisonHeaders,
      },
      "matrix.settlementsTable": newSettlementsTable,
    } as any);
  };

  return {
    selectedHeaders: project?.settlements || [],
    allAvailableColumns: project?.landsTable?.header || [],
    toggleColumn,
  };
};
