import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const modernCardVariants = cva(
  "relative transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        luxury: "card-luxury",
        glass: "card-glass",
        neon: "card-neon relative",
        gradient: "bg-gradient-to-br from-white via-[hsl(var(--secondary))]/80 to-white rounded-3xl shadow-xl hover:shadow-2xl border border-[hsl(var(--primary))]/10 hover:scale-[1.01]",
        floating: "bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.2)] border border-white/50 hover:scale-[1.02] hover:-translate-y-2",
        premium: "relative overflow-hidden bg-gradient-to-br from-white to-[hsl(var(--secondary))]/60 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/20 hover:scale-[1.01] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--primary))]/5 before:to-transparent before:rounded-3xl"
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8", 
        xl: "p-10"
      }
    },
    defaultVariants: {
      variant: "luxury",
      padding: "default",
    },
  },
);

export interface ModernCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modernCardVariants> {}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modernCardVariants({ variant, padding, className }))}
      {...props}
    />
  ),
);
ModernCard.displayName = "ModernCard";

const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 mb-6", className)}
    {...props}
  />
));
ModernCardHeader.displayName = "ModernCardHeader";

const ModernCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-bold leading-tight tracking-tight text-gradient", className)}
    {...props}
  />
));
ModernCardTitle.displayName = "ModernCardTitle";

const ModernCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
ModernCardDescription.displayName = "ModernCardDescription";

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("flex-1", className)} 
    {...props} 
  />
));
ModernCardContent.displayName = "ModernCardContent";

const ModernCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6 mt-6 border-t border-[hsl(var(--primary))]/10", className)}
    {...props}
  />
));
ModernCardFooter.displayName = "ModernCardFooter";

export {
  ModernCard,
  ModernCardHeader,
  ModernCardFooter,
  ModernCardTitle,
  ModernCardDescription,
  ModernCardContent,
  modernCardVariants,
};