import { ProjectStructure } from "@/lib";
import { useMemo, useCallback } from "react";

// ================== useComparisonsSection ===========================

export const useComparisonsSection = (
  project: ProjectStructure,
  update: (recipe: (draft: ProjectStructure) => void) => Promise<any>,
) => {
  const comps = useMemo(
    () => project?.comparisons?.comparison || [],
    [project],
  );

  const add = useCallback(
    () =>
      update((draft: ProjectStructure) => {
        // إنشاء كائن جديد يطابق هيكل الواجهة (Interface)
        const newEntry = {
          num: (draft.comparisons.comparison?.length || 0) + 1,
          dataRow: {},
        };

        // إضافته للمصفوفة
        draft.comparisons.comparison.push(newEntry);
      }),
    [update], // لم نعد بحاجة لـ comps هنا لأننا نقرأ الطول من الـ draft مباشرة
  );

  const remove = useCallback(
    (num: number) =>
      update((draft) => {
        draft.comparisons.comparison = comps
          .filter((c: any) => c.num !== num)
          .map((c: any, i: number) => ({ ...c, num: i + 1 }));
      }),
    [update, project, comps],
  );

  const updateCellComparison = useCallback(
    (num: number, col: string, val: any) =>
      update((draft) => {
        draft.comparisons.comparison = draft.comparisons.comparison.map(
          (c: any) =>
            c.num === num ? { ...c, dataRow: { ...c.dataRow, [col]: val } } : c,
        );
      }),
    [update, project, comps],
  );

  const getValue = useCallback(
    (num: number, col: string) => {
      const val = comps.find((c: any) => c.num === num)?.dataRow[col];
      return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
    },
    [comps],
  );

  const comparisons = useMemo(
    () => ({
      data: comps,
      count: comps.length,
      headers: project?.comparisons?.header || [],
      add,
      delete: remove,
      updateCellComparison,
      getValue,
    }),
    [
      comps,
      project?.comparisons?.header,
      add,
      remove,
      updateCellComparison,
      getValue,
    ],
  );

  return comparisons;
};
