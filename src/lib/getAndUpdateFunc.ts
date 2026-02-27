import { ProjectStructure } from "./projectStructure";

export const getAndUpdateFunc = (
  project: ProjectStructure,
  update: (recipe: (draft: ProjectStructure) => void) => Promise<any>,
) => {
  //  دوال حفظ وجلب البيانات الاضافية التلخيص

  const updateField = (filed: "isTypeSingle" | "approximation", val: any) => {
    update((draft) => {
      filed === "isTypeSingle"
        ? (draft.summary.isTypeSingle = val)
        : (draft.summary.approximation = val);
    });
  };

  const getField = (filed: string) => {
    return (project?.summary as any)?.[filed];
  };

  //  دوال حفظ وجلب البيانات الخلايا التلخيص

  const updateWeightCompNums = (compNums: number, val: any) => {
    update((draft) => {
      draft.summary.compweight[compNums] = Number(val);
    });
  };

  const updateDataRowFild = (
    rowNum: number,
    filed: "weight" | "totalAftarRound",
    compNum: number,
    val: number,
  ) => {
    update((draft) => {
      // التأكد من وجود الصف أولاً
      const targetRow = draft.summary.rowData[rowNum];

      if (!targetRow) {
        return; // اخرج من الوظيفة إذا كان الصف غير موجود
      }

      if (filed === "weight") {
        // تأكد أيضاً من وجود مصفوفة الأوزان
        if (targetRow.compweight) {
          targetRow.compweight[compNum] = val;
        }
      } else {
        targetRow.totalAftarRound = val;
      }
    });
  };

  // ارجاع الدوال
  return {
    updateField,
    getField,
    updateWeightCompNums,
    updateDataRowFild,
  };
};
