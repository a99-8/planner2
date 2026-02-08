"use client";

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

import { useSettlements } from "@/hooks/other/useSettlements";
import { type CSVRow } from "@/types/csvRow";
import { useMatrix } from "@/hooks/useMatrix";
import { useComparison } from "@/hooks/useComparison";
import { SmartCell } from "../other/smartCell";

export function SettlementsTables({ data }: { data: CSVRow[] }) {
  const { selectedColumns } = useSettlements("page_settlements");
  const { updateCellValue, getCellValue } = useMatrix("page_settlements");

  const { rowIds = [0, 1, 2] } = useComparison("page_settlements");

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
            className="border rounded-lg px-4 shadow-sm"
          >
            <AccordionTrigger className="text-lg font-bold hover:no-underline">
              تسوية: {columnName}
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto pb-4">
                <Table className="border">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="bg-secondary/10 font-bold text-center border min-w-[150px]">
                        المقارنة / {columnName}
                      </TableHead>
                      {uniqueValues.map((value, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center border min-w-[100px] font-semibold"
                        >
                          {value}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rowIds.map((rowId, index) => (
                      <TableRow
                        key={rowId}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <SmartCell
                          type="header"
                          id={index + 1}
                          field={columnName}
                          extraId={rowId}
                        />

                        {uniqueValues.map((value, valIndex) => (
                          <TableCell key={valIndex} className="p-1 border">
                            <SmartCell
                              type="matrix"
                              id={columnName}
                              field={value}
                              extraId={rowId}
                              onUpdate={(newValue) =>
                                updateCellValue(
                                  columnName,
                                  value,
                                  rowId,
                                  newValue,
                                )
                              }
                              onFetch={() =>
                                getCellValue(columnName, value, rowId)
                              }
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
