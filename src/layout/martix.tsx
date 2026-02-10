import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Project } from "@/types/userTypes";

const Martix = (project: Project) => {
  return (
    <AccordionItem value={"Martix"}>
      <AccordionTrigger>Martix</AccordionTrigger>
      <AccordionContent>Lands table wiht id: {project.id}</AccordionContent>
    </AccordionItem>
  );
};

export default Martix;
