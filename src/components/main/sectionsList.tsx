import { LandsTable } from "@/components/main/landsTable";
import { ComparisonTable } from "@/components/main/comparisonTable";
import { MatrixTables } from "@/components/main/matrixTables";
import { EvaluationTable } from "@/components/main/evaluationTable";

export const sections = [
  { name: "lands", Component: LandsTable },
  { name: "comparison", Component: ComparisonTable },
  { name: "matrix", Component: MatrixTables },
  { name: "evaluation", Component: EvaluationTable },
];
