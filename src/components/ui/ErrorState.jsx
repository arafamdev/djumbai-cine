import { AlertCircle } from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the content. Please try again.",
  onRetry,
  action,
  compact = false,
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "px-3 py-6" : "px-6 py-16"
      }`}
    >
      <AlertCircle
        aria-hidden="true"
        className={`text-primary ${compact ? "mb-3 size-7" : "mb-5 size-12"}`}
      />

      <h2
        className={`font-bold text-foreground ${
          compact ? "text-sm" : "text-2xl"
        }`}
      >
        {title}
      </h2>

      <p
        className={`max-w-md text-muted ${
          compact ? "mt-2 text-xs leading-5" : "mt-3 leading-7"
        }`}
      >
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`rounded-lg bg-primary font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            compact
              ? "mt-4 min-h-10 px-4 py-2 text-sm"
              : "mt-6 min-h-11 px-6 py-3"
          }`}
        >
          Try Again
        </button>
      )}

      {action && <div className={compact ? "mt-4" : "mt-6"}>{action}</div>}
    </div>
  );
}

export default ErrorState;
