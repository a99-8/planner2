"use client";

import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProjectDetails from "@/components/project/projectDetails";
import StatusHandler from "@/components/custom/StatusHandler";
import { useProjectData } from "@/hooks/useProjectMain";
import { sections } from "@/components/main/sectionsList";

export default function ProjectPage() {
  const { id } = useParams();
  const { project, isLoading, notFound } = useProjectData();

  if (isLoading) return <StatusHandler type="loading" />;

  if (notFound || !project) {
    return (
      <StatusHandler
        type="noData"
        message="عذراً، لم يتم العثور على هذا المشروع"
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6" dir="rtl">
      <ProjectDetails project={project} />

      <div className="mt-10 p-6 border-2 rounded-3xl">
        <Accordion
          type="multiple"
          className="w-full space-y-4"
          defaultValue={["sections"]}
        >
          {sections.map(({ name, Component }, index) => (
            <AccordionItem value={name} key={name}>
              <AccordionTrigger className="text-xl font-bold" key={index}>
                {name}
              </AccordionTrigger>
              <AccordionContent key={`${name}-content-${index}`}>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {/* هنا نقوم بتمرير البارامتر الموحد للجميع مرة واحدة */}
                    <Component projectId={id as string} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
