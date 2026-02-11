import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MatrixTables from "@/components/main/matrixTables";

const Martix = ({ projectId }: { projectId: string }) => {
  return (
    <AccordionItem value={"Martix"}>
      <AccordionTrigger className="text-xl font-bold">
        مصفوفة التحكم (Matrix)
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <MatrixTables projectId={projectId} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Martix;
