"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MainTable } from "@/components/element/mainTable";
import { useCSVHandler } from "@/hooks/useCSVHandler";
import { Trash2 } from "lucide-react";

export default function Home() {
  const {
    data,
    fileName,
    fileInputRef,
    handleFileChange,
    openFilePicker,
    clearData,
    isMounted,
  } = useCSVHandler("main_dashboard");

  if (!isMounted) {
    return <div className="p-6">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />

        <Button onClick={openFilePicker}>Upload CSV</Button>

        <Label className="bg-muted p-2 rounded border border-border">
          {fileName}
        </Label>

        {data.length > 0 && (
          <Button variant="destructive" onClick={clearData} className="gap-2">
            <Trash2 size={16} />
            Clear Data
          </Button>
        )}
      </div>

      <MainTable data={data} />
    </div>
  );
}
