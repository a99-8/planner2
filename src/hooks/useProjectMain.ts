import { useLiveQuery } from "dexie-react-hooks";
import {
  db,
  ProjectStructure,
  projectService,
  staticHeaders,
} from "@/lib/index";
import { match } from "ts-pattern";
import { useCallback } from "react";
import { produce } from "immer";

export function useProjectData(id: string) {
  const project = useLiveQuery(() => {
    if (!id) return Promise.resolve(null);
    return projectService.getProject(id);
  }, [id]);

  const isLoading = project === undefined;
  const notFound = !isLoading && (!project || !id);

  return {
    project: project as ProjectStructure | null,
    isLoading,
    notFound,
  };
}

export const useProjects = () => {
  const projects = useLiveQuery(async () => {
    return await db.projects.toArray();
  }, []);

  const isLoading = projects === undefined;

  const handleAction = async (
    btnId: string,
    val?: string,
    projectId?: string,
  ) => {
    try {
      return await match(btnId)
        .with("create", async () => {
          const newProject: ProjectStructure = {
            id: crypto.randomUUID(),
            name: val || "مشروع جديد",
            hasData: false,
            updatedAt: new Date(),
            control: {
              type: "Default",
              use: "Default",
              settlements: [],
              dependences: [],
              group: [],
              Interpolated: [],
              dis: {},
            },
            landsTable: {
              fileName: "",
              tableData: {},
            },
            comparisons: {
              header: staticHeaders,
              comparison: [],
            },
            matrix: {
              settlementsTable: {},
            },
            summary: {
              isTypeSingle: true,
              approximation: 0,
              totalfordependences: {},
              rowData: {},
              compweight: {},
              rowNum: {},
            },
          };
          return await projectService.saveProject(newProject);
        })
        .with("delet", async () => {
          if (!projectId) return;
          return await projectService.deleteProject(projectId);
        })
        .with("rename", async () => {
          if (!projectId || !val) return;
          return await projectService.updateProjectSection(projectId, {
            name: val,
          });
        })
        .with("deletAllProjects", async () => {
          if (val === "حذف جميع المشاريع")
            return await projectService.clearAllData();
        })
        .otherwise(() => null);
    } catch (error) {
      console.error(`Failed to handle action(${btnId}):`, error);
      throw error;
    }
  };

  return { projects: projects || [], isLoading, handleAction };
};

export const useProjectUpdate = (
  projectId: string,
  project: ProjectStructure,
) => {
  return useCallback(
    async (recipe: (draft: ProjectStructure) => void) => {
      if (!project) return null;

      const nextState = produce(project, recipe);

      return await projectService.updateProjectSection(projectId, {
        ...nextState,
      });
    },
    [projectId, project],
  );
};
