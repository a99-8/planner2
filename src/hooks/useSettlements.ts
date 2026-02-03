import { useState } from "react";
import { storage } from "@/logic/storageHandler";

export const useSettlements = (key: string) => {
  const [state, setState] = useState({
    lastFileKey: key,
    columns:
      typeof window !== "undefined"
        ? storage.get(`${key}_selected_cols`) || []
        : [],
  });

  if (state.lastFileKey !== key) {
    const saved =
      typeof window !== "undefined"
        ? storage.get(`${key}_selected_cols`) || []
        : [];
    setState({
      lastFileKey: key,
      columns: saved,
    });
  }

  // when changeing save the new columns
  const toggleColumn = (columnName: string) => {
    const newSelection = state.columns.includes(columnName)
      ? state.columns.filter((col: string) => col !== columnName)
      : [...state.columns, columnName];

    setState({ ...state, columns: newSelection });
    storage.save(`${key}_selected_cols`, newSelection);
  };

  return { selectedColumns: state.columns, toggleColumn };
};
