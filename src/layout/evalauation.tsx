import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Project } from "@/types/userTypes";

const Evalauation = (project: Project) => {
  return (
    <AccordionItem value={"Evalauation"}>
      <AccordionTrigger>Evalauation</AccordionTrigger>
      <AccordionContent>Lands table wiht id: {project.id}</AccordionContent>
    </AccordionItem>
  );
};

export default Evalauation;
