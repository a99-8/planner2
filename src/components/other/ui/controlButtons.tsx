"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ControlButtons as ControlButtonsProps } from "@/types/userTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props extends Omit<ControlButtonsProps, "onClick"> {
  onClick: (inputValue?: string) => void;
  hover: boolean;
  defaultValue?: string; // خاصية اختيارية للاسم القديم
}

const ControlButtons = ({
  name,
  dis,
  icon: Icon,
  onClick,
  className,
  placeholder,
  hidden,
  hover,
  defaultValue = "",
}: Props) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <TooltipProvider>
      <AlertDialog
        onOpenChange={(open) => {
          if (open) setInputValue(defaultValue);
        }}
      >
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "text-white hover:bg-white hover:border-2 transition-all duration-200 border-transparent",
                  className,
                  hover ? "px-3" : "px-4",
                )}
              >
                <Icon className={cn("h-4 w-4", !hover && "ml-2")} />
                {!hover && <span>{name}</span>}
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          {hover && (
            <TooltipContent
              side="top"
              className="bg-slate-900 text-white border-none"
            >
              <p>{name}</p>
            </TooltipContent>
          )}
        </Tooltip>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>{name}</AlertDialogTitle>
            <AlertDialogDescription>{dis}</AlertDialogDescription>

            {hidden !== "hidden" && (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="mt-2"
                // هذا السطر يضمن وضع المؤشر في نهاية النص عند الفتح
                onFocus={(e) => e.currentTarget.select()}
                autoFocus
              />
            )}
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row-reverse gap-2 mt-4">
            <AlertDialogCancel className="rounded-xl mt-0">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClick(inputValue);
                setInputValue(""); // تنظيف الحقل
              }}
              className="rounded-xl bg-primary hover:opacity-90"
            >
              تأكيد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ControlButtons;
