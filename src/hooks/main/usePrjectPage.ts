import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";
import { db } from "@/db/db"; // استورد db مباشرة أو استخدم الخدمة

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const project = useLiveQuery(
    () => db.projects.get(id), // افترضت أن الجدول اسمه projects
    [id],
  );

  return {
    project: project || null,
    loading: project === undefined, // في Dexie، القيمة تكون undefined أثناء الجلب لأول مرة
  };
}
