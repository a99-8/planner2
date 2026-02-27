import { useMemo, useEffect, useCallback } from "react";
import { getClosestFloor, ProjectStructure } from "@/lib";
import { useMatrixSection } from "./useMatrixSection";
import { evaluationStore, matrixStore } from "@/lib/store";
import { getAndUpdateFunc } from "@/lib/getAndUpdateFunc";

export const useEvaluationSection = (
  project: ProjectStructure,
  update: (recipe: (draft: ProjectStructure) => void) => Promise<any>,
) => {
  const { getField, updateField, updateWeightCompNums, updateDataRowFild } =
    getAndUpdateFunc(project, update);

  const matrixdata = useMatrixSection(project, update);
  const analysis = useMemo(() => evaluationStore(project), [project]);

  // --- حساب الهيدرز ---
  const mainHeaders = useMemo(() => {
    if (!analysis) return [];
    const { settlements, compCount, comNewHeaders, dependencesData } = analysis;
    const headers = [
      { label: "بيانات جدول الأراضي", colSpan: settlements.length + 1 },
      ...Array.from({ length: compCount }).map((_, idx) => ({
        label: `المقارنة ${idx + 1}`,
        colSpan: comNewHeaders.length,
      })),
      { label: "القيمة بعد التقريب", colSpan: 2 },
    ];
    if (dependencesData.length > 0) {
      headers.push({
        label: "القيمة النهائية",
        colSpan: dependencesData.length,
      });
    }
    return headers;
  }, [analysis]);

  const subHeaders = useMemo(() => {
    if (!analysis) return [];
    const { settlements, compCount, comNewHeaders, dependencesData } = analysis;
    return [
      "#",
      ...settlements,
      ...Array.from({ length: compCount }).flatMap(() =>
        comNewHeaders.map((header) =>
          settlements.includes(header) ? `تسوية : ${header}` : header,
        ),
      ),
      "قيمة المتر النهائية",
      "قيمة المتر بعد التقريب",
      ...dependencesData.map((col) => `سعر المتر * ${col}`),
    ];
  }, [analysis]);

  // --- معالجة الصفوف وحساب التبعيات تلقائياً ---
  const rowsResult = useMemo(() => {
    if (!analysis || !project)
      return { displayRows: [], rowDataSync: [], depTotals: {} };
    const {
      settlements,
      comNewHeaders,
      comparisonsData,
      lands,
      dependencesData,
      rowCount,
      isTypeSingle,
      approximation,
    } = analysis;

    const depTotals: Record<string, number> = {};
    dependencesData.forEach((col) => (depTotals[col] = 0));

    const processedRows = Array.from({ length: rowCount }).map((_, rowIdx) => {
      const baseRow = [
        rowIdx + 1,
        ...settlements.map((s: any) => lands.tableData?.[s]?.[rowIdx] ?? ""),
      ];
      const finalPricesPerComp: number[] = [];

      const comparisonCells = comparisonsData.flatMap(
        (compItem: any, compIdx: number) => {
          const matrix = matrixdata(comNewHeaders[compIdx]);
          const matrixAnalysis = matrixStore(project, comNewHeaders[compIdx]);
          if (!matrixAnalysis) return [];

          const { frRow } = matrixAnalysis;
          let settlementSum = 0;

          return comNewHeaders.map((header) => {
            if (settlements.includes(header)) {
              const landValue = lands.tableData?.[header]?.[rowIdx];
              const val =
                matrix?.matrixActions?.getValue(
                  getClosestFloor(landValue, frRow as number[]) ?? 0,
                  compIdx,
                ) ?? 0;
              settlementSum += Number(val) || 0;
              return val;
            }

            const pricePerMeter = Number(compItem.dataRow?.["سعر المتر"]) || 0;
            const priceAfterSettlements =
              pricePerMeter + pricePerMeter * (settlementSum / 100);
            const currentWeight = isTypeSingle
              ? project?.summary?.compweight?.[compIdx]
              : (project?.summary?.rowData?.[rowIdx]?.compweight?.[compIdx] ??
                0);

            const finalPrice = Number(
              (priceAfterSettlements * (currentWeight / 100)).toFixed(2),
            );

            if (header === "قيمة المتر بعد المرجح ")
              finalPricesPerComp[compIdx] = finalPrice;

            if (header === "المرجح الموزون ")
              return { type: "input", compIdx, rowIdx, value: currentWeight };
            if (header === "سعر المتر ") return pricePerMeter;
            if (header === "قيمة المتر بعد التسويات ")
              return priceAfterSettlements;
            if (header === "قيمة المتر بعد المرجح ") return finalPrice;
            return "notFound";
          });
        },
      );

      const totalForAll = finalPricesPerComp.reduce(
        (sum, val) => sum + (val || 0),
        0,
      );
      const safeApprox = approximation > 0 ? approximation : 1;
      const totalAftarRound =
        Math.round(totalForAll / safeApprox) * safeApprox || 0;

      // حساب التبعيات لهذا الصف وإضافتها للمجموع الكلي
      const rowDeps = dependencesData.map((col: string) => {
        const val = Number(lands.tableData?.[col]?.[rowIdx]) || 0;
        const result = totalAftarRound * val;
        depTotals[col] += result; // تجميع في الكائن الخارجي
        return result;
      });

      return {
        display: [
          ...baseRow,
          ...comparisonCells,
          totalForAll,
          totalAftarRound,
          ...rowDeps,
        ],
        rawTotal: totalAftarRound,
        index: rowIdx,
      };
    });

    return {
      displayRows: processedRows.map((r) => r.display),
      rowDataSync: processedRows.map((r) => ({
        idx: r.index,
        val: r.rawTotal,
      })),
      depTotals,
    };
  }, [analysis, project, matrixdata]);

  // --- تحديث المشروع (منع الـ Loop) ---
  useEffect(() => {
    if (!rowsResult.rowDataSync.length) return;

    const syncEverything = async () => {
      await update((draft) => {
        let changed = false;

        // تحديث الأسعار
        rowsResult.rowDataSync.forEach(({ idx, val }) => {
          if (!draft.summary.rowData[idx])
            draft.summary.rowData[idx] = { compweight: [], totalAftarRound: 0 };
          if (draft.summary.rowData[idx].totalAftarRound !== val) {
            draft.summary.rowData[idx].totalAftarRound = val;
            changed = true;
          }
        });

        // تحديث التبعيات في الـ Control
        if (draft.control) {
          if (!draft.control.dis) draft.control.dis = {};
          Object.entries(rowsResult.depTotals).forEach(([col, total]) => {
            const key = `${col}_dependences`;
            if (draft.control.dis[key] !== total) {
              draft.control.dis[key] = total;
              changed = true;
            }
          });
        }

        if (!changed) return;
      });
    };

    syncEverything();
  }, [rowsResult.rowDataSync, rowsResult.depTotals, update]);

  return {
    mainHeaders,
    subHeaders,
    rows: rowsResult.displayRows,
    updateField,
    getField,
    updateDataRowFild,
    weightCompNums: analysis?.weightCompNums || [],
    updateWeightCompNums,
    approximation: analysis?.approximation || 1,
  };
};
