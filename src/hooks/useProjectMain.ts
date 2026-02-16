import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";
import {
  db,
  ProjectStructure,
  projectService,
  staticHeaders,
} from "@/lib/index";
import { match } from "ts-pattern";

export function useProjectData() {
  const params = useParams();
  const id = params?.id as string;

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
            hasData: false,
            updatedAt: new Date(),
            dis: { id_sum: 0, area_sum: 0 },
            landsTable: { fileName: "", header: [], dataRow: {} },
            settlements: [],
            comparisons: {
              header: [],
              comparison: [],
            },
            reference: {
              settlementsTable: {
                name: "",
                header: staticHeaders,
                frRow: [],
                dataRow: {},
                settings: {
                  isAuto: false,
                  isInterpolated: false,
                  baseGroup: 0,
                  maxValue: 0,
                  minValue: 0,
                  groupCount: 0,
                  baseSettlement: 0,
                  increment: 0,
                },
              },
            },
            summary: {
              rowNum: {
                comparisonsinfo: {
                  number: 0,
                  pricePerMeter: 0,
                  Weight: 0,
                  totleSettlements: 0,
                  priceAfterSettlements: 0,
                  priceAfterWeighted: 0,
                },
                totlePrice: 0,
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
