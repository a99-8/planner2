/**
 * تحويل البيانات من نظام الصفوف (Array of Objects)
 * إلى نظام الأعمدة (Column-oriented Object)
 */
export const formatCSVData = (
  fileName: string,
  rawData: any[],
  headers: string[],
) => {
  const formattedData: Record<string, any[]> = {};

  // تهيئة مصفوفة فارغة لكل رأس عمود
  headers.forEach((header) => {
    formattedData[header] = [];
  });

  // توزيع البيانات: كل قيمة تذهب للمصفوفة الخاصة بعمودها
  rawData.forEach((row) => {
    headers.forEach((header) => {
      // نستخدم empty string في حال كانت الخلية فارغة
      formattedData[header].push(row[header] ?? "");
    });
  });

  return {
    name: fileName,
    headers: headers,
    data: formattedData,
  };
};
