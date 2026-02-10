import { db } from "@/db/db";

export const projectSettlementService = {
  async updateProjectTimestamp(projectId: string) {
    try {
      await db.projects.update(projectId, {
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to update project timestamp:", error);
    }
  },

  async saveTable(projectId: string, headers: string[]) {
    try {
      const existing = await this.getTable(projectId);

      const record = {
        ...(existing && { id: existing.id }), // الحفاظ على الـ ID القديم للتحديث بدل الإضافة
        projectId,
        headers: headers,
        updatedAt: Date.now(),
      };

      await db.projectSettlement.put(record);
      // تحديث توقيت المشروع الأساسي
      await db.projects.update(projectId, { updatedAt: new Date() });
    } catch (error) {
      console.error("Save Error:", error);
      throw error;
    }
  },

  async deleteTable(projectId: string, tableName: string) {
    try {
      const record = await db.projectSettlement
        .where("projectId")
        .equals(projectId)
        .first();

      if (record?.id) {
        await db.projectSettlement.delete(record.id);
        await this.updateProjectTimestamp(projectId);
      }
    } catch (error) {
      console.error("Error in deleteTable service:", error);
      throw error;
    }
  },

  async getTable(projectId: string) {
    return await db.projectSettlement
      .where("projectId")
      .equals(projectId)
      .first();
  },

  async getAllProjectTables(projectId: string) {
    return await db.projectSettlement
      .where("projectId")
      .equals(projectId)
      .toArray();
  },
};
