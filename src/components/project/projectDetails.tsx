const ProjectDetails = ({ project }: { project: any }) => {
  return (
    <>
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
        <p className="text-slate-500 text-sm mt-2">
          معرف المشروع:{" "}
          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
            {project.id}
          </span>
        </p>
      </header>

      <div className="grid gap-6 bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2">تفاصيل المشروع</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 block">آخر تحديث</span>
            <span className="font-medium">
              {project.updatedAt
                ? project.updatedAt.toLocaleString("ar-SA")
                : "غير متوفر"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
