import * as XLSX from "xlsx";
import { storage } from "@/logic/storageHandler";
import { v4 as uuid } from "uuid";
import { EvaluationSession } from "@/logic/session/types";

/**
 * تصدير جلسة معينة إلى ملف Excel
 */
export const exportSessionToExcel = async (
  id: string,
  sessions: EvaluationSession[],
) => {
  const session = sessions.find((s) => s.id === id);
  if (!session) return;

  const workbook = XLSX.utils.book_new();
  const jsonString = JSON.stringify(session);

  // تخزين بيانات الجلسة كـ JSON في أول ورقة
  const sheet = XLSX.utils.aoa_to_sheet([[jsonString]]);
  XLSX.utils.book_append_sheet(workbook, sheet, "SessionData");

  XLSX.writeFile(workbook, `${session.name}.session.xlsx`);
};

/**
 * استيراد بيانات الجلسة من ملف Excel وتوزيعها على الـ Storage
 */
export const importSessionFromExcel = async (file: File, namespace: string) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // 1. تعريف مسميات الأوراق (Sheets)
    const sheetNames = {
      summary: "1- الخلاصة النهائية",
      comparison: "2- بيانات المقارنات",
      matrix: "3- مصفوفة التسويات",
      csv: "4- بيانات CSV الأصلية",
    };

    // التحقق من وجود الأوراق الأساسية
    if (
      !workbook.Sheets[sheetNames.csv] ||
      !workbook.Sheets[sheetNames.comparison]
    ) {
      throw new Error(
        "تنسيق الملف غير صحيح، تأكد من وجود أوراق العمل المطلوبة.",
      );
    }

    // 2. تحويل الأوراق إلى بيانات JSON
    const csvData: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNames.csv],
    );
    const compRows: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNames.comparison],
    );
    const matrixRows: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNames.matrix],
    );
    const summaryRows: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNames.summary],
    );

    // 3. استخراج وحقن بيانات الـ CSV الأصلية
    await storage.save("main_dashboard", csvData);
    await storage.save("main_dashboard_name", file.name);

    // 4. استخراج وحقن بيانات المقارنات (Comparison Table)
    const rowIds = compRows.map((r) => parseInt(r["م"]) || 0);
    await storage.save("page_settlements_row_ids", rowIds);

    for (const row of compRows) {
      const id = row["م"];
      for (const [key, value] of Object.entries(row)) {
        if (key !== "م") {
          const cleanValue = value === "-" ? "" : value;
          await storage.save(`comp_table_${id}_${key}`, cleanValue);
        }
      }
    }

    // 5. استخراج وحقن مصفوفة التسويات (Matrix)
    const selectedColsSet = new Set<string>();
    for (const row of matrixRows) {
      const columnName = row["العنصر"];
      const csvValue = row["القيمة في CSV"];
      if (columnName) selectedColsSet.add(columnName);

      for (const key of Object.keys(row)) {
        if (key.startsWith("مقارنة")) {
          const compIdMatch = key.match(/\d+/);
          if (compIdMatch) {
            const compId = compIdMatch[0];
            await storage.save(
              `matrix_${columnName}_${compId}_${csvValue}`,
              row[key],
            );
          }
        }
      }
    }
    await storage.save(
      "page_settlements_selected_cols",
      Array.from(selectedColsSet),
    );

    // 6. استخراج وحقن المرجح الموزون (Weights)
    const rowWeights: Record<number, Record<number, number>> = {};
    summaryRows.forEach((row, index) => {
      rowWeights[index] = {};
      Object.keys(row).forEach((key) => {
        if (
          key.includes("مقارنة") &&
          (key.includes("الموزون") || key.includes("وزن"))
        ) {
          const compIdMatch = key.match(/\d+/);
          if (compIdMatch) {
            const compId = parseInt(compIdMatch[0]);
            rowWeights[index][compId] = row[key] || 100 / rowIds.length;
          }
        }
      });
    });
    await storage.save(`${namespace}_row_weights`, rowWeights);

    // 7. تسجيل الجلسة في القائمة
    const newSessionId = uuid();
    const newSession: EvaluationSession = {
      id: newSessionId,
      name: file.name.replace(".xlsx", ""),
      updatedAt: Date.now(),
      createdAt: Date.now(),
      state: {
        data: csvData,
        rowIds,
        selectedColumns: Array.from(selectedColsSet),
        snapshot: null, // يمكن تحديثه لاحقاً
      },
    };

    const existingSessions =
      (await storage.get(`${namespace}_sessions_list`)) || [];
    await storage.save(`${namespace}_sessions_list`, [
      ...existingSessions,
      newSession,
    ]);
    await storage.save(`${namespace}_current_session_id`, newSessionId);

    return true; // نجاح العملية
  } catch (error) {
    console.error("Import Error:", error);
    throw error;
  }
};
