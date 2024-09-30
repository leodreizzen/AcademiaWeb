'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const fileUploadVariants = cva(
  "flex items-center justify-center cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent focus:border-primary focus:ring-primary",
        destructive:
          "border border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10 focus:border-destructive focus:ring-destructive",
        ghost: "bg-transparent hover:bg-accent focus:border-primary focus:ring-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof fileUploadVariants> {
  customSize?: 'default' | 'sm' | 'lg';
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, variant, size, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0])
      }
    }

    return (
      <div>
        <label
          className={cn(fileUploadVariants({ variant, size, className }))}
        >
          <input
            type="file"
            accept=".pdf, .docx, .pptx, .xlsx"
            className="hidden"
            ref={ref}
            onChange={handleFileChange}
            {...props}
          />
          {selectedFile ? selectedFile.name : "Seleccionar"}
        </label>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">
            Archivo seleccionado: {selectedFile.name}
          </p>
        )}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload, fileUploadVariants }
