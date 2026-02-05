"use client";

interface InputSelectorProps {
  inputType: String;
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InputSelector({ inputType }: InputSelectorProps) {
  if ((inputType = "نوع المقارنة")) {
    return (
      <Select>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="اختر نوع المقارنة" />
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
  }
  if ((inputType = "التاريخ")) {
    return <></>;
  }
  if ((inputType = "الرقم المرجعي")) {
    return <></>;
  }
  if ((inputType = "الاحداثيات")) {
    return <></>;
  }

  return <></>;
}
