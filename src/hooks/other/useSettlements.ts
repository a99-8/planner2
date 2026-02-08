import { useState, useEffect } from "react";
import { storage } from "@/logic/storageHandler";

export const useSettlements = (key: string) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // uploda data for the frist time
  useEffect(() => {
    const loadSavedColumns = async () => {
      const saved = await storage.get(`${key}_selected_cols`);
      if (saved) {
        setColumns(saved);
      }
      setIsLoaded(true);
    };
    loadSavedColumns();
  }, [key]);

  // listener so the comparison table updata
  useEffect(() => {
    const handleStorageUpdate = async () => {
      const updatedData = await storage.get(`${key}_selected_cols`);
      setColumns(updatedData || []);
    };

    window.addEventListener("settlements_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("settlements_updated", handleStorageUpdate);
    };
  }, [key]);

  // updata data when click on the cheak box
  const toggleColumn = async (columnName: string) => {
    const newSelection = columns.includes(columnName)
      ? columns.filter((col) => col !== columnName)
      : [...columns, columnName];

    setColumns(newSelection);

    // save data in storage
    await storage.save(`${key}_selected_cols`, newSelection);

    // make the other com notice
    window.dispatchEvent(new Event("settlements_updated"));
  };

  return {
    selectedColumns: columns,
    isLoaded,
    toggleColumn,
  };
};
