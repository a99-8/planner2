import { type CSVRow } from "@/types/csvRow";
import {
  calculateWeightedPrice,
  calculateAdjustedPrice,
} from "@/func/calculateEvaluation";

interface ProcessParams {
  data: CSVRow[];
  cols: string[];
  ids: number[];
  isUniform: boolean;
  uWeights: Record<number, number>;
  rWeights: Record<number, Record<number, number>>;
  getCellValue: any;
  getCompValue: any;
}

export async function processEvaluationData({
  data,
  cols,
  ids,
  isUniform,
  uWeights,
  rWeights,
  getCellValue,
  getCompValue,
}: ProcessParams) {
  return await Promise.all(
    data.map(async (row, rowIndex) => {
      const rowObj: any = {
        original: row,
        settlements: {},
        totals: {},
        weighted: {},
        grandTotal: 0,
      };
      let rowGrandTotal = 0;

      for (const id of ids) {
        const compPriceValue = await getCompValue(id, "سعر المتر");
        const basePrice = parseFloat(compPriceValue?.toString() || "0");
        const weight = isUniform
          ? uWeights[id] || 0
          : rWeights[rowIndex]?.[id] || 0;

        const results = await Promise.all(
          cols.map(async (col) => {
            const val = await getCellValue(col, row[col]?.toString() || "", id);
            return { col, val: parseFloat(val?.toString() || "0") };
          }),
        );

        let sumPercentages = 0;
        rowObj.settlements[id] = {};
        results.forEach((res) => {
          rowObj.settlements[id][res.col] = res.val;
          sumPercentages += res.val;
        });

        const adjustedPrice = calculateAdjustedPrice({
          basePrice,
          sumPercentages,
        });
        const weightedPrice = calculateWeightedPrice({
          basePrice,
          sumPercentages,
          weight,
        });

        rowObj.totals[id] = { basePrice, sum: sumPercentages, adjustedPrice };
        rowObj.weighted[id] = weightedPrice;
        rowGrandTotal += weightedPrice;
      }

      rowObj.grandTotal = rowGrandTotal;
      return rowObj;
    }),
  );
}
