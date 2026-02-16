import Papa from "papaparse";
import { staticHeaders } from "./constant";

// دالة تحليل بيانات ملف csv
export const parseCSV = (
  file: File,
): Promise<{
  data: Record<string, any>[];
  name: string;
  headers: string[];
}> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy", // يتجاهل الأسطر الفارغة حتى لو تحتوي على مسافات
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve({
          data: results.data as Record<string, any>[],
          name: file.name,
          headers: headers,
        });
      },
      error: (error) => reject(error),
    });
  });
};

// دالة تنسيق التاريخ
export const formadDate = (date: Date) => {
  // استخراج الوقت بتنسيق 12 ساعة
  const timeStr = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase()
    .replace(/\s(?=[AP]M)/i, "");

  // استخراج التاريخ بتنسيق اليوم-الشهر-السنة
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day} ${timeStr}`;
};

// دالة تحليل البيانات من صف صف الى عمود عمود
export const formatCSVData = (
  fileName: string,
  rawData: any[], // البيانات القادمة من parseCSV
  headers: string[],
) => {
  // تعريف المخرج بنظام: اسم العمود -> مصفوفة من القيم
  const formattedData: Record<string, any[]> = {};

  // 1. تهيئة مصفوفة فارغة لكل رأس عمود
  headers.forEach((header) => {
    formattedData[header] = [];
  });

  // 2. توزيع البيانات: كل قيمة تذهب للمصفوفة الخاصة بعمودها
  rawData.forEach((row) => {
    headers.forEach((header) => {
      // التعامل مع القيم المفقودة لضمان عدم وجود undefined
      const value =
        row[header] !== undefined && row[header] !== null ? row[header] : "";
      formattedData[header].push(value);
    });
  });

  return {
    fileName: fileName || "لا يوجد ملف مختار",
    header: headers,
    dataRow: formattedData, // هذا هو الـ dataRow في الهيكل الجديد
  };
};

// دالة لتأكد من خلو البيانات من المتكررات
export function prossHeaders(selectedColumns: any) {
  const dynamicHeaders = selectedColumns.filter(
    (col: string) => !staticHeaders.includes(col),
  );

  const headers = [...staticHeaders, ...dynamicHeaders];
  return headers;
}

// تعبئة مصفوفة التسويات بشروط معينة
export function generateRangeArray({
  start,
  end,
  step,
}: {
  start: number;
  end: number;
  step: number;
}) {
  let result = [];
  let current = start;

  while (current <= end) {
    result.push(current);
    current += step;
  }

  return result;
}

/**
 * تحويل البيانات من نظام الأعمدة (تخزين) إلى نظام الصفوف (عرض)
 * لتتوافق مع TanStack Table ومتطلبات واجهة المستخدم.
 */
export const transformToRows = <T extends Record<string, any[]>>(
  dataRow: T,
  headers: string[],
): Record<string, any>[] => {
  if (!dataRow || !headers || headers.length === 0) return [];

  // تحديد عدد الصفوف بناءً على طول مصفوفة أول عمود
  const rowCount = dataRow[headers[0]]?.length || 0;

  return Array.from({ length: rowCount }).map((_, rowIndex) => {
    return headers.reduce(
      (acc, header) => {
        acc[header] = dataRow[header]?.[rowIndex] ?? "";
        return acc;
      },
      {} as Record<string, any>,
    );
  });
};
