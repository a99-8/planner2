import Dexie, { Table } from "dexie";
import { ProjectStructure } from "@/lib/projectStructure";

export class MyDatabase extends Dexie {
  projects!: Table<ProjectStructure>;

  constructor() {
    super("ProjectsDatabase");

    this.version(2).stores({
      projects: "id, name, updatedAt",
    });
  }
}

export const db = new MyDatabase();
