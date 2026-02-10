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

  const handleAction = async (btn: any) => {
    try {
      return await match(btn)
        .with({ id: "create" }, async (item: any) => {
          return await createProject({
            id: crypto.randomUUID(),
            name: item.inputValue || "مشروع جديد",
            updatedAt: new Date(),
          });
        })
        .with({ id: "deletAllProjects" }, async () => {
          return await deleteAllProjects();
        })
        .with({ id: "rename" }, async (item: any) => {
          return await updateProjectName(item.projectId, item.newName);
        })
        .with({ id: "delet" }, async (item: any) => {
          return await deleteProject(item.projectId);
        })
        .otherwise(() => {
          console.warn("No action defined for this button");
          return null;
        });
    } catch (error) {
      console.error("Failed to handle action:", error);
      throw error;
    }
  };

  const addProject = async (name: string) => {
    try {
      const id = crypto.randomUUID();
      await createProject({
        id,
        name,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to add project:", error);
      throw error;
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await deleteAllProjects();
    } catch (error) {
      console.error("Failed to clear projects:", error);
      throw error;
    }
  };

  const renameProject = async (id: string, newName: string) => {
    try {
      await updateProjectName(id, newName);
    } catch (error) {
      console.error("Failed to rename project:", error);
      throw error;
    }
  };

  return {
    projects: projects || [], // نرجع مصفوفة فارغة في حالة التحميل أو إذا كانت القاعدة فارغة
    isLoading,
    addProject,
    removeProject,
    clearAll,
    renameProject,
  };
};
