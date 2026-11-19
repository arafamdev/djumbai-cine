function Logo({ className = "" }) {
  return (
    <a
      href="/"
      aria-label="Djumbai Cine — Home"
      className={`inline-flex items-center text-2xl font-extrabold tracking-tight text-foreground ${className}`}
    >
      Djumbai <span className="ml-1.5 text-primary">Cine</span>
    </a>
  );
}

export default Logo;
