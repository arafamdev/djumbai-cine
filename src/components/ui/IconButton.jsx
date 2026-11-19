function IconButton({
  icon: Icon,
  label,
  onClick,
  className = "",
  ref,
  ...buttonProps
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
      {...buttonProps}
    >
      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

export default IconButton;
