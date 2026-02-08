const DB_NAME = "CSV_Database";
const STORE_NAME = "csv_store";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    //open database
    const request = indexedDB.open(DB_NAME, 1);

    //updata data when needed
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const storage = {
  save: async (key: string, data: any): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(data, key);

      tx.oncomplete = () => resolve(); // العملية نجحت
      tx.onerror = () => reject(tx.error); // العملية فشلت
    });
  },

  get: async (key: string): Promise<any> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  remove: async (key: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);

      tx.oncomplete = () => resolve(); // الآن أصبحت تعود بـ Promise<void> حقيقي
      tx.onerror = () => reject(tx.error);
    });
  },
};
