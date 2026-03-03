import { db } from "@/lib/db";
import { ProjectStructure } from "@/lib/projectStructureAndTypes";
import { produce } from "immer";

export const projectService = {
  // 1. إنشاء أو تحديث مشروع كامل
  async saveProject(project: ProjectStructure): Promise<void> {
    try {
      project.updatedAt = new Date(); // تحديث تلقائي للوقت
      await db.projects.put(project);
    } catch (error) {
      console.error("Failed to save project:", error);
      throw error;
    }
  },

  // 2. الحصول على مشروع واحد بواسطة ID
  async getProject(id: string): Promise<ProjectStructure | null> {
    const project = await db.projects.get(id);
    return project ?? null;
  },

  // 3. الحصول على جميع المشاريع
  async getAllProjects(): Promise<ProjectStructure[]> {
    return await db.projects.toArray();
  },

  // 4. حذف مشروع
  async deleteProject(id: string): Promise<void> {
    await db.projects.delete(id);
  },

  // 5. تحديث جزئي (مثلاً تحديث الـ landsTable فقط دون المساس بالباقي)
  async updateProjectSection(
    id: string,
    recipe: (draft: ProjectStructure) => void,
  ): Promise<void> {
    try {
      const current = await db.projects.get(id); // اجلب النسخة الحالية
      const nextState = produce(current, recipe); // طبّق التعديلات
      await db.projects.update(id, {
        ...nextState,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  },

  // 6. حذف كل البيانات
  async clearAllData(): Promise<void> {
    await db.projects.clear();
  },
};
