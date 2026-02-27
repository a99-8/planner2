import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectStructure } from "@/lib";
import { AlertCircle } from "lucide-react";
import StatusHandler from "../custom/StatusHandler";
import { useProjectUpdate } from "@/hooks/useProjectMain";
import { useControlsSection } from "@/hooks/useSections/useControlPanel";

export function ControlPanel(project: ProjectStructure) {
  const update = useProjectUpdate(project.id, project);
  const controls = useControlsSection(project, update);

  if (!project.hasData || !controls) return <StatusHandler type="noData" />;

  return (
    <Table>
      <TableCaption className="pb-4">جدول التحكم في المشروع</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted/30">
          {controls.mainHeaders.map((h, i) => (
            <TableHead
              key={i}
              className="text-center border-x font-bold"
              colSpan={h.colSpan}
            >
              {h.label}
            </TableHead>
          ))}
        </TableRow>
        <TableRow>
          {controls.subHeaders.map((h, i) => (
            <TableHead key={i} className="text-center border-x text-xs">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {controls.landHeader.map((header, idx) => (
          <TableRow key={idx} className="hover:bg-muted/5">
            <TableCell className="flex items-center gap-1">
              {header}
              <AlertCircle
                size={14}
                className={
                  controls.isDataValid(header)
                    ? "text-green-600"
                    : "text-amber-600"
                }
              />
            </TableCell>
            {controls.disCells.map((cell) => (
              <TableCell key={cell.id} className="text-center border-x p-2">
                <Checkbox
                  checked={controls.getCheak(header, cell.id)}
                  onCheckedChange={() => controls.toggleColumn(header, cell.id)}
                  disabled={
                    !controls.isDataValid(header) && !cell.validWithText
                  }
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
