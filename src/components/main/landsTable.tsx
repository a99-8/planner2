import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusHandler from "@/components/custom/StatusHandler";
import { Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSections } from "@/hooks/useSections";
import { useMemo } from "react";
import { transformToRows } from "@/lib/logic";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export function LandsTable({ projectId }: { projectId: string }) {
  const { lands, isLoading, hasData } = useSections(projectId);
  // show table function
  const tableData = useMemo(
    () => transformToRows(lands.dataRow || {}, lands.header || []),
    [lands.dataRow, lands.header],
  );

  const columns = useMemo(
    () =>
      (lands.header || []).map((h) => ({
        accessorKey: h,
        header: h,
      })),
    [lands.header],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  //===========================

  if (isLoading) {
    return <StatusHandler type="loading" />;
  }
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={lands.fileInputRef}
          onChange={lands.handleFileChange}
          className="hidden"
          accept=".csv"
        />
        <Button onClick={lands.openPicker} variant={"default"} className="">
          تحميل ملف csv
        </Button>

        {hasData && (
          <>
            <Button variant="destructive" onClick={lands.clear}>
              <Trash2 size={8} />
              مسح البيانات
            </Button>
            <Label className="bg-muted p-2 rounded border border-border">
              اسم الملف : {lands.fileName}
            </Label>
          </>
        )}
      </div>
      {hasData ? (
        <div className="border rounded-md overflow-x-auto w-full">
          <Table dir="rtl">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="min-w-[120px] text-center font-bold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows &&
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <StatusHandler type="noData" />
      )}
    </div>
  );
}
