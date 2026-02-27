import Papa from "papaparse";

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

export const calculateMetrics = (values: any[], step: number) => {
  const nums = ConvertingTextArrToNumberArr(values);
  if (nums.length !== values.length) return { max: 0, min: 0, count: 0 };
  const min = Math.min(...nums),
    max = Math.max(...nums);
  return {
    min,
    nums,
    max,
    count: step > 0 ? Math.ceil((max - min) / step) + 1 : 0,
  };
};

export const getAverage = (arr: any): number => {
  if (!arr || arr.length === 0) return 0;

  // 1. تحويل العناصر لأرقام حقيقية وتصفية أي قيم غير صالحة
  const numericArr = arr
    .map((item: any) => Number(item))
    .filter((item: number) => !isNaN(item));

  // 2. الترتيب العددي الصحيح (a - b)
  const sorted = numericArr.sort((a: any, b: any) => a - b);

  // 3. حساب الوسيط المائل للأصغر
  const midIndex = Math.floor((sorted.length - 1) / 2);

  return sorted[midIndex];
};

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

export const ConvertingTextArrToNumberArr = (arr: string[]) => {
  return arr
    .map((v: any) => parseFloat(String(v)))
    .filter((v: any) => !isNaN(v));
};
