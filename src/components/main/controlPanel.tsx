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
import { useControlsSection } from "@/hooks/useSections";
import { controlsData, isDataValid, disCells, mainHeaders, sync } from "@/lib";

export function ControlPanel(project: ProjectStructure) {
  const controls = useControlsSection(project);
  const { get } = sync(project);
  const { landHeader = [], subHeaders = [] } = controlsData(project) || {};

  if (!project.hasData || !controls || landHeader.length === 0)
    return <StatusHandler type="noData" />;

  return (
    <Table>
      <TableCaption className="pb-4">جدول التحكم في المشروع</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted/30">
          {mainHeaders.map((h, i) => (
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
          {subHeaders.map((h, i) => (
            <TableHead key={i} className="text-center border-x text-xs">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {landHeader.map((header, idx) => (
          <TableRow key={idx} className="hover:bg-muted/5">
            <TableCell className="flex items-center gap-1">
              {header}
              <AlertCircle
                size={14}
                className={
                  isDataValid(project?.landsTable?.tableData?.[header])
                    ? "text-green-600"
                    : "text-amber-600"
                }
              />
            </TableCell>
            {disCells.map((cell) => (
              <TableCell key={cell.id} className="text-center border-x p-2">
                <Checkbox
                  checked={get.checked(header, cell.id)}
                  onCheckedChange={() => controls.toggleColumn(header, cell.id)}
                  disabled={
                    !isDataValid(project?.landsTable?.tableData?.[header]) &&
                    !cell.validWithText
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
