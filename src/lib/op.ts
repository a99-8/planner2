import {
  updateSettingsProps,
  getAverage,
  projectService,
  ProjectStructure,
  actionsList,
} from "@/lib";

export const sync = (project: ProjectStructure) => {
  const update = async (recipe: (draft: ProjectStructure) => void) => {
    return await projectService.updateProjectSection(project.id, recipe);
  };
  // واجهة الـ API النهائية
  return {
    // دوال للقراءة (مباشرة من الكائن project الحالي)
    get: {
      //lands
      LandsTableData: () => project.landsTable.tableData,
      //control
      checked: (columnName: string, actions: string) => {
        if (!project?.control) return false;
        const key = `${columnName}_${actions}`;
        if (actionsList.includes(actions)) {
          return (
            !!project.control.dis?.[key] ||
            (project.control.dependences?.includes(columnName) &&
              actions === "dependences")
          );
        }
        const target = project.control[actions as keyof typeof project.control];
        return Array.isArray(target) ? target.includes(columnName) : false;
      },
      //comparisons
      comparisons: () => project.comparisons.comparison,
      ComparisonsValue: (num: number, col: string) => {
        const val = project.comparisons.comparison.find(
          (c: any) => c.num === num,
        )?.dataRow[col];
        return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
      },
      //matrix
      matrixCell: (
        currentTable: any,
        valueLands: number,
        setInputId: number,
      ) => {
        const cellKey = `${valueLands}_${setInputId}`;
        const val = currentTable?.dataRow?.[cellKey];
        return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
      },
      //evaluation
      isTypeSingle: () => project.summary.isTypeSingle,
      approximation: () => project.summary.approximation,
      weightForComp: (compIdx: number) => project.summary.compweight[compIdx],
      weightForRow: (rowIdx: number, key: string) =>
        project?.summary?.rowData?.[rowIdx]?.[key] ?? 0,
      totalAfterRound: (rowIdx: number) =>
        (project.summary.rowData[rowIdx] as any)?.totalAfterRound,
    },
    // دوال للكتابة (تستخدم update لتحديث الحالة)
    set: {
      //lands
      LandsTableData: (columns: any, fileName: string) =>
        update((d) => {
          d.hasData = true;
          d.landsTable.fileName = fileName;
          d.landsTable.tableData = columns;
        }),
      clearLandsTable: () =>
        update((d) => {
          d.hasData = false;
          d.landsTable.fileName = "";
          d.landsTable.tableData = {};
        }),
      //control
      //comparisons
      addComparison: () =>
        update((d) => {
          const newEntry = {
            num: (d.comparisons.comparison?.length || 0) + 1,
            dataRow: {},
          };
          d.comparisons.comparison.push(newEntry);
        }),
      deleteComparison: (num: number) =>
        update((d) => {
          d.comparisons.comparison = project.comparisons.comparison
            .filter((c: any) => c.num !== num)
            .map((c: any, i: number) => ({ ...c, num: i + 1 }));
        }),
      ComparisonsValue: (num: number, col: string, val: any) =>
        update((d) => {
          d.comparisons.comparison = d.comparisons.comparison.map((c: any) =>
            c.num === num ? { ...c, dataRow: { ...c.dataRow, [col]: val } } : c,
          );
        }),
      //matrix
      updateSettings: ({
        settlement,
        newHeader,
        next,
        nums,
        step,
        uniqueHeader,
      }: updateSettingsProps) =>
        update((d) => {
          const table = d.matrix.settlementsTable[settlement];
          table.header = newHeader;
          table.settings = {
            ...next,
            maxValue: Math.max(...nums),
            minValue: Math.min(...nums),
            groupCount:
              step > 0
                ? Math.ceil((Math.max(...nums) - Math.min(...nums)) / step) + 1
                : 0,
            average: getAverage(uniqueHeader),
          };
        }),
      matrixCell: (
        settlement: string,
        valueLands: number,
        setInputId: number,
        val: any,
      ) => {
        const cellKey = `${valueLands}_${setInputId}`;
        update((d) => {
          d.matrix.settlementsTable[settlement].dataRow[cellKey] = val;
        });
      },
      matrixData: (settlement: string, data: any) =>
        update((d) => {
          d.matrix.settlementsTable[settlement].dataRow = data;
        }),
      //evaluation
      isTypeSingle: (val: boolean) =>
        update((d) => {
          d.summary.isTypeSingle = val;
        }),
      approximation: (val: number) =>
        update((d) => {
          d.summary.approximation = val;
        }),
      weightForComp: (compIdx: number, val: number) =>
        update((d) => {
          d.summary.compweight[compIdx] = val;
        }),
      // src/lib/op.ts

      weightForRow: (rowIdx: number, key: string, val: number) =>
        update((d) => {
          if (!d.summary.rowData) d.summary.rowData = [];
          if (!d.summary.rowData[rowIdx]) {
            d.summary.rowData[rowIdx] = { totalAftarRound: 0 };
          }
          d.summary.rowData[rowIdx][key] = val;
        }),
      totalAfterRound: (rowIdx: number, val: number) =>
        update((d) => {
          const row = d.summary.rowData[rowIdx];
          if (row) (row as any).totalAfterRound = val;
        }),
    },
  };
};
