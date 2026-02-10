import { useLiveQuery } from "dexie-react-hooks";
import { projectService } from "@/lib/index";

export const useSettlements = (projectId: string) => {
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );
  const allAvailableColumns = project?.landsTable?.header || [];
  const selectedHeaders = project?.settlements || [];
  const toggleColumn = async (columnName: string) => {
    if (!project) return;

    try {
      const newSelection = selectedHeaders.includes(columnName)
        ? selectedHeaders.filter((col) => col !== columnName)
        : [...selectedHeaders, columnName];
      await projectService.updateProjectSection(projectId, {
        settlements: newSelection,
      });
    } catch (error) {
      console.error("خطأ أثناء تحديث خيارات التسوية:", error);
    }
  };

  return {
    allAvailableColumns,
    selectedHeaders,
    toggleColumn,
    isLoading: project === undefined,
  };
};
