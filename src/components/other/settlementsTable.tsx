import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import StatusHandler from "../custom/StatusHandler";
import { useSettlements } from "@/hooks/useOther";

export function SettlementsPopover({ projectId }: { projectId: string }) {
  const { allAvailableColumns, selectedHeaders, toggleColumn, isLoading } =
    useSettlements(projectId);
  if (allAvailableColumns.length === 0) return <StatusHandler type="noData" />;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Settlements</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="border rounded-md overflow-hidden w-fit">
          <Table dir="rtl">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">الأعمدة</TableHead>
                <TableHead className="w-[100px] text-center font-bold">
                  تسوية ؟
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAvailableColumns.map((columnName, index) => (
                <TableRow key={columnName}>
                  <TableCell className="font-medium">{columnName}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      id={`check-${index}`}
                      // إذا كان العمود موجود في المصفوفة المختارة، يكون مفعل
                      checked={selectedHeaders.includes(columnName)}
                      onCheckedChange={() => toggleColumn(columnName)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
}
