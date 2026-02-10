import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import {
  createProject,
  deleteProject,
  deleteAllProjects,
  updateProjectName,
} from "@/services/ProjectBasicService";
import { match } from "ts-pattern";

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
          return await createProject({
            id: crypto.randomUUID(),
            name: val || "مشروع جديد",
            updatedAt: new Date(),
          });
        })
        .with("delet", async () => {
          if (!projectId) return;
          return await deleteProject(projectId);
        })
        .with("rename", async () => {
          if (!projectId || !val) return;
          return await updateProjectName(projectId, val);
        })
        .with("deletAllProjects", async () => {
          if (val === "حذف جميع المشاريع") return await deleteAllProjects();
        })
        .otherwise(() => null);
    } catch (error) {
      console.error(`Failed to handle action(${btnId}):`, error);
      throw error;
    }
  };

  return { projects: projects || [], isLoading, handleAction };
};
