import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";
import { db, ProjectStructure, projectService } from "@/lib/index";
import { match } from "ts-pattern";

export function useProjectData() {
  const params = useParams();
  const id = params.id as string;
  const project = useLiveQuery(() => projectService.getProject(id), [id]);
  const isLoading = project === undefined;
  const notFound = !isLoading && !project;

  return {
    project: project as ProjectStructure | null,
    isLoading,
    notFound,
    projectId: id,
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
            updatedAt: new Date(),
            dis: { id_sum: 0, area_sum: 0 },
            landsTable: { fileName: "", header: [], dataRow: {} },
            settlements: [],
            comparisons: {
              number: 0,
              pricePerMeter: 0,
              header: [],
              dataRow: {},
            },
            reference: {
              settlementsTable: {
                name: [],
                header: {},
                frsCol: {},
                dataRow: {},
                AutomaticColumns: true,
                ControllingValue: 0,
                columnSettings: {},
              },
            },
            summary: {
              frsCol: 0,
              secCol: {},
              frsHeader: "",
              secHeader: [],
              weighted: {
                singleORall: false,
                priceAfterSettlements: 0,
                priceAfterWeighted: 0,
                total: 0,
              },
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
