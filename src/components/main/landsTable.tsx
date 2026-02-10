import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusHandler } from "@/components/other/otherList";

// تحديد النوع لاستلام البيانات الجديدة
interface LandsTableProps {
  data: Record<string, any[]>;
  headers: string[];
}

export function LandsTable({ data, headers }: LandsTableProps) {
  // التحقق من وجود بيانات (نتأكد أن أول مصفوفة ليست فارغة)
  const hasData = headers.length > 0 && data[headers[0]]?.length > 0;

  if (!hasData) return <StatusHandler type="noData" />;

  // نأخذ عدد الصفوف من أول عمود موجود
  const rowCount = data[headers[0]].length;

  return (
    <div className="border rounded-md overflow-x-auto w-full">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead
                className="min-w-[120px] text-center font-bold"
                key={header}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* نقوم بعمل Loop بناءً على عدد الصفوف */}
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {/* لكل صف، نقوم بالمرور على العناوين لجلب قيمة الخلية في هذا السطر */}
              {headers.map((header) => (
                <TableCell
                  className="text-center"
                  key={`${rowIndex}-${header}`}
                >
                  {data[header][rowIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
