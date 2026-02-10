import { db } from "@/db/db";

export const projectDataService = {
  // function to update project time
  async updateProjectTimestamp(projectId: string) {
    try {
      await db.projects.update(projectId, {
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to update project timestamp:", error);
    }
  },

  async saveTable(
    projectId: string,
    tableName: string,
    formattedResult: { name: string; headers: string[]; data: any },
  ) {
    try {
      const existing = await db.projectData
        .where({ projectId, tableName })
        .first();

      const record = {
        ...(existing && { id: existing.id }),
        projectId,
        tableName,
        fileName: formattedResult.name,
        headers: formattedResult.headers,
        data: formattedResult.data,
        updatedAt: Date.now(),
      };

      const result = await db.projectData.put(record);
      await this.updateProjectTimestamp(projectId);
      return result;
    } catch (error) {
      console.error("Error in saveTable service:", error);
      throw error;
    }
  },

  async deleteTable(projectId: string, tableName: string) {
    try {
      const record = await db.projectData
        .where({ projectId, tableName })
        .first();

      if (record?.id) {
        await db.projectData.delete(record.id);
        await this.updateProjectTimestamp(projectId);
      }
    } catch (error) {
      console.error("Error in deleteTable service:", error);
      throw error;
    }
  },

  async getTable(projectId: string, tableName: string) {
    try {
      return await db.projectData.where({ projectId, tableName }).first();
    } catch (error) {
      console.error("Error in getTable service:", error);
      throw error;
    }
  },

  async getAllProjectTables(projectId: string) {
    return await db.projectData.where("projectId").equals(projectId).toArray();
  },
};
