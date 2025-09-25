import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const modernButtonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        premium: "btn-premium",
        glass: "btn-glass", 
        neon: "btn-neon",
        gradient: "relative overflow-hidden bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
        glow: "relative bg-[hsl(var(--primary))] text-white shadow-[0_0_20px_hsl(var(--primary))/40] hover:shadow-[0_0_30px_hsl(var(--primary))/60] hover:scale-[1.02] transition-all duration-300",
        luxury: "relative overflow-hidden bg-gradient-to-br from-white via-[hsl(var(--secondary))] to-white border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] hover:shadow-2xl hover:scale-[1.02] transition-all duration-400"
      },
      size: {
        sm: "h-10 px-6 py-2 text-sm rounded-xl",
        default: "h-12 px-8 py-3 text-base rounded-2xl",
        lg: "h-14 px-12 py-4 text-lg rounded-2xl",
        xl: "h-16 px-16 py-5 text-xl rounded-3xl",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "premium",
      size: "default",
    },
  },
);

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(modernButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
ModernButton.displayName = "ModernButton";

export { ModernButton, modernButtonVariants };