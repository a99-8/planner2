import Papa from "papaparse";

export const parseCSV = (
  file: File,
): Promise<{
  data: Record<string, any>[];
  name: string;
  headers: string[];
}> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, // هذا يحول الصف الأول تلقائياً إلى Keys
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
