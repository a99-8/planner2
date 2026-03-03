import { useRef, useMemo, useCallback } from "react";
import {
  generateRangeArray,
  ConvertingTextArrToNumberArr,
  sync,
  ProjectStructure,
  parseCsvToColumnsStructure,
  matrixData,
  evaluationData,
  getClosestFloor,
  projectService,
  staticHeaders,
  createDefaultSettlement,
  CalculatingValueBasedAtion,
} from "@/lib";

// ================== useLandsSection =================================
export const useLandsSection = (project: ProjectStructure) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { set } = sync(project);
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const { columns, fileName } = await parseCsvToColumnsStructure(file);
      set.LandsTableData(columns, fileName);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [],
  );

  const lands = useMemo(
    () => ({
      handleFileChange,
      fileInputRef,
      openPicker: () => fileInputRef.current?.click(),
    }),
    [project?.landsTable, handleFileChange],
  );

  return lands;
};

// ================== useControlPanel =================================
export const useControlsSection = (project: ProjectStructure) => {
  const update = async (recipe: (draft: ProjectStructure) => void) => {
    return await projectService.updateProjectSection(project.id, recipe);
  };

  const toggleColumn = useCallback(
    async (columnName: string, actions: string) => {
      await update((draft) => {
        if (!draft.control) return;

        const columnData =
          ConvertingTextArrToNumberArr(
            project.landsTable.tableData[columnName],
          ) || [];

        switch (actions) {
          case "settlements": {
            const current = draft.control.settlements || [];
            const isExist = current.includes(columnName);
            draft.control.settlements = isExist
              ? current.filter((c) => c !== columnName)
              : [...current, columnName];
            draft.comparisons.header = [
              ...staticHeaders,
              ...draft.control.settlements,
            ];
            if (isExist) delete draft.matrix.settlementsTable[columnName];
            else {
              draft.matrix.settlementsTable[columnName] =
                createDefaultSettlement(columnName, columnData);
            }
            break;
          }
          case "group":
          case "dependences":
          case "Interpolated": {
            const current = draft.control[actions] || [];
            draft.control[actions] = current.includes(columnName)
              ? current.filter((c) => c !== columnName)
              : [...current, columnName];
            if (actions === "dependences")
              delete draft.control.dis?.[`${columnName}_dependences`];
            break;
          }
          default: {
            const key = `${columnName}_${actions}`;
            if (!draft.control.dis) draft.control.dis = {};
            if (draft.control.dis[key] !== undefined)
              delete draft.control.dis[key];
            else {
              draft.control.dis[key] =
                CalculatingValueBasedAtion(columnData, actions) || 0;
            }
          }
        }
      });
    },
    [project],
  );

  return useMemo(
    () => ({
      toggleColumn,
    }),
    [toggleColumn],
  );
};

// ================== useMatrixSection =================================
export const useMatrixSection = (project: ProjectStructure) => {
  const { set } = sync(project);
  return useCallback(
    (settlement: string) => {
      // استدعاء المختار (Selector) بجلب البيانات
      const analysis = matrixData(project, settlement);
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
        const nums = ConvertingTextArrToNumberArr(
          project.landsTable?.tableData?.[settlement],
        );

        const newHeader = generateRangeArray({
          start: Math.min(...nums),
          end: Math.max(...nums),
          step: next.baseGroup,
          nums: nums,
        });

        const uniqueHeader = [...new Set(newHeader)].sort(
          (a, b) => Number(a) - Number(b),
        );
        set.updateSettings({
          settlement,
          newHeader,
          next,
          nums,
          step: next.baseGroup > 0 ? next.baseGroup : 0,
          uniqueHeader,
        });
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
            const cellKey = `${valueLands}_${setInputId}`;
            const val = currentTable?.dataRow?.[cellKey];
            let baseVal =
              typeof settings.baseSettlement === "number"
                ? settings.baseSettlement
                : Number(Array.isArray(val) ? (val[0] ?? 0) : (val ?? 0)) || 0;

            let finalVal =
              currentIndex > midIndex
                ? baseVal - interpolationAmount
                : currentIndex < midIndex
                  ? baseVal + interpolationAmount
                  : baseVal;

            newDataRow[`${valueLands}_${setInputId}`] = [finalVal];
          });
        });

        set.matrixData(settlement, newDataRow);
      };

      return {
        ...analysis,
        updateSettings,
        InterpolatedFunc,
      };
    },
    [project],
  );
};

