import { storage } from "@/logic/storageHandler";
import { v4 as uuid } from "uuid";
import { EvaluationSession, SessionState } from "@/logic/session/types";

export const createSession = async (
  name: string,
  namespace: string,
  sessions: EvaluationSession[],
  getCurrentState: () => SessionState,
) => {
  const id = uuid();
  const now = Date.now();
  const currentState = getCurrentState();

  const newSession: EvaluationSession = {
    id,
    name,
    state: currentState,
    createdAt: now,
    updatedAt: now,
  };

  const updatedList = [...sessions, newSession];
  await storage.save(`${namespace}_sessions_list`, updatedList);
  return { newSession, updatedList };
};

export const saveCurrentSession = async (
  currentSessionId: string,
  namespace: string,
  sessions: EvaluationSession[],
  getCurrentState: () => SessionState,
) => {
  const currentState = getCurrentState();
  const now = Date.now();

  const updatedList = sessions.map((s) =>
    s.id === currentSessionId
      ? { ...s, state: currentState, updatedAt: now }
      : s,
  );

  await storage.save(`${namespace}_sessions_list`, updatedList);
  return updatedList;
};

export const renameSession = async (
  id: string,
  newName: string,
  namespace: string,
  sessions: EvaluationSession[],
) => {
  const updatedList = sessions.map((s) =>
    s.id === id ? { ...s, name: newName, updatedAt: Date.now() } : s,
  );
  await storage.save(`${namespace}_sessions_list`, updatedList);
  return updatedList;
};

export const deleteSession = async (
  id: string,
  namespace: string,
  sessions: EvaluationSession[],
) => {
  const updatedList = sessions.filter((s) => s.id !== id);
  await storage.save(`${namespace}_sessions_list`, updatedList);
  return updatedList;
};
