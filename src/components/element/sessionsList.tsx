"use client";

import { SessionsListButton } from "@/components/other/sessionsListButton";
import { sessionsListButtons } from "@/constant/sessionsListButtons";

interface Session {
  id: string;
  name: string;
  updatedAt: string | Date | number;
}

interface SessionsManagerProps {
  sessions: Session[];
  currentSessionId: string | null;
  activateSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  exportFullReport: (id: string) => Promise<void>;
  deleteSession: (id: string) => void;
}

export function SessionsList({
  sessions,
  currentSessionId,
  activateSession,
  renameSession,
  exportFullReport,
  deleteSession,
}: SessionsManagerProps) {
  const handleAction = async (actionId: string, session: Session) => {
    switch (actionId) {
      case "activation":
        activateSession(session.id);
        break;
      case "rename":
        const n = prompt("الاسم الجديد:", session.name);
        if (n) renameSession(session.id, n);
        break;
      case "export":
        await exportFullReport(session.id);
        break;
      case "delete":
        if (confirm("هل أنت متأكد من حذف هذه الجلسة؟")) {
          deleteSession(session.id);
        }
        break;
    }
  };

  return (
    <div className="border rounded-xl p-5 bg-card shadow-sm">
      <h2 className="font-bold mb-4 border-b pb-2">الجلسات المحفوظة</h2>
      {sessions.length === 0 ? (
        <p className="text-muted-foreground italic text-center py-4">
          لا توجد جلسات.
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between border rounded-lg p-3 transition-colors ${
                s.id === currentSessionId
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg">{s.name}</span>
                <span className="text-xs text-gray-500">
                  آخر تحديث: {new Date(s.updatedAt).toLocaleString("ar-EG")}
                </span>
              </div>

              <div className="flex gap-2 text-sm">
                {sessionsListButtons.map((btn) => (
                  <SessionsListButton
                    key={btn.id}
                    className={btn.className}
                    description={btn.description}
                    icon={<btn.icon size={18} />}
                    onClick={() => handleAction(btn.id, s)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
