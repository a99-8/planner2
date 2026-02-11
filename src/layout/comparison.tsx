import { ComparisonTable } from "@/components/main/comparisonTable";
import { SettlementsPopover } from "@/components/other/settlementsTable";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Comparison = ({ projectId }: { projectId: string }) => {
  return (
    <AccordionItem value={"Comparison"}>
      <AccordionTrigger className="text-xl font-bold">
        المقارنات والتسويات (Comparisons and settlements)
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-6 space-y-6">
          <SettlementsPopover projectId={projectId} />
          <div className="mt-4">
            <ComparisonTable projectId={projectId} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Comparison;
