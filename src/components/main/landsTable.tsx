import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectStructure } from "@/lib";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";
import { useProjectUpdate } from "@/hooks/useProjectMain";
import { useLandsSection } from "@/hooks/useSections/useLandsSection";

export function LandsTable(project: ProjectStructure) {
  const hasData = project.hasData;
  const update = useProjectUpdate(project.id, project);
  const lands = useLandsSection(project, update);

  return (
    <div className="border rounded-md overflow-x-auto w-full p-4 space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={lands.fileInputRef}
        onChange={lands.handleFileChange}
        className="hidden"
        accept=".csv"
      />

      {/* Control Bar */}
      <div className="flex items-center gap-4">
        <Button onClick={lands.openPicker}>Upload CSV</Button>

        {hasData && (
          <>
            <Label className="bg-muted p-2 rounded border border-border">
              {lands.fileName}
            </Label>

            <Button
              variant="destructive"
              onClick={lands.clear}
              className="gap-2"
            >
              <Trash2 size={16} />
              Clear Data
            </Button>
          </>
        )}
      </div>

      {/* Data Table */}
      {hasData && (
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              {Object.keys(lands.tableData).map((header) => (
                <TableHead
                  key={header}
                  className="min-w-[120px] text-center font-bold"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.values(lands.tableData)[0].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.entries(lands.tableData).map(
                  ([columnName, columnValues]) => (
                    <TableCell
                      key={`${rowIndex}-${columnName}`}
                      className="text-center"
                    >
                      {columnValues[rowIndex]}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
