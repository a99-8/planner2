"use client";

import { useState, useCallback, useEffect } from "react";
import { storage } from "@/logic/storageHandler";
import { useSettlements } from "@/hooks/useSettlements";
import { useComparison } from "@/hooks/useComparison";
import { useMatrix } from "@/hooks/useMatrix";
import { type CSVRow } from "@/types/csvRow";

interface TableSnapshot {
  rows: any[];
  cols: string[];
  ids: number[];
  csvKeys: string[];
}

export function useEvaluation(namespace: string) {
  const { selectedColumns: liveSelectedColumns } =
    useSettlements("page_settlements");
  const { rowIds: liveRowIds, getCompValue } =
    useComparison("page_settlements");
  const { getCellValue } = useMatrix("page_settlements");

  const [snapshot, setSnapshot] = useState<TableSnapshot>({
    rows: [],
    cols: [],
    ids: [],
    csvKeys: [],
  });
  const [loading, setLoading] = useState(false);

  // حالة الأوزان: [row_index]: { [comp_id]: weight_value }
  const [rowWeights, setRowWeights] = useState<
    Record<number, Record<number, number>>
  >({});

  // تحميل الأوزان من IndexedDB عند البدء
  useEffect(() => {
    const loadSavedWeights = async () => {
      const saved = await storage.get(`${namespace}_row_weights`);
      if (saved) setRowWeights(saved);
    };
    loadSavedWeights();
  }, [namespace]);

  const updateWeight = async (
    rowIndex: number,
    compId: number,
    value: string,
  ) => {
    const numValue = parseFloat(value) || 0;
    const newWeights = {
      ...rowWeights,
      [rowIndex]: { ...rowWeights[rowIndex], [compId]: numValue },
    };
    setRowWeights(newWeights);
    await storage.save(`${namespace}_row_weights`, newWeights);
  };

  const handleManualUpdate = useCallback(
    async (data: CSVRow[]) => {
      if (!data.length || !liveSelectedColumns.length || !liveRowIds.length) {
        alert("يرجى التأكد من الاختيارات أولاً");
        return;
      }

      setLoading(true);
      try {
        const processedRows: any[] = [];
        const currentCols = [...liveSelectedColumns];
        const currentIds = [...liveRowIds];

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const rowObj: any = {
            original: row,
            settlements: {},
            totals: {},
            weighted: {},
          };
          let totalFinalPrice = 0;

          for (const id of currentIds) {
            const compPriceValue = await getCompValue(id, "سعر المتر");
            const basePrice = parseFloat(compPriceValue?.toString() || "0");
            // جلب الوزن المخصص لهذا الصف وهذه المقارنة
            const weight = rowWeights[i]?.[id] || 0;

            rowObj.settlements[id] = {};
            let sumPercentages = 0;

            const columnPromises = currentCols.map(async (col) => {
              const csvValue = row[col]?.toString() || "";
              const val = await getCellValue(col, csvValue, id);
              return { col, val: parseFloat(val?.toString() || "0") };
            });

            const results = await Promise.all(columnPromises);
            results.forEach((res) => {
              rowObj.settlements[id][res.col] = res.val;
              sumPercentages += res.val;
            });

            const adjustedPrice =
              basePrice + basePrice * (sumPercentages / 100);
            const weightedPrice = adjustedPrice * (weight / 100);
            totalFinalPrice += weightedPrice;

            rowObj.totals[id] = {
              basePrice,
              sum: sumPercentages,
              adjustedPrice,
            };
            rowObj.weighted[id] = weightedPrice;
          }

          rowObj.grandTotal = totalFinalPrice;
          processedRows.push(rowObj);
        }

        setSnapshot({
          rows: processedRows,
          cols: currentCols,
          ids: currentIds,
          csvKeys: Object.keys(data[0]),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [liveSelectedColumns, liveRowIds, getCellValue, getCompValue, rowWeights],
  );

  return { snapshot, loading, handleManualUpdate, rowWeights, updateWeight };
}
