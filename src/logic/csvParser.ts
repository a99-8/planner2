import Papa from "papaparse";
import { type CSVRow } from "@/types/csvRow";

export const parseCSV = (
  file: File,
): Promise<{ data: CSVRow[]; name: string }> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({ data: results.data, name: file.name });
      },
      error: (error) => reject(error),
    });
  });
};
