import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import React from "react";
import { cn } from "@/lib/utils";

interface sessionsListButton {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  description: string;
}

export function SessionsListButton({
  onClick,
  className,
  icon,
  description,
}: sessionsListButton) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          onClick={onClick}
          className={cn(
            "font-bold px-2 py-1 rounded transition-colors",
            className,
          )}
          variant="ghost"
        >
          {icon}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className={cn("w-fit", className)}>
        {description}
      </HoverCardContent>
    </HoverCard>
  );
}
