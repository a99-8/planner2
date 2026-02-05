import { useState, useRef, useEffect } from "react";
import { storage } from "@/logic/storageHandler";
import { parseCSV } from "@/logic/csvParser";
import { type CSVRow } from "@/types/csvRow";

export const useCSVHandler = (key: string) => {
  // Start Defining variables //
  const [state, setState] = useState({
    data: [] as CSVRow[],
    fileName: "No file chosen",
  });
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // end Defining variables //

  // uploda data for the frist time
  useEffect(() => {
    const loadData = async () => {
      // uploda data from the web browser
      const savedData = (await storage.get(key)) || [];
      const savedName = (await storage.get(`${key}_name`)) || "No file chosen";

      // updata data + state from the web browser
      setState({ data: savedData, fileName: savedName });
      setIsMounted(true);
    };

    loadData();
  }, [key]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // pack up file
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // read and storage data
      const { data, name } = await parseCSV(file);
      await storage.save(key, data);
      await storage.save(`${key}_name`, name);
      // updata the state of data
      setState({ data, fileName: name });
    } catch (error) {
      console.error("Error parsing/saving CSV:", error);
    }
  };

  const clearData = async () => {
    await storage.remove(key);
    await storage.remove(`${key}_name`);

    setState({
      data: [],
      fileName: "No file chosen",
    });
  };

  return {
    ...state,
    fileInputRef,
    handleFileChange,
    openFilePicker: () => fileInputRef.current?.click(),
    clearData,
    isMounted,
  };
};
