"use client";
import { useState, useEffect } from "react";
import { storage } from "@/logic/storageHandler";

export function useEvaluationWeights(namespace: string) {
  const [isUniformWeight, setIsUniformWeight] = useState<boolean>(true);
  const [uniformWeights, setUniformWeights] = useState<Record<number, number>>(
    {},
  );
  const [rowWeights, setRowWeights] = useState<
    Record<number, Record<number, number>>
  >({});

  useEffect(() => {
    const loadSavedData = async () => {
      const [w, uw, m] = await Promise.all([
        storage.get(`${namespace}_row_weights`),
        storage.get(`${namespace}_uniform_weights`),
        storage.get(`${namespace}_weight_mode`),
      ]);
      if (w) setRowWeights(w);
      if (uw) setUniformWeights(uw);
      if (m !== null) setIsUniformWeight(m);
    };
    loadSavedData();
  }, [namespace]);

  const updateUniformWeight = async (id: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = { ...uniformWeights, [id]: num };
    setUniformWeights(updated);
    await storage.save(`${namespace}_uniform_weights`, updated);
  };

  const updateWeight = async (rowIndex: number, id: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = {
      ...rowWeights,
      [rowIndex]: { ...rowWeights[rowIndex], [id]: num },
    };
    setRowWeights(updated);
    await storage.save(`${namespace}_row_weights`, updated);
  };

  const toggleWeightMode = async (val: boolean) => {
    setIsUniformWeight(val);
    await storage.save(`${namespace}_weight_mode`, val);
  };

  return {
    isUniformWeight,
    uniformWeights,
    rowWeights,
    updateUniformWeight,
    updateWeight,
    toggleWeightMode,
  };
}
