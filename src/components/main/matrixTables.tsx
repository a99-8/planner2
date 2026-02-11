import { useMatrix } from "@/hooks/useLayouts";
import { MatrixControl } from "@/components/other/matrixControl";

const matrixTables = ({ projectId }: { projectId: string }) => {
  const { selectedHeaders } = useMatrix(projectId);
  return (
    <div>
      {selectedHeaders.map((header, idx) => (
        <MatrixControl key={idx} projectId={projectId} columnName={header} />
      ))}
    </div>
  );
};

export default matrixTables;
