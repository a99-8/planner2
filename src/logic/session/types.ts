export interface SessionState {
  snapshot: any;
  data: any[];
  selectedColumns: string[];
  rowIds: number[];
  comparisons?: Record<string, any>;
  matrix?: Record<string, any>;
}

export interface EvaluationSession {
  id: string;
  name: string;
  state: SessionState;
  createdAt: number;
  updatedAt: number;
}
