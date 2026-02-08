"use client";

import { useRef } from "react";
import { useCSVHandler } from "@/hooks/useCSVHandler";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useSettlements } from "@/hooks/other/useSettlements";
import { useComparison } from "@/hooks/useComparison";
import { useSessions } from "@/hooks/useSessions";
import { exportFullReportToExcel } from "@/logic/exportFullReportToExcel";
import { CustomButton } from "@/components/other/customButton";
import { SessionsList } from "@/components/element/sessionsList";
import { storage } from "@/logic/storageHandler";
import {
  ACTION_BUTTONS_CONFIG,
  ActionButtonConfig,
} from "@/constant/actionButtons";

export default function SessionsMangerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data, isMounted } = useCSVHandler("page_settlements");
  const { snapshot, loading } = useEvaluation("page_settlements", data || []);
  const { selectedColumns } = useSettlements("page_settlements");
  const { rowIds } = useComparison("page_settlements");

  const getFullState = () => {
    return {
      snapshot,
      data,
      selectedColumns,
      rowIds,
      comparisons: {},
      matrix: {},
    };
  };

  const {
    sessions,
    currentSessionId,
    createSession,
    saveCurrentSession,
    activateSession,
    renameSession,
    deleteSession,
    importSessionFromExcel,
    clearCurrentSessionState,
  } = useSessions("page_settlements", getFullState);

  const actionButtons: ActionButtonConfig[] = ACTION_BUTTONS_CONFIG.map(
    (btn) => {
      switch (btn.id) {
        case "create":
          return {
            ...btn,
            onClick: () => {
              const name = prompt("أدخل اسم الجلسة الجديدة:");
              if (name) createSession(name);
            },
            disabled: false,
          };
        case "save":
          return {
            ...btn,
            onClick: saveCurrentSession,
            disabled: !currentSessionId || loading,
          };
        case "clear":
          return {
            ...btn,
            onClick: () => {
              if (
                confirm(
                  "سيتم تنظيف الجلسة الحالية وحذف البيانات غير المحفوظة، هل أنت متأكد؟",
                )
              )
                clearCurrentSessionState();
            },
            disabled: false,
          };
        case "import":
          return {
            ...btn,
            onClick: () => fileInputRef.current?.click(),
            disabled: false,
          };
        case "report":
          return {
            ...btn,
            onClick: () =>
              exportFullReportToExcel({
                snapshot,
                data,
                selectedColumns,
                rowIds,
              }),
            disabled: snapshot.rows.length === 0,
          };
        default:
          return btn;
      }
    },
  );

  const handleExportFullReport = async (sessionId: string) => {
    try {
      const keyToRead =
        sessionId === "current" ? "page_settlements" : `${sessionId}_csv_data`;
      const csvData = await storage.get(keyToRead);
      const selectedColumns =
        (await storage.get(`${sessionId}_selectedColumns`)) || [];
      const rowIds = (await storage.get(`${sessionId}_rowIds`)) || [];
      const savedSnapshot = await storage.get(
        `${sessionId}_evaluation_snapshot`,
      );

      if (!csvData || csvData.length === 0) {
        alert("لا توجد بيانات لتصديرها لهذه الجلسة");
        return;
      }

      await exportFullReportToExcel({
        snapshot: savedSnapshot,
        data: csvData,
        selectedColumns: selectedColumns,
        rowIds: rowIds,
      });
    } catch (error) {
      console.error("خطأ أثناء التصدير:", error);
      alert("حدث خطأ أثناء محاولة تصدير الملف");
    }
  };

  if (!isMounted) {
    return (
      <div className="p-10 text-center animate-pulse font-bold text-lg">
        جاري مزامنة بيانات النظام...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          إدارة الجلسات
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          قم بحفظ واسترجاع سيناريوهات التقييم المختلفة.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300">
        {actionButtons.map((btn) => {
          const IconComp = btn.icon;
          return (
            <CustomButton
              key={btn.id}
              label={btn.label}
              className={btn.className}
              disabled={btn.disabled}
              onClick={btn.onClick!}
              icon={<IconComp className="w-4 h-4" />}
            />
          );
        })}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          await importSessionFromExcel(file);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-1 gap-6">
        <SessionsList
          sessions={sessions}
          currentSessionId={currentSessionId}
          activateSession={activateSession}
          renameSession={renameSession}
          exportFullReport={handleExportFullReport}
          deleteSession={deleteSession}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${currentSessionId ? "bg-green-500 animate-ping" : "bg-gray-300"}`}
          />
          <span className="text-sm font-medium">
            {currentSessionId
              ? `الجلسة النشطة: ${sessions.find((s) => s.id === currentSessionId)?.name || "غير معروفة"}`
              : "لا توجد جلسة نشطة حالياً"}
          </span>
        </div>
        {loading && (
          <span className="text-xs text-blue-600 font-bold animate-pulse">
            جاري الحفظ...
          </span>
        )}
      </div>
    </div>
  );
}
