import { useState, useRef, useEffect } from "react";
import { storage } from "@/logic/storageHandler";
import { parseCSV } from "@/logic/csvParser";
import { type CSVRow } from "@/types/csvRow";

export const useCSVHandler = (key: string) => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("No file chosen");
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // عند التحميل: اطلب من الـ Storage استرجاع البيانات
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedData = storage.get(key);
      const savedName = storage.get(`${key}_name`);

      if (Array.isArray(savedData)) setData(savedData);
      if (savedName) setFileName(savedName);
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [key]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. معالجة الملف (Parser Logic)
    const result = await parseCSV(file);

    // 2. حفظ النتائج (Storage Logic)
    storage.save(key, result.data);
    storage.save(`${key}_name`, result.name);

    // 3. تحديث الواجهة
    setData(result.data);
    setFileName(result.name);
  };

  return {
    data,
    fileName,
    fileInputRef,
    handleFileChange,
    openFilePicker: () => fileInputRef.current?.click(),
    isMounted,
  };
};
