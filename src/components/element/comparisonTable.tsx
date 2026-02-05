import { type CSVRow } from "@/types/csvRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSettlements } from "@/hooks/useSettlements";
import { useComparison } from "@/hooks/useComparison";
import { ComparisonCell } from "../other/ComparisonCell";
import { prossHeaders } from "@/logic/settlementsHeaders";

export function ComparisonTable({ data }: { data: CSVRow[] }) {
  const { selectedColumns } = useSettlements("page_settlements");
  const { updateCompValue, getCompValue } = useComparison("page_settlements");
  const allHeaders = prossHeaders(selectedColumns);

  return (
    <div className="border rounded-md overflow-x-auto w-full shadow-sm">
      <Table dir="rtl">
        <TableHeader className="bg-secondary/20">
          <TableRow>
            {allHeaders.map((header) => (
              <TableHead
                key={header}
                className="text-center font-bold border-x whitespace-nowrap"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-muted/30">
              {allHeaders.map((header) => (
                <TableCell
                  key={`${rowIndex}-${header}`}
                  className="p-1 border-x"
                >
                  <ComparisonCell
                    rowIndex={rowIndex}
                    header={header}
                    updateCompValue={updateCompValue}
                    getCompValue={getCompValue}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
