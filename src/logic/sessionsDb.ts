// src/logic/sessionsDb.ts
import Dexie, { Table } from "dexie";

export interface EvaluationSession {
  id: string; // uuid
  name: string;
  createdAt: number;
  updatedAt: number;
  snapshot: any;
  data: any[];
  selectedColumns: string[];
  rowIds: number[];
  comparisons: Record<string, any>;
  matrix: Record<string, any>;
}

class SessionsDB extends Dexie {
  sessions!: Table<EvaluationSession, string>;

  constructor() {
    super("evaluation_sessions_db");
    this.version(1).stores({
      sessions: "id, name, createdAt, updatedAt",
    });
  }
}

export const sessionsDb = new SessionsDB();
