import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  message: string;
  className?: string;
  onRetry?: () => void;
};

export function ErrorMessage({ message, className, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 font-medium underline underline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
