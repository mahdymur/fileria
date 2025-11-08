import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-emerald-500 text-emerald-950 shadow-[0_0_18px_rgba(16,185,129,0.28)] hover:bg-emerald-400 hover:text-emerald-950 hover:shadow-[0_0_26px_rgba(52,211,153,0.35)]",
        destructive:
          "border border-transparent bg-red-500 text-white shadow-sm hover:bg-red-400",
        outline:
          "border border-emerald-500/70 bg-transparent text-emerald-300 hover:bg-emerald-500 hover:text-emerald-950 hover:shadow-[0_0_22px_rgba(16,185,129,0.28)]",
        secondary:
          "border border-muted bg-[#111214] text-foreground hover:border-emerald-500/40 hover:text-emerald-200",
        ghost:
          "text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/10",
        link: "text-emerald-400 underline-offset-4 hover:text-emerald-300 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
