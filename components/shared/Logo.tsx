export function Logo({ variant = "dark", className }: { variant?: "dark" | "light"; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small static local SVG, no optimization needed
    <img
      src={variant === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Retouch Africa"
      className={className}
    />
  );
}
