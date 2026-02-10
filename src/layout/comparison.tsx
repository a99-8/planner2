import { SettlementsPopover } from "@/components/main/settlementsTable";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Project } from "@/types/userTypes";

const Comparison = (project: Project) => {
  return (
    <AccordionItem value={"Comparison"}>
      <AccordionTrigger>Comparison</AccordionTrigger>
      <AccordionContent>
        <SettlementsPopover projectId={project.id} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default Comparison;
