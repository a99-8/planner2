import { BadgeX, FilePlus, PencilLine, Trash } from "lucide-react";

// أزرار التحكم في مشروع محدد
export const ProjectControlButtons = [
  {
    id: "rename",
    name: "تغيير اسم المشروع",
    dis: "الرجاء كتابة اسم المشروع الجديد",
    icon: PencilLine,
    className: "bg-yellow-600 hover:text-yellow-700 hover:border-yellow-700",
    placeholder: "الاسم الجديد",
  },
  {
    id: "delet",
    name: "حذف المشروع",
    dis: "هل انت متأكد من حذف هذا المشروع ؟",
    icon: Trash,
    className: "bg-red-600 hover:text-red-700 hover:border-red-700",
  },
];

// أزرار الإدارة العامة
export const GlobalControlButtons = [
  {
    id: "create",
    name: "انشاء مشروع جديد",
    dis: " الرجاء كتابة اسم المشروع الذي تريد إنشاؤه",
    icon: FilePlus,
    className: "bg-blue-600 hover:text-blue-700 hover:border-blue-700",
    placeholder: "الاسم",
  },
  {
    id: "deletAllProjects",
    name: "حذف جميع المشاريع",
    dis: 'هل انت متأكد من حذف جميع المشاريع ؟ في حال كانت الإجابة نعم, الرجاء كتابة العبارة التالي "حذف جميع المشاريع"',
    icon: BadgeX,
    className: "bg-red-600  hover:text-red-700 hover:border-red-700",
    placeholder: "حذف جميع المشاريع",
  },
];

// رؤس جدول المقارنات الثابتة
export const staticHeaders = [
  "سعر المتر",
  "نوع المقارنة",
  "التاريخ",
  "نوع المرجع",
  "الرقم المرجعي",
  "الاحداثيات",
];

// رؤس اعمدة التحكم بالمجموعات
export const controlGroupHeaders = [
  " قيمة المجموعة",
  " أصغر قيمة",
  " أكبر قيمة",
  " عدد المجموعات",
];

// رؤس اعمدة التحكم بالمجموعات
export const controlSelHeaders = [" التسوية الأساسية", " مقدار القفزة"];

// انواع المقارنات
export const comparisonsType = ["تنفيذ", "معروض", "حد", "سوم", "ايجار"];

// انواع مراجع الصفقات
export const dealmatrixs = [
  "رقم الجوال",
  "رقم الصفقة",
  "رقم العقار",
  "عقود إيجار",
  "البحث الميداني",
];

// الاعمدة النهائية في جدول الملخص
export const finalHead = [
  "سعر المتر ",
  "قيمة المتر بعد التسويات ",
  "المرجح الموزون ",
  "قيمة المتر بعد المرجح ",
];

// بيانات جدول التحكم
export const disCells = [
  { name: "اصغر رقم", id: "min", group: "dis", validWithText: false },
  { name: "اكبر رقم", id: "max", group: "dis", validWithText: false },
  { name: "المتوسط", id: "avg", group: "dis", validWithText: false },
  { name: "الوسيط", id: "mid", group: "dis", validWithText: false },
  { name: "العدد", id: "count", group: "dis", validWithText: true },
  { name: "المجموع", id: "total", group: "dis", validWithText: false },
  {
    name: "التسويات",
    id: "settlements",
    group: "control",
    validWithText: true,
  },
  { name: "المجموعات", id: "group", group: "control", validWithText: false },
  {
    name: "الزيادات",
    id: "Interpolated",
    group: "control",
    validWithText: true,
  },
  {
    name: "الاعتماديات",
    id: "dependences",
    group: "control",
    validWithText: false,
  },
];

// الرؤس الاول لجدول التحكم
export const mainHeaders = [
  {
    label: "الاعمدة",
    colSpan: 1,
  },
  {
    label: "تفاصيل المشروع",
    colSpan: 6,
  },
  {
    label: "التحكم في المشروع",
    colSpan: 4,
  },
];

export const actionsList = [
  "min",
  "max",
  "avg",
  "mid",
  "count",
  "total",
  "dependences",
];

// اوامر رفع المشروع
const gitCommand = ["git add .", 'git commit -m ""', "git push -u origin main"];
