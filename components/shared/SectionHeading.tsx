import { clsx } from "clsx";

export function SectionHeading({
  children,
  className,
  as: As = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <As className={clsx("font-display text-4xl leading-tight sm:text-5xl", className)}>
      {children}
    </As>
  );
}
