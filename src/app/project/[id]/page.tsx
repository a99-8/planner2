"use client";

import { useParams } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { Lands, Comparison, Evalauation, Martix } from "@/layout/layoutList";
import { ProjectDetails, StatusHandler } from "@/components/other/otherList";
import useProjectPage from "@/hooks/main/usePrjectPage";

export default function ProjectPage() {
  const { id } = useParams();
  const { project, loading } = useProjectPage();

  if (loading) return <StatusHandler type="loading" />;

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

      <div className="mt-10 p-20 border-2 rounded-3xl text-center">
        <Accordion type="multiple" className="w-auto" defaultValue={["layout"]}>
          <Lands {...project} />
          <Comparison {...project} />
          <Evalauation {...project} />
          <Martix {...project} />
        </Accordion>
      </div>
    </div>
  );
}
