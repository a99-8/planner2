/* eslint-disable @typescript-eslint/no-explicit-any */

export const storage = {
  save: (key: string, data: any) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  },
  get: (key: string): any | null => {
    if (typeof window !== "undefined") {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  remove: (key: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  },
};
