"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MainTable } from "@/components/mainTable";
import { useCSVHandler } from "@/hooks/useCSVHandler";

export default function Home() {
  const {
    data,
    fileName,
    fileInputRef,
    handleFileChange,
    openFilePicker,
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
      </div>

      <MainTable data={data} />
    </div>
  );
}
