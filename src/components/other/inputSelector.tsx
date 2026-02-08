"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon, MapPin, ClipboardPaste } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputSelectorProps {
  inputType: string;
  value: any;
  onChange: (val: any) => void;
}

export function InputSelector({
  inputType,
  value,
  onChange,
}: InputSelectorProps) {
  const handleCoordinateInput = (input: string) => {
    const geoRegex = /([-+]?[\d\.]+),\s*([-+]?[\d\.]+)/;
    const match = input.match(geoRegex);

    if (match) {
      onChange(`${match[1]}, ${match[2]}`);
    } else {
      onChange(input);
    }
  };

  switch (inputType) {
    case "نوع المقارنة":
      return (
        <Select dir="rtl" value={value} onValueChange={onChange}>
          <SelectTrigger className="h-8 w-full bg-transparent border-none shadow-none focus:ring-1">
            <SelectValue placeholder="نوع المقارنة" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="implement">تنفيذ</SelectItem>
              <SelectItem value="Displayed">معروض</SelectItem>
              <SelectItem value="end">حد</SelectItem>
              <SelectItem value="Som">سوم</SelectItem>
              <SelectItem value="rent">ايجار</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

    case "التاريخ":
      const dateValue = value ? new Date(value) : undefined;
      const isValidDate =
        dateValue instanceof Date && !isNaN(dateValue.getTime());
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-8 w-full justify-between text-right font-normal px-2",
                !value && "text-muted-foreground",
              )}
            >
              <span className="truncate text-xs">
                {isValidDate ? format(dateValue, "yyyy/MM/dd") : "اختر تاريخ"}
              </span>
              <ChevronDownIcon className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => onChange(date?.toISOString())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );

    case "الرقم المرجعي":
      return (
        <div className="flex items-center gap-1 w-full overflow-hidden">
          <Select
            value={value?.type || ""}
            onValueChange={(val) => onChange({ ...value, type: val })}
            dir="rtl"
          >
            <SelectTrigger className="h-8 w-[70px] bg-transparent border-none p-1 shadow-none text-[10px]">
              <SelectValue placeholder="نوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">جوال</SelectItem>
              <SelectItem value="deal">صفقة</SelectItem>
              <SelectItem value="property">عقار</SelectItem>
              <SelectItem value="company">شركة</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="الرقم"
            className="h-7 flex-1 border-none bg-muted/20 text-center p-1 text-xs"
            value={value?.number || ""}
            onChange={(e) => onChange({ ...value, number: e.target.value })}
          />
        </div>
      );

    case "الاحداثيات":
      return (
        <div className="relative w-full px-1">
          <Input
            placeholder="الطول، العرض"
            className="h-7 text-[11px] pr-7 pl-1 border-none bg-muted/10 text-center"
            value={value || ""}
            onChange={(e) => handleCoordinateInput(e.target.value)}
          />
          <MapPin className="absolute right-2 top-2 h-3 w-3 text-muted-foreground opacity-70" />
        </div>
      );

    default:
      return null;
  }
}
