"use client";

import { format } from "date-fns";
import { ChevronDownIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSmartCell } from "@/hooks/useOther";
import { comparisonsType, dealReferences } from "@/lib";

interface SmartCellUIProps {
  field: string;
  onUpdate: (val: any) => void;
  onFetch: () => Promise<any>;
}

export function SmartCell(props: SmartCellUIProps) {
  const { val, handleUpdate } = useSmartCell(props);
  const { field } = props;

  return (
    <div className="flex justify-center items-center min-h-[40px] w-full border-x">
      {renderContent(field, val, handleUpdate)}
    </div>
  );
}

// دالة مساعدة للفصل التام بين المنطق والعرض
function renderContent(
  field: string,
  val: any,
  handleUpdate: (v: any) => void,
) {
  switch (field) {
    case "نوع المقارنة":
      return (
        <Select dir="rtl" value={val} onValueChange={handleUpdate}>
          <SelectTrigger className="h-8 w-full bg-transparent border-none shadow-none focus:ring-1">
            <SelectValue placeholder="نوع" />
          </SelectTrigger>
          <SelectContent>
            {comparisonsType.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "التاريخ": {
      const dateValue = val ? new Date(val) : undefined;
      const isValid = dateValue instanceof Date && !isNaN(dateValue.getTime());
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-8 w-full justify-between text-right font-normal px-2",
                !val && "text-muted-foreground",
              )}
            >
              <span className="truncate text-[10px]">
                {isValid ? format(dateValue, "yyyy/MM/dd") : "اختر تاريخ"}
              </span>
              <ChevronDownIcon className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(d) => handleUpdate(d?.toISOString())}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    case "الرقم المرجعي":
      return (
        <div className="flex items-center w-full gap-1 px-1">
          <Select
            value={val?.type || ""}
            onValueChange={(t) => handleUpdate({ ...val, type: t })}
            dir="rtl"
          >
            <SelectTrigger className="h-7 w-[50px] bg-transparent border-none p-0 shadow-none text-[10px]">
              <SelectValue placeholder="نوع" />
            </SelectTrigger>
            <SelectContent>
              {dealReferences.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="h-6 flex-1 border-none bg-muted/20 text-center p-1 text-[10px]"
            value={val?.number || ""}
            onChange={(e) => handleUpdate({ ...val, number: e.target.value })}
          />
        </div>
      );

    case "الاحداثيات":
      return (
        <div className="relative w-full px-1">
          <Input
            placeholder="طول، عرض"
            className="h-7 text-[10px] pr-6 border-none bg-muted/10 text-center"
            value={val || ""}
            onChange={(e) => handleUpdate(e.target.value)}
          />
          <MapPin className="absolute right-2 top-2 h-3 w-3 text-muted-foreground opacity-70" />
        </div>
      );

    default:
      return (
        <Input
          className="h-8 text-center border-none focus-visible:ring-1 bg-transparent text-sm"
          type="number"
          value={val ?? ""}
          onChange={(e) => handleUpdate(e.target.value)}
        />
      );
  }
}
