import { cn } from "@/utils";
import { forwardRef } from "react";
import { Flex, type FlexProps } from "./Flex";

export const Center = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        className={cn(
          "items-center justify-center",
          className,
        )}
        {...props}
      />
    );
  },
);

Center.displayName = "Center";