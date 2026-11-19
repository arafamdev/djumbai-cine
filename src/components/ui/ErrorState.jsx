import { AlertCircle } from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the content. Please try again.",
  onRetry,
  action,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <AlertCircle aria-hidden="true" className="mb-5 size-12 text-primary" />

      <h2 className="text-2xl font-bold text-foreground">{title}</h2>

      <p className="mt-3 max-w-md leading-7 text-muted">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 min-h-11 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try Again
        </button>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default ErrorState;
