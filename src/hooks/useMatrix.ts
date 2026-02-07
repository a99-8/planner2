import { storage } from "@/logic/storageHandler";

export const useMatrix = (key: string) => {
  const updateCellValue = async (
    columnName: string,
    rowValue: string,
    compIndex: number,
    newValue: string,
  ) => {
    const storageKey = `matrix_${columnName}_${compIndex}_${rowValue}`;
    await storage.save(storageKey, newValue);
  };

  const getCellValue = async (
    columnName: string,
    rowValue: string,
    compIndex: number,
  ) => {
    const storageKey = `matrix_${columnName}_${compIndex}_${rowValue}`;
    return await storage.get(storageKey);
  };

  return {
    updateCellValue,
    getCellValue,
  };
};
