import { useRef, useMemo, useCallback } from "react";
import { ProjectStructure, parseCsvToColumnsStructure } from "@/lib";

// ================== useLandsSection =================================

export const useLandsSection = (
  project: ProjectStructure,
  update: (recipe: (draft: ProjectStructure) => void) => Promise<any>,
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const { columns, fileName } = await parseCsvToColumnsStructure(file);

      await update((draft) => {
        ((draft.hasData = true),
          ((draft.landsTable.fileName = fileName),
          (draft.landsTable.tableData = columns)));
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [update],
  );

  const clear = useCallback(
    () =>
      update((draft) => {
        ((draft.hasData = false),
          (draft.landsTable = {
            fileName: "",
            tableData: {},
          }));
      }),
    [update],
  );

  const lands = useMemo(
    () => ({
      fileName: project?.landsTable?.fileName || "",
      tableData: project?.landsTable.tableData || {},
      handleFileChange,
      fileInputRef,
      openPicker: () => fileInputRef.current?.click(),
      clear,
    }),
    [project?.landsTable, handleFileChange, clear],
  );

  return lands;
};
