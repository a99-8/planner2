import { useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { formatCSVData, parseCSV, projectService } from "@/lib";

export const useComparison = (projectId: string) => {
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );
  const currentComparisons = project?.comparisons?.comparison || [];
  const copNum = currentComparisons.length;

  const addCom = async () => {
    if (!project) return;
    const newComp = {
      num: copNum + 1,
      dataRow: {},
    };
    const updatedComparisonArray = [...currentComparisons, newComp];
    await projectService.updateProjectSection(projectId, {
      comparisons: {
        ...project.comparisons,
        comparison: updatedComparisonArray,
      },
      updatedAt: new Date(),
    } as any);
  };

  const deleteCom = async (num: number) => {
    if (!project) return;
    const updatedComparisonArray = currentComparisons
      .filter((c) => c.num !== num)
      .map((c, index) => ({ ...c, num: index + 1 }));

    await projectService.updateProjectSection(projectId, {
      comparisons: {
        ...project.comparisons,
        comparison: updatedComparisonArray,
      },
      updatedAt: new Date(),
    } as any);
  };

  const handleInputChange = async (
    num: number,
    colName: string,
    newValue: any,
  ) => {
    if (!project) return "";
    const updatedData = currentComparisons.map((item) => {
      if (item.num === num) {
        return {
          ...item,
          dataRow: { ...item.dataRow, [colName]: newValue },
        };
      }
      return item;
    });

    await projectService.updateProjectSection(projectId, {
      comparisons: {
        ...project.comparisons,
        comparison: updatedData,
      },
      updatedAt: new Date(),
    } as any);
  };

  const getCellValue = (num: number, colName: string): string => {
    if (!project) return "";
    const comp = project.comparisons.comparison.find((c) => c.num === num);
    const value = comp?.dataRow[colName];

    if (Array.isArray(value)) {
      return value[0] ?? "";
    }

    return value ?? "";
  };

  return {
    copNum,
    headers: project?.comparisons?.header || [],
    comparisonData: currentComparisons,
    addCom,
    deleteCom,
    getCellValue,
    handleInputChange,
  };
};

export const useSections = (projectId: string) => {
  // Defining variables
  const fileInputRef = useRef<HTMLInputElement>(null);
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );
  const comps = project?.comparisons?.comparison || [];
  //====================================================
  // general update function
  const update = (data: any) =>
    projectService.updateProjectSection(projectId, {
      ...data,
      updatedAt: new Date(),
    });
  //====================================================
  // useLands sections
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { data, name, headers } = await parseCSV(file);
    const fData = formatCSVData(name, data, headers);
    await update({ hasData: true, landsTable: { ...fData } });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const clear = () =>
    update({
      hasData: false,
      landsTable: { fileName: "", header: [], dataRow: {} },
    });
  //====================================================
  // useComparison section
  const compActions = {
    add: () =>
      update({
        comparisons: {
          ...project?.comparisons,
          comparison: [...comps, { num: comps.length + 1, dataRow: {} }],
        },
      }),
    delete: (num: number) =>
      update({
        comparisons: {
          ...project?.comparisons,
          comparison: comps
            .filter((c) => c.num !== num)
            .map((c, i) => ({ ...c, num: i + 1 })),
        },
      }),
    updateCell: (num: number, col: string, val: any) =>
      update({
        comparisons: {
          ...project?.comparisons,
          comparison: comps.map((c) =>
            c.num === num ? { ...c, dataRow: { ...c.dataRow, [col]: val } } : c,
          ),
        },
      }),
    getValue: (num: number, col: string) => {
      const val = comps.find((c) => c.num === num)?.dataRow[col];
      return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
    },
  };
  //====================================================
  // useMartix section
  //====================================================
  // useEvalauation
  //====================================================
  return {
    project,
    isLoading: project === undefined,
    hasData: project?.hasData || false,
    lands: {
      ...project?.landsTable,
      handleFileChange,
      fileInputRef,
      openPicker: () => fileInputRef.current?.click(),
      clear,
    },
    comparisons: {
      data: comps,
      count: comps.length,
      headers: project?.comparisons?.header || [],
      ...compActions,
    },
  };
};
