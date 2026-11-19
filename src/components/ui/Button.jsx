function Button({
  children,
  variant = "primary",
  className = "",
  ...buttonProps
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-elevated text-foreground hover:bg-border",
  };

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export default Button;
