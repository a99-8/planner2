import { Plus, Save, BrushCleaning, Import, Archive } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ActionButtonConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  className: string;
  onClick?: () => void; // علامة الاستفهام تعني أنها اختيارية هنا
  disabled?: boolean;
}

export const ACTION_BUTTONS_CONFIG: ActionButtonConfig[] = [
  {
    id: "create",
    label: "إنشاء جلسة جديدة",
    icon: Plus,
    className: "bg-green-600 hover:bg-green-700 text-white",
  },
  {
    id: "save",
    label: "حفظ الجلسة الحالية",
    icon: Save,
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    id: "clear",
    label: "تنظيف الجلسة",
    icon: BrushCleaning,
    className: "bg-red-600 hover:bg-red-700 text-white",
  },
  {
    id: "import",
    label: "استيراد من Excel",
    icon: Import,
    className: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  {
    id: "report",
    label: "التقرير الكامل",
    icon: Archive,
    className: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
];
