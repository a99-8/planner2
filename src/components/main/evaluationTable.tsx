"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSections } from "@/hooks/useSections";
import { finalHead } from "@/lib";

export function EvaluationTable({ projectId }: { projectId: string }) {
  const { settlements, comparisons, lands, matrixdata } =
    useSections(projectId);
  if (!lands) return;
  const comNewHeaders = [...settlements, ...finalHead];
  return (
    <Table>
      <TableCaption>summary of the project</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center" colSpan={settlements.length + 1}>
            landsTableData
          </TableHead>
          {Array.from({ length: comparisons.count }).map((_, idx) => (
            <TableHead
              key={idx}
              className="text-center "
              colSpan={comNewHeaders.length}
            >
              المقارنة {idx + 1}
            </TableHead>
          ))}
        </TableRow>
        <TableRow>
          <TableHead>#</TableHead>

          {settlements.map((settlement, settIdx) => (
            <TableHead key={`${settIdx}`} className="text-center">
              {settlement}
            </TableHead>
          ))}

          {Array.from({ length: comparisons.count }).map((_, compIdx) =>
            comNewHeaders.map((settlement, settIdx) => (
              <TableHead
                key={`${compIdx}-${settIdx}`}
                className="text-center mx-1 border-2"
              >
                {settlement}
              </TableHead>
            )),
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({
          length: lands.dataRow?.[settlements[0]]?.length || 0,
        }).map((_, dataIdx) => (
          <TableRow key={dataIdx}>
            <TableCell key={dataIdx} className="text-center">
              {dataIdx + 1}
            </TableCell>
            {settlements.map((settlement, settIdx) => (
              <TableCell key={`${dataIdx}-${settIdx}`} className="text-center">
                {lands.dataRow?.[settlement]?.[settIdx]}
              </TableCell>
            ))}
            {Array.from({ length: comparisons.count }).map((_, compIdx) => {
              const matrixdatashow = matrixdata(comNewHeaders[compIdx]);
              return comNewHeaders.map((settlement, settIdx) => (
                <TableCell
                  key={`${compIdx}-${settIdx}`}
                  className="text-center"
                >
                  {settlements.includes(settlement)
                    ? matrixdatashow?.matrixActions?.getValue(
                        dataIdx + 1,
                        lands.dataRow?.[settlement]?.[settIdx],
                        "1",
                      ) || "notfound"
                    : "No"}
                </TableCell>
              ));
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
