"use client";

import { ChevronDownIcon, MapPin } from "lucide-react";
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
import { comparisonsType, dealReferences } from "@/lib";

export function ComparisonCell({
  field,
  value, // مرر القيمة مباشرة بدلاً من الدالة
  onChange, // اجعل الاسم بسيطاً
}: {
  field: string;
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <div className="flex justify-center items-center min-h-[40px] w-full border-x">
      {(() => {
        switch (field) {
          case "نوع المقارنة":
            return (
              <Select dir="rtl" value={value} onValueChange={onChange}>
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
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-full justify-between text-right font-normal px-2"
                  >
                    <span className="truncate text-[10px]">{value}</span>
                    <ChevronDownIcon className="h-3 w-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            );
          }

          case "نوع المرجع":
            return (
              <div className="flex items-center w-full gap-1 px-1">
                <Select value={value} onValueChange={onChange} dir="rtl">
                  <SelectTrigger className="h-7 w-full bg-transparent border-none p-0 shadow-none text-[10px]">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {dealReferences.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );

          case "الاحداثيات":
            return (
              <div className="relative w-full px-1">
                <Input
                  placeholder="طول، عرض"
                  className="h-7 text-[10px] pr-6 border-none bg-muted/10 text-center"
                  value={value}
                  onChange={onChange}
                />
                <MapPin className="absolute right-2 top-2 h-3 w-3 text-muted-foreground opacity-70" />
              </div>
            );

          default:
            return (
              <Input
                className="h-8 text-center border-none focus-visible:ring-1 bg-transparent text-sm"
                value={value}
                onChange={onChange}
              />
            );
        }
      })()}
    </div>
  );
}
