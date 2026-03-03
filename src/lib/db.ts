import Dexie, { Table } from "dexie";
import { ProjectStructure } from "@/lib/projectStructureAndTypes";

export class MyDatabase extends Dexie {
  projects!: Table<ProjectStructure>;

  constructor() {
    super("ProjectsDatabase");

    this.version(1).stores({
      projects: "id, name, updatedAt",
    });
  }
}

export const db = new MyDatabase();
