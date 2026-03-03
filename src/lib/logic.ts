import Papa from "papaparse";
import { useCallback } from "react";

export async function parseCsvToColumnsStructure(file: File): Promise<{
  fileName: string;
  columns: Record<string, any[]>;
}> {
  const text = await file.text();

  const parsed = Papa.parse<Record<string, any>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data;

  const columns: Record<string, any[]> = {};

  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!key) return;
      if (!columns[key]) columns[key] = [];
      columns[key].push(value);
    });
  });

  return {
    fileName: file.name,
    columns,
  };
}

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

// تعبئة مصفوفة التسويات بشروط معينة
export function generateRangeArray({
  start,
  end,
  step,
  nums,
}: {
  start: number;
  end: number;
  step: number;
  nums: number[];
}) {
  if (start > end || step <= 0) return nums;
  let result = [];
  let current = start;

  while (current <= end) {
    result.push(current);
    current += step;
  }

  return result;
}

// دالة حساب الوسيط المائل
export const getAverage = (arr: any): number => {
  if (!arr || arr.length === 0) return 0;

  // 1. تحويل العناصر لأرقام حقيقية وتصفية أي قيم غير صالحة
  const numericArr = ConvertingTextArrToNumberArr(arr);

  // 2. الترتيب العددي الصحيح (a - b)
  const sorted = numericArr.sort((a: any, b: any) => a - b);

  // 3. حساب الوسيط المائل للأصغر
  const midIndex = Math.floor((sorted.length - 1) / 2);

  return sorted[midIndex];
};

// دالة حساب القيمة المناسبة
export function getClosestFloor(
  value: number,
  array: number[],
): number | undefined {
  // نقوم أولاً بترتيب المصفوفة تصاعدياً للتأكد من دقة النتائج
  const sortedArray = [...array].sort((a, b) => a - b);

  // نستخدم reduce للبحث عن القيمة المناسبة
  return sortedArray.reduce(
    (prev, curr) => {
      // إذا كان العنصر الحالي أصغر من أو يساوي القيمة المطلوبة، فهو مرشح جيد
      return curr <= value ? curr : prev;
    },
    sortedArray[0] > value ? undefined : sortedArray[0],
  );
}

// دالة انشاء الاعداد الاساسية للمجموعات
export const makeGroupBase = (min: number, max: number): number[] => {
  // 1. التقريب حسب القواعد المطلوبة
  const getRoundedMin = (n: number) => {
    if (n < 10) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(n)));
    return Math.floor(n / magnitude) * magnitude;
  };

  const getRoundedMax = (n: number) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(n)));
    return Math.floor(n / magnitude) * magnitude;
  };

  let start = getRoundedMin(min);
  const end = getRoundedMax(max);
  const result: number[] = [];

  // 2. توليد الأرقام بتدرج ديناميكي
  let current = start;

  while (current <= end) {
    result.push(current);

    // تحديد "الخطوة" بناءً على قيمة الرقم الحالي
    // إذا كان الرقم 120، الخطوة 100. إذا كان 5، الخطوة 5.
    let step: number;
    if (current < 10) {
      step = 5;
    } else {
      // الخطوة هي 10% من رتبة الرقم الحالية (مثلاً المئات خطوتها 100 أو 50 حسب الرغبة)
      // هنا سنعتمد منطق: 10 -> 100 خطوة 10 | 100 -> 1000 خطوة 100
      const magnitude = Math.pow(10, Math.floor(Math.log10(current)));
      step = magnitude;
    }

    current += step;

    // تصحيح بسيط في حال قفزنا فوق "رتبة" جديدة (مثلاً من 90 إلى 100)
    if (current > 0) {
      const nextMag = Math.pow(10, Math.floor(Math.log10(current)));
      if (nextMag > step && current % nextMag !== 0) {
        // لضمان الهبوط على أرقام نظيفة مثل 100، 1000
      }
    }
  }

  // التأكد من أن المصفوفة فريدة ومرتبة
  return [...new Set(result)].filter((n) => n <= end).sort((a, b) => a - b);
};

// دالة تحويل مصفوفة النصوص لمصفوفة الارقام
export const ConvertingTextArrToNumberArr = (arr: string[]) => {
  return arr
    .map((v: any) => parseFloat(String(v)))
    .filter((v: any) => !isNaN(v));
};

export const isDataValid = (arr: any) => {
  if (!arr) return false;
  return ConvertingTextArrToNumberArr(arr).length === arr.length;
};

export const createDefaultSettlement = (
  columnName: string,
  columnData: number[],
) => {
  return {
    name: columnName,
    header: columnData,
    dataRow: {},
    settings: {
      baseGroup: 0,
      minValue: columnData.length > 0 ? Math.min(...columnData) : 0,
      maxValue: columnData.length > 0 ? Math.max(...columnData) : 0,
      groupCount: 0,
      baseSettlement: 0,
      increment: 0,
      average: 0,
      incrementEvery: 0,
    },
  };
};

export const CalculatingValueBasedAtion = (
  columnData: number[],
  action: string,
) => {
  const sorted = [...columnData].sort((a, b) => a - b);
  const sum = columnData.reduce((a, b) => a + b, 0);
  const stats: any = {
    min: Math.min(...columnData),
    max: Math.max(...columnData),
    avg: sum / (columnData.length || 1),
    total: sum,
    count: columnData.length,
    mid:
      sorted.length % 2 !== 0
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2,
  };
  return stats[action];
};
