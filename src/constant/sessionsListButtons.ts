import { ShieldCheck, PencilLine, FileDown, Trash } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ActionButtonConfig {
  id: string;
  icon: LucideIcon;
  className: string;
  description: string;
  onClick?: () => void;
}

export const sessionsListButtons: ActionButtonConfig[] = [
  {
    id: "activation",
    icon: ShieldCheck,
    className: "text-blue-600   hover:bg-blue-50 ",
    description: "تفعيل الجلسة الحالية",
  },
  {
    id: "rename",
    icon: PencilLine,
    className: "text-yellow-600   hover:bg-yellow-50 ",
    description: "إعادة تسمية الجلسة",
  },
  {
    id: "export",
    icon: FileDown,
    className: "text-purple-600   hover:bg-purple-50 ",
    description: "تحميل ملف الجلسة",
  },
  {
    id: "delete",
    icon: Trash,
    className: "text-red-600   hover:bg-red-50 ",
    description: "حذف الجلسة",
  },
];
