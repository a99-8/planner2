import { db } from "@/lib/db";
import { ProjectStructure } from "@/lib/projectStructure";

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
  async getProject(id: string): Promise<ProjectStructure | undefined> {
    return await db.projects.get(id);
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
    sectionData: Partial<ProjectStructure>,
  ): Promise<void> {
    try {
      await db.projects.update(id, {
        ...sectionData,
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
