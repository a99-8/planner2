import { storage } from "@/logic/storageHandler";

export const useComparison = (key: string) => {
  const updateCompValue = async (
    rowIndex: number,
    header: string,
    value: string,
  ) => {
    const storageKey = `comp_table_${rowIndex}_${header}`;
    await storage.save(storageKey, value);
  };

  const getCompValue = async (rowIndex: number, header: string) => {
    const storageKey = `comp_table_${rowIndex}_${header}`;
    return await storage.get(storageKey);
  };

  return {
    updateCompValue,
    getCompValue,
  };
};
