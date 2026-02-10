import { LucideIcon } from "lucide-react";

export type Project = {
  id: string;
  name: string;
  updatedAt: Date;
};

export interface ProjectData {
  id?: number;
  projectId: string;
  tableName: string;
  type: "headers" | "column";
  key: string;
  content: string[] | number[];
}

export type ControlButtons = {
  id: string;
  name: string;
  dis: string;
  icon: LucideIcon;
  onClick: () => void;
  className: string;
  hidden: string;
  placeholder?: string;
};

export interface ProjectActions {
  addProject: (name: string) => void;
  removeProject: (id: string) => void;
  clearAll: () => void;
  renameProject: (id: string, name: string) => void;
}

export interface StatusHandlerProps {
  type: "loading" | "noProject" | "noData" | "error";
  className?: string;
  message?: string;
}

export type CSVRow = Record<string, string>;

// تعريف هيكل البيانات المنسقة التي سيتم حفظها
export interface FormattedProjectData {
  id?: number; // معرف تلقائي من Dexie
  projectId: string; // لربط البيانات بمشروع معين
  tableName: string; // اسم الجدول (مثلاً: "Lands")
  fileName: string; // اسم ملف CSV الأصلي
  headers: string[]; // أسماء الأعمدة [id, name, area]
  data: Record<string, any[]>; // البيانات المنسقة { id: [1,2], name: ["A","B"] }
  updatedAt: number; // تاريخ التحديث
}

export interface TableProps {
  data: Record<string, any[]>; // البيانات المنسقة { id: [1,2], name: ["A","B"] }
  headers: string[]; // أسماء الأعمدة [id, name, area]
  fileName: string; // اسم ملف CSV الأصلي
}
