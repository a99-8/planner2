"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSettlements } from "@/hooks/other/useSettlements";
import { useComparison } from "@/hooks/useComparison";
import { useMatrix } from "@/hooks/useMatrix";
import { type CSVRow } from "@/types/csvRow";
import { TableSnapshot } from "@/types/tableSnapshot";
import { useEvaluationWeights } from "@/hooks/other/useEvaluationWeights";
import { processEvaluationData } from "@/logic/evaluationProcessor";

export function useEvaluation(namespace: string, externalData: CSVRow[]) {
  const { selectedColumns: liveSelectedColumns } =
    useSettlements("page_settlements");
  const { rowIds: liveRowIds, getCompValue } =
    useComparison("page_settlements");
  const { getCellValue } = useMatrix("page_settlements");

  const weights = useEvaluationWeights(namespace);
  const [snapshot, setSnapshot] = useState<TableSnapshot>({
    rows: [],
    cols: [],
    ids: [],
    csvKeys: [],
  });
  const [loading, setLoading] = useState(false);
  const lastProcessedKey = useRef<string>("");

  const runEvaluation = useCallback(async () => {
    const currentFingerprint = JSON.stringify({
      dataLength: externalData?.length,
      cols: liveSelectedColumns,
      ids: liveRowIds,
      isUniform: weights.isUniformWeight,
      uWeights: weights.uniformWeights,
      rWeights: weights.rowWeights,
    });

    if (
      currentFingerprint === lastProcessedKey.current ||
      !externalData?.length
    )
      return;

    setLoading(true);
    try {
      const processedRows = await processEvaluationData({
        data: externalData,
        cols: liveSelectedColumns,
        ids: liveRowIds,
        isUniform: weights.isUniformWeight,
        uWeights: weights.uniformWeights,
        rWeights: weights.rowWeights,
        getCellValue,
        getCompValue,
      });

      lastProcessedKey.current = currentFingerprint;
      setSnapshot({
        rows: processedRows,
        cols: [...liveSelectedColumns],
        ids: [...liveRowIds],
        csvKeys: Object.keys(externalData[0]),
      });
    } catch (error) {
      console.error("Evaluation Error:", error);
    } finally {
      setLoading(false);
    }
  }, [
    externalData,
    liveSelectedColumns,
    liveRowIds,
    weights,
    getCellValue,
    getCompValue,
  ]);

  useEffect(() => {
    const timer = setTimeout(runEvaluation, 120);
    return () => clearTimeout(timer);
  }, [runEvaluation]);

  return {
    snapshot,
    loading,
    ...weights, // يوزع كل شيء من هوك الأوزان (rowWeights, updateWeight, إلخ)
    setIsUniformWeight: weights.toggleWeightMode,
  };
}
