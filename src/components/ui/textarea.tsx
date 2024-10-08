import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textAreaVariants = cva(
  "flex w-full rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary",
        destructive:
          "border border-destructive bg-destructive/10 text-destructive focus:border-destructive focus:ring-destructive",
        outline:
          "border border-input bg-background text-foreground focus:border-primary focus:ring-primary",
        ghost: "bg-transparent focus:border-primary focus:ring-primary",
      },
      size: {
        default: "h-20 p-3",
        sm: "h-16 p-2 text-xs",
        lg: "h-32 p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textAreaVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
TextArea.displayName = "TextArea"

export { TextArea, textAreaVariants }
