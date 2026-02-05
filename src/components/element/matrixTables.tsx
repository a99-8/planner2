import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSettlements } from "@/hooks/useSettlements";
import { type CSVRow } from "@/types/csvRow";
import { useMatrix } from "@/hooks/usematrix";
import { MatrixInput } from "../other/MatrixInput";

export function SettlementsTables({ data }: { data: CSVRow[] }) {
  const { selectedColumns } = useSettlements("page_settlements");
  const { updateCellValue, getCellValue } = useMatrix("page_settlements");

  if (selectedColumns.length === 0)
    return <div className="p-10 text-center">يرجى اختيار أعمدة...</div>;

  return (
    <Accordion type="multiple" className="w-auto m-5 space-y-4" dir="rtl">
      {selectedColumns.map((columnName) => {
        const uniqueValues = Array.from(
          new Set(data.map((row) => row[columnName]?.toString() || "")),
        ).filter(Boolean);

        return (
          <AccordionItem
            key={columnName}
            value={columnName}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="text-lg font-bold">
              تسوية: {columnName}
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto pb-4">
                <Table className="border">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="bg-secondary font-bold text-center border min-w-[150px]">
                        المقارنة / {columnName}
                      </TableHead>
                      {uniqueValues.map((value, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center border min-w-[100px]"
                        >
                          {value}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((compNum) => (
                      <TableRow key={compNum}>
                        <TableCell className="font-bold bg-muted/30 text-center border">
                          مقارنة {compNum}
                        </TableCell>
                        {uniqueValues.map((value, valIndex) => (
                          <TableCell key={valIndex} className="p-1 border">
                            <MatrixInput
                              columnName={columnName}
                              rowValue={value}
                              compIndex={compNum}
                              updateCellValue={updateCellValue}
                              getCellValue={getCellValue}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
