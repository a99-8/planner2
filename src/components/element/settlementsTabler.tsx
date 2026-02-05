import { type CSVRow } from "@/types/csvRow";
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
import { useSettlements } from "@/hooks/useSettlements";

interface CSVTableProps {
  data: CSVRow[];
}

export function SettlementsPopover({ data }: CSVTableProps) {
  const { selectedColumns, toggleColumn } = useSettlements("page_settlements");
  if (data.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md text-muted-foreground">
        There is no data to display.
      </div>
    );
  }

  if (data.length === 0) return <div>No data...</div>;

  const columnNames = Object.keys(data[0]);
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
              {columnNames.map((columnName, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{columnName}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    <Checkbox
                      id={`check-${index}`}
                      checked={selectedColumns.includes(columnName)}
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
