function Spinner({ label = "Loading...", size = "md" }) {
  const sizes = {
    sm: "size-5 border-2",
    md: "size-8 border-[3px]",
    lg: "size-12 border-4",
  };

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3"
    >
      <span
        aria-hidden="true"
        className={`${sizes[size]} animate-spin rounded-full border-primary/20 border-t-primary`}
      />

      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}

export default Spinner;
