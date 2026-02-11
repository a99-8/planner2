"use client";

import StatusHandler from "@/components/custom/StatusHandler";
import ProjectItem from "@/components/project/ProjectListItem";
import ProjectListIHaeder from "@/components/project/ProjectListHeader";
import { useProjects } from "@/hooks/useProjectMain";

export default function Home() {
  const actions = useProjects();
  const { projects, isLoading } = actions;

  return (
    <div
      className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500"
      dir="rtl"
    >
      {/* Header */}
      <ProjectListIHaeder />

      {/* Projects List */}
      <div className="border rounded-2xl p-6 bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            المشاريع المحفوظة ({projects.length})
          </h2>
        </div>

        {isLoading ? (
          <StatusHandler type="loading" />
        ) : projects.length === 0 ? (
          <StatusHandler type="noProject" />
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectItem key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
