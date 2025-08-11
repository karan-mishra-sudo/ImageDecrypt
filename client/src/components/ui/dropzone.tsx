import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesDrop?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, onFilesDrop, accept, multiple = false, disabled = false, children, ...props }, ref) => {
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    }, [disabled]);

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      if (disabled || !onFilesDrop) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFilesDrop(files);
      }
    }, [disabled, onFilesDrop]);

    return (
      <div
        ref={ref}
        className={cn(
          "border-2 border-dashed rounded-lg transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Dropzone.displayName = "Dropzone";

export { Dropzone };
