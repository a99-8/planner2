import { storage } from "@/logic/storageHandler";
import { EvaluationSession } from "@/logic/session/types";

export const activateSession = async (
  id: string,
  namespace: string,
  sessions: EvaluationSession[],
) => {
  const session = sessions.find((s) => s.id === id);
  if (!session) return;

  const { state } = session;
  await Promise.all([
    storage.save("main_dashboard_csv_data", state.data),
    storage.save("page_settlements_selected_columns", state.selectedColumns),
    storage.save("page_settlements_row_ids", state.rowIds),
    storage.save("page_settlements_last_snapshot", state.snapshot),
    storage.save(`${namespace}_current_session_id`, id),
  ]);

  window.location.reload();
};

export const clearCurrentSessionState = async () => {
  const rowIds = (await storage.get("page_settlements_row_ids")) || [];
  const selectedCols =
    (await storage.get("page_settlements_selected_cols")) || [];
  const csvData = (await storage.get("main_dashboard")) || [];

  const deletionPromises: Promise<void>[] = [];

  csvData.forEach((row: any) => {
    selectedCols.forEach((col: string) => {
      rowIds.forEach((id: number) => {
        const cellValue = row[col];
        if (cellValue !== undefined) {
          deletionPromises.push(
            storage.remove(`matrix_${col}_${id}_${cellValue}`),
          );
        }
      });
    });
  });

  const staticKeys = [
    "main_dashboard",
    "main_dashboard_name",
    "page_settlements_selected_cols",
    "page_settlements_row_ids",
    "page_settlements_last_snapshot",
    "page_settlements_row_weights",
    "page_settlements_current_session_id",
  ];

  staticKeys.forEach((key) => deletionPromises.push(storage.remove(key)));
  await Promise.all(deletionPromises);
  window.location.reload();
};
