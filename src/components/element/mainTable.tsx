import { type CSVRow } from "@/types/csvRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CSVTableProps {
  data: CSVRow[];
}

export function MainTable({ data }: CSVTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md text-muted-foreground">
        لا توجد بيانات لعرضها.
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="border rounded-md overflow-x-auto w-fit">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead className="w-[100px] text-center" key={header}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, i) => (
                <TableCell className="w-[100px] text-center" key={i}>
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
