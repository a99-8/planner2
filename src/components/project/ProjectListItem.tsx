"use client";

import ControlButtons from "@/components/custom/controlButtons";
import { useProjects } from "@/hooks/useProjectMain";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  formadDate,
  ProjectControlButtons,
  ProjectStructure,
} from "@/lib/index";

const ProjectListItem = ({ name, id, updatedAt }: ProjectStructure) => {
  const { handleAction } = useProjects();
  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center justify-between border border-slate-200 rounded-xl p-5 hover:border-primary/40 hover:bg-slate-50/50 transition-all duration-200">
      <div className="flex flex-col space-y-1 mb-4 md:mb-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-slate-800">{name}</span>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded border border-slate-200">
            ID: {id}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span>
            آخر تحديث:
            <span dir="ltr">
              {updatedAt ? formadDate(updatedAt) : "غير متوفر"}
            </span>
          </span>
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-auto self-end md:self-center opacity-90 md:group-hover:opacity-100 transition-opacity duration-300">
        <Link href={`/project/${id}`}>
          <Button
            variant="outline"
            className="h-9 text-xs px-3 border-primary/20 hover:bg-primary/10 hover:text-primary text-slate-600"
          >
            <ExternalLink className="ml-2 h-4 w-4" />
            فتح المشروع
          </Button>
        </Link>

        {ProjectControlButtons.map((btn) => (
          <ControlButtons
            key={btn.id}
            {...btn}
            defaultValue={btn.id === "rename" ? name : ""}
            onClick={(val?: string) => handleAction(btn.id, val || "", id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectListItem;