// ================== useEvaluationSection =============================
export const useEvaluationSection = (project: ProjectStructure) => {
  const analysis = evaluationData(project);

  // استخدام useMemo بدلاً من useCallback لتعود rows كمصفوفة مباشرة
  const rows = useMemo(() => {
    if (!analysis) return [];

    const {
      settlements,
      comparisonsData,
      lands,
      rowCount,
      dependencesData,
      safeApprox,
      depTotals,
    } = analysis;

    // نقوم بعمل map ونعيد النتيجة للمتغير rows
    const result = Array.from({ length: rowCount }).map((_, rowIdx) => {
      const finalPricesPerComp: number[] = [];
      // lands Value
      const landsRow = [
        rowIdx + 1,
        ...settlements.map((s: any) => lands.tableData?.[s]?.[rowIdx] ?? ""),
      ];

      // compData
      const comparisonRow = comparisonsData.flatMap(
        (compItem: any, compIdx: number) => {
          // تهئية البيانات الاولية
          const matrixAnalysis = matrixData(project, settlements[compIdx]);
          if (!matrixAnalysis) return [];
          const { frRow } = matrixAnalysis;
          let settlementSum = 0;
          const pricePerMeter = Number(compItem.dataRow?.["سعر المتر"]) || 0;

          return [...settlements, "قيمة المتر بعد التسويات"].map((header) => {
            // حساب سعر المتر بعد التسويات
            if (header === "قيمة المتر بعد التسويات") {
              const priceAfterSettlements =
                pricePerMeter + pricePerMeter * (settlementSum / 100);
              // حساب الوزن للمقارنة
              let weight = project.summary.isTypeSingle
                ? project?.summary?.compweight?.[compIdx]
                : project?.summary?.rowData?.[rowIdx]?.[`comp${compIdx}`];
              if (!weight || weight === 0 || weight < 0) return (weight = 100);
              const priceAfterWheight = priceAfterSettlements * (weight / 100);
              finalPricesPerComp.push(priceAfterWheight);
              return Number(priceAfterSettlements).toFixed(2);
            }

            // حساب مجموع التساويات لكل مقارنة
            const landValue = lands.tableData?.[header]?.[rowIdx];
            const cellKey = `${getClosestFloor(landValue, frRow as number[])}_${compIdx}`;
            const valCurrent =
              project?.matrix?.settlementsTable?.[header]?.dataRow?.[cellKey];
            const val = Array.isArray(valCurrent)
              ? (valCurrent[0] ?? 0)
              : (valCurrent ?? 0);
            settlementSum = +Number(val) || 0;
            return val;
          });
        },
      );

      // final data
      const totalForAll = finalPricesPerComp.reduce(
        (sum, val) => sum + (val || 0),
        0,
      );
      const totalAftarRound =
        Math.round(totalForAll / safeApprox) * safeApprox || 0;

      const rowDeps = dependencesData.map((col: string) => {
        const val = Number(lands.tableData?.[col]?.[rowIdx]) || 0;
        const resultVal = totalAftarRound * val;
        if (depTotals[col] !== undefined) depTotals[col] += resultVal;
        return resultVal;
      });

      return {
        baseRows: [...landsRow, ...comparisonRow],
        finalRows: [
          Number(totalForAll).toFixed(2),
          Number(totalAftarRound).toFixed(2),
          ...rowDeps,
        ],
      };
    });

    return result;
  }, [analysis]);
  return {
    rows,
  };
};
