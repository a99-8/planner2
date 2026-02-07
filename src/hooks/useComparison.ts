// src/hooks/useComparison.ts
import { useState, useEffect } from "react";
import { storage } from "@/logic/storageHandler";

export function useComparison(namespace: string) {
  const [rowIds, setRowIds] = useState<number[]>([]);
  const STORAGE_KEY = `${namespace}_row_ids`;

  useEffect(() => {
    const loadIds = async () => {
      const savedIds = await storage.get(STORAGE_KEY);
      if (savedIds && Array.isArray(savedIds)) {
        setRowIds(savedIds);
      } else {
        const initialIds = [0, 1, 2];
        setRowIds(initialIds);
        await storage.save(STORAGE_KEY, initialIds);
      }
    };
    loadIds();
  }, [namespace]);

  const updateCompValue = async (
    rowIndex: number,
    header: string,
    value: string,
  ) => {
    await storage.save(`comp_table_${rowIndex}_${header}`, value);
  };

  const getCompValue = async (rowIndex: number, header: string) => {
    return await storage.get(`comp_table_${rowIndex}_${header}`);
  };

  const addRow = async () => {
    const nextId = rowIds.length > 0 ? Math.max(...rowIds) + 1 : 0;
    const newIds = [...rowIds, nextId];
    setRowIds(newIds);
    await storage.save(STORAGE_KEY, newIds);
  };

  const removeRow = async (idToRemove: number) => {
    const newIds = rowIds.filter((id) => id !== idToRemove);
    setRowIds(newIds);
    await storage.save(STORAGE_KEY, newIds);
  };

  return {
    rowIds,
    addRow,
    removeRow,
    updateCompValue,
    getCompValue,
  };
}
