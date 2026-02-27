import { useCallback } from "react";
import {
  calculateMetrics,
  generateRangeArray,
  getAverage,
  ProjectStructure,
} from "@/lib";
import { matrixStore } from "@/lib/store";

export const useMatrixSection = (
  project: ProjectStructure,
  update: (recipe: (draft: ProjectStructure) => void) => Promise<any>,
) => {
  return useCallback(
    (settlement: string) => {
      // استدعاء المختار (Selector) بجلب البيانات
      const analysis = matrixStore(project, settlement);
      if (!analysis) return undefined;

      const {
        settings,
        currentTable,
        frRow,
        frCol,
        newDataRow,
        sortedRows,
        midIndex,
      } = analysis;

      // --- دالة تحديث الإعدادات ---
      const updateSettings = async (updatedFields: any) => {
        const next = { ...settings, ...updatedFields };
        const { nums, min, max, count } = calculateMetrics(
          project.landsTable?.tableData?.[settlement] || [],
          next.baseGroup,
        );

        const newHeader =
          next.baseGroup > 0
            ? generateRangeArray({ start: min, end: max, step: next.baseGroup })
            : nums;

        const uniqueHeader = [...new Set(newHeader)].sort(
          (a, b) => Number(a) - Number(b),
        );

        await update((draft) => {
          const table = draft.matrix.settlementsTable[settlement];
          table.header = newHeader;
          table.settings = {
            ...next,
            maxValue: max,
            minValue: min,
            groupCount: count,
            average: getAverage(uniqueHeader),
          };
        });
      };

      // --- عمليات الخلايا ---
      const matrixActions = {
        updateCellMatrix: (
          valueLands: number,
          setInputId: number,
          val: any,
        ) => {
          const cellKey = `${valueLands}_${setInputId}`;
          update((draft) => {
            draft.matrix.settlementsTable[settlement].dataRow[cellKey] = val;
          });
        },
        getValue: (valueLands: number, setInputId: number) => {
          const cellKey = `${valueLands}_${setInputId}`;
          const val = currentTable?.dataRow?.[cellKey];
          return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
        },
      };

      // --- دالة التوزيع (Interpolation) ---
      const InterpolatedFunc = async () => {
        if (settings.increment === 0) return;

        frRow.forEach((valueLands: any) => {
          const currentIndex = sortedRows.indexOf(valueLands);
          const indexDistance = Math.abs(currentIndex - midIndex);

          frCol.forEach((_: any, setInputId: number) => {
            const steps = Math.floor(
              indexDistance / (settings.incrementEvery || 1),
            );
            const interpolationAmount = settings.increment * steps;

            let baseVal =
              typeof settings.baseSettlement === "number"
                ? settings.baseSettlement
                : Number(
                    matrixActions.getValue(settings.average, setInputId),
                  ) || 0;

            let finalVal =
              currentIndex > midIndex
                ? baseVal - interpolationAmount
                : currentIndex < midIndex
                  ? baseVal + interpolationAmount
                  : baseVal;

            newDataRow[`${valueLands}_${setInputId}`] = [finalVal];
          });
        });

        await update((draft) => {
          draft.matrix.settlementsTable[settlement].dataRow = newDataRow;
        });
      };

      return {
        ...analysis,
        updateSettings,
        matrixActions,
        InterpolatedFunc,
      };
    },
    [project, update],
  );
};
