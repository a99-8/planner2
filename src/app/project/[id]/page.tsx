"use client";

import { useParams } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { Lands, Comparison, Evalauation, Martix } from "@/layout/layoutList";
import ProjectDetails from "@/components/project/projectDetails";
import StatusHandler from "@/components/custom/StatusHandler";
import { useProjectData } from "@/hooks/useProjectMain";

export default function ProjectPage() {
  const { id } = useParams();
  const { project, isLoading } = useProjectData();

  if (isLoading) return <StatusHandler type="loading" />;

  if (!project) {
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
          defaultValue={["lands"]}
        >
          <Lands projectId={project.id} landsTable={project.landsTable} />
          <Comparison projectId={project.id} />
          <Martix projectId={project.id} />
          <Evalauation
            projectId={project.id}
            reference={project.reference}
            summary={project.summary}
          />
        </Accordion>
      </div>
    </div>
  );
}
