import { SearchX } from "lucide-react";

function EmptyState({
  title = "Nothing found",
  message = "There are no results to display right now.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <SearchX aria-hidden="true" className="mb-5 size-12 text-muted" />

      <h2 className="text-2xl font-bold text-foreground">{title}</h2>

      <p className="mt-3 max-w-md leading-7 text-muted">{message}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
