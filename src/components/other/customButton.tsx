"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // أداة shadcn لدمج الكلاسات

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function CustomButton({
  label,
  onClick,
  disabled,
  className,
  icon,
}: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-bold transition-all active:scale-95 shadow-sm",
        className,
      )}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {label}
    </Button>
  );
}
