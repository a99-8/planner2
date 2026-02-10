import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Project } from "@/types/userTypes";
import { Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLands } from "@/hooks/main/useLands";
import StatusHandler from "@/components/other/StatusHandler";
import { LandsTable } from "@/components/main/landsTable";

const Lands = (project: Project) => {
  const {
    data,
    headers,
    fileName,
    handleFileChange,
    openFilePicker,
    clearData,
    isMounted,
    fileInputRef,
  } = useLands(project.id);

  if (!isMounted) {
    return <StatusHandler type="loading" />;
  }

  const hasData =
    headers.length > 0 && data[headers[0]] && data[headers[0]].length > 0;

  return (
    <AccordionItem value={"Lands"} dir="rtl">
      <AccordionTrigger>Lands</AccordionTrigger>
      <AccordionContent>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv"
            />

            <Button onClick={openFilePicker}>تحميل ملف csv</Button>

            <Label className="bg-muted p-2 rounded border border-border">
              اسم الملف : {fileName}
            </Label>

            {hasData && (
              <Button
                variant="destructive"
                onClick={clearData}
                className="gap-2"
              >
                <Trash2 size={8} />
                Clear Data
              </Button>
            )}
          </div>
          <LandsTable data={data} headers={headers} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Lands;
