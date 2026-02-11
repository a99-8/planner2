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
    hidden: "",
    hover: true,
  },
  {
    id: "delet",
    name: "حذف المشروع",
    dis: "هل انت متأكد من حذف هذا المشروع ؟",
    icon: Trash,
    className: "bg-red-600  hover:text-red-700 hover:border-red-700",
    hidden: "hidden",
    hover: true,
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
    hidden: "",
    hover: false,
  },
  {
    id: "deletAllProjects",
    name: "حذف جميع المشاريع",
    dis: 'هل انت متأكد من حذف جميع المشاريع ؟ في حال كانت الإجابة نعم, الرجاء كتابة العبارة التالي "حذف جميع المشاريع"',
    icon: BadgeX,
    className: "bg-red-600  hover:text-red-700 hover:border-red-700",
    placeholder: "حذف جميع المشاريع",
    hidden: "",
    hover: false,
  },
];

// البيانات ذات حقول الادخال المميزة
export const specialFields = [
  "نوع المقارنة",
  "التاريخ",
  "الرقم المرجعي",
  "الاحداثيات",
];

// رؤس جدول المقارنات الثابتة
export const staticHeaders = [
  "سعر المتر",
  "نوع المقارنة",
  "التاريخ",
  "الرقم المرجعي",
  "الاحداثيات",
];

// الاعمدة الاخيرة في جدول التلخيص
export const finalHead = [
  {
    key: "sum",
    name: "  مجموع %",
    className: "border text-center bg-amber-50 text-amber-800",
  },
  {
    key: "weight",
    name: " الوزن %",
    className: "border text-center bg-blue-100 font-bold text-blue-800",
  },
  {
    key: "weighed",
    name: "الموزون",
    className: "border text-center bg-emerald-50 font-bold text-emerald-800",
  },
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
export const dealReferences = [
  "رقم الجوال",
  "رقم الصفقة",
  "رقم العقار",
  "عقود إيجار",
  "البحث الميداني",
];
