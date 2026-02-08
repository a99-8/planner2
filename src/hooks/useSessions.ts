"use client";

import { useEffect, useState, useCallback } from "react";
import { storage } from "@/logic/storageHandler";
// import function from logic
import * as sessionPersistence from "@/logic/session/persistence";
import * as sessionActivation from "@/logic/session/activation";
import * as sessionExcel from "@/logic/session/excel";
import { EvaluationSession, SessionState } from "@/logic/session/types";

export function useSessions(
  namespace: string,
  getCurrentState: () => SessionState,
) {
  const [sessions, setSessions] = useState<EvaluationSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  // تحميل القائمة الأولية عند تشغيل الهوك
  const loadSessions = useCallback(async () => {
    const list = (await storage.get(`${namespace}_sessions_list`)) || [];
    setSessions(list);
    const activeId = await storage.get(`${namespace}_current_session_id`);
    setCurrentSessionId(activeId);
  }, [namespace]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // --- 1. إنشاء جلسة جديدة ---
  const createSession = async (name: string) => {
    setLoading(true);
    try {
      const { newSession, updatedList } =
        await sessionPersistence.createSession(
          name,
          namespace,
          sessions,
          getCurrentState,
        );
      setSessions(updatedList);
      // تفعيل الجلسة فور إنشائها
      await sessionActivation.activateSession(
        newSession.id,
        namespace,
        updatedList,
      );
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. حفظ التعديلات في الجلسة الحالية ---
  const saveCurrentSession = async () => {
    if (!currentSessionId) return;
    setLoading(true);
    try {
      const updatedList = await sessionPersistence.saveCurrentSession(
        currentSessionId,
        namespace,
        sessions,
        getCurrentState,
      );
      setSessions(updatedList);
      setIsDirty(false);
      alert("تم حفظ التعديلات بنجاح ✅");
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. تفعيل جلسة موجودة ---
  const activateSession = async (id: string) => {
    setLoading(true);
    try {
      await sessionActivation.activateSession(id, namespace, sessions);
    } catch (error) {
      console.error("خطأ في التفعيل:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. إعادة تسمية جلسة ---
  const renameSession = async (id: string, newName: string) => {
    const updatedList = await sessionPersistence.renameSession(
      id,
      newName,
      namespace,
      sessions,
    );
    setSessions(updatedList);
  };

  // --- 5. حذف جلسة ---
  const deleteSession = async (id: string) => {
    const updatedList = await sessionPersistence.deleteSession(
      id,
      namespace,
      sessions,
    );
    setSessions(updatedList);
    if (id === currentSessionId) {
      await storage.save(`${namespace}_current_session_id`, null);
      setCurrentSessionId(null);
    }
  };

  // --- 6. تنظيف شامل للمساحة التخزينية ---
  const clearCurrentSessionState = async () => {
    setLoading(true);
    try {
      await sessionActivation.clearCurrentSessionState();
    } catch (error) {
      console.error("Error during cleanup:", error);
      alert("حدث خطأ أثناء تنظيف البيانات.");
    } finally {
      setLoading(false);
    }
  };

  // --- 7. تصدير الجلسة إلى ملف Excel ---
  const exportSessionToExcel = async (id: string) => {
    await sessionExcel.exportSessionToExcel(id, sessions);
  };

  // --- 8. استيراد جلسة من ملف Excel خارجي ---
  const importSessionFromExcel = async (file: File) => {
    setLoading(true);
    try {
      await sessionExcel.importSessionFromExcel(file, namespace);
      alert("تم استيراد الجلسة وتوزيع كافة البيانات بنجاح ✅");
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "فشل استيراد الملف");
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    currentSessionId,
    isDirty,
    loading,
    createSession,
    saveCurrentSession,
    activateSession,
    renameSession,
    deleteSession,
    clearCurrentSessionState,
    exportSessionToExcel,
    importSessionFromExcel,
    markDirty: () => setIsDirty(true),
  };
}
