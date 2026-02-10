"use client";

import { useParams } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { Lands, Comparison, Evalauation, Martix } from "@/layout/layoutList";
import { ProjectDetails, StatusHandler } from "@/components/other/otherList";
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
      {/* تمرير كائن المشروع الموحد */}
      <ProjectDetails project={project} />

      <div className="mt-10 p-6 border-2 rounded-3xl">
        {/* تم تقليل الـ p-20 إلى p-6 لتناسب عرض الجداول داخل الأكورديون */}
        <Accordion
          type="multiple"
          className="w-full space-y-4"
          defaultValue={["lands"]}
        >
          {/* تمرير البيانات لكل قسم بشكل مخصص 
              ملاحظة: تأكد أن المكونات الأبناء تستقبل الـ props حسب الهيكل الجديد
          */}

          <Lands projectId={project.id} landsTable={project.landsTable} />

          <Comparison
            projectId={project.id}
            comparisons={project.comparisons}
            settlements={project.settlements} // للمقارنة بين البيانات الأصلية والتسويات
          />

          <Evalauation
            projectId={project.id}
            reference={project.reference}
            summary={project.summary}
          />

          <Martix projectId={project.id} areaControl={project.areaControl} />
        </Accordion>
      </div>
    </div>
  );
}
