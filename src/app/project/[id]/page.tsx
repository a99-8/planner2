"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProjectDetails from "@/components/project/projectDetails";
import StatusHandler from "@/components/custom/StatusHandler";
import { useProjectData } from "@/hooks/useProjectMain";
import { useParams } from "next/navigation";
import { LandsTable } from "@/components/main/landsTable";
import { ControlPanel } from "@/components/main/controlPanel";
import { ComparisonTable } from "@/components/main/comparisonTable";
import { MatrixTables } from "@/components/main/matrixTables";
import { EvaluationTable } from "@/components/main/evaluationTable";

export default function ProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const { project, isLoading, notFound } = useProjectData(id);

  if (isLoading) return <StatusHandler type="loading" />;

  if (notFound || !project) {
    return <StatusHandler type="projectNotFound" />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6" dir="rtl">
      <ProjectDetails {...project} />

      <div className="mt-10 p-6 border-2 rounded-3xl">
        <Accordion
          type="multiple"
          className="w-full space-y-4"
          defaultValue={["sections"]}
        >
          {/*----------------------------------------------------------*/}
          <AccordionItem value={"LandsTable"}>
            <AccordionTrigger className="text-xl font-bold">
              LandsTable
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-6 space-y-4">
                <LandsTable {...project} />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/*----------------------------------------------------------*/}
          <AccordionItem value={"ControlPanel"}>
            <AccordionTrigger className="text-xl font-bold">
              ControlPanel
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-6 space-y-4">
                <ControlPanel {...project} />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/*----------------------------------------------------------*/}
          <AccordionItem value={"ComparisonTable"}>
            <AccordionTrigger className="text-xl font-bold">
              ComparisonTable
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-6 space-y-4">
                <ComparisonTable {...project} />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/*----------------------------------------------------------*/}
          <AccordionItem value={"MatrixTables"}>
            <AccordionTrigger className="text-xl font-bold">
              MatrixTables
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-6 space-y-4">
                <MatrixTables {...project} />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/*----------------------------------------------------------*/}
          <AccordionItem value={"EvaluationTable"}>
            <AccordionTrigger className="text-xl font-bold">
              EvaluationTable
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-6 space-y-4">
                <EvaluationTable {...project} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
