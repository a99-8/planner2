import Dexie, { Table } from "dexie";
import { FormattedProjectData, Project } from "@/types/userTypes";

export class MyDatabase extends Dexie {
  projects!: Table<Project>;
  projectData!: Table<FormattedProjectData>;
  projectSettlement!: Table<{
    id?: number;
    projectId: string;
    headers: string[];
  }>;

  constructor() {
    super("ProjectsDatabase");

    this.version(1).stores({
      projects: "id, name, updatedAt, activity",
      projectData: "++id, projectId, [projectId+tableName], fileName",
      projectSettlement: "++id, projectId, headers",
    });
  }
}

export const db = new MyDatabase();
