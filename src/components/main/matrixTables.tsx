"use client";

import { MatrixControl } from "@/components/other/matrixControl";
import { useSections } from "@/hooks/useSections";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export function MatrixTables({ projectId }: { projectId: string }) {
  const { matrixdata, settlements } = useSections(projectId);
  return (
    <div>
      {settlements.map((settlement, index) => {
        const data = matrixdata(settlement);
        if (!data) return null;

        const { frRow, frCol, matrixActions } = data;
        return (
          <div key={index} className="mb-8">
            <MatrixControl projectId={projectId} settlement={settlement} />
            <Table className="border">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="bg-secondary/10 font-bold text-center border min-w-[150px]">
                    المقارنة / {settlement}
                  </TableHead>
                  {frRow.map((value: any, idx: number) => (
                    <TableHead
                      key={`${settlement}-h-${idx}`}
                      className="text-center border min-w-[100px] font-semibold"
                    >
                      {value}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {frCol.map((value: any, idx: number) => (
                  <TableRow
                    key={`${settlement}-r-${idx}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="border font-medium bg-muted/10">
                      المقارنة {idx + 1} : {value}
                    </TableCell>

                    {/* هنا سيتم عرض مدخلات القيم المحسوبة */}
                    {frRow.map((_, colIdx: number) => (
                      <TableCell
                        key={`${settlement}-cell-${idx}-${colIdx}`}
                        className="p-1 border"
                      >
                        <Input
                          className="h-8 text-center border-none focus-visible:ring-1"
                          placeholder="0"
                          defaultValue={matrixActions.getValue(
                            idx + 1,
                            String(colIdx),
                            String(value),
                          )}
                          onBlur={(e) =>
                            matrixActions.updateCell(
                              idx + 1,
                              String(colIdx),
                              String(value),
                              e.target.value,
                            )
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}
