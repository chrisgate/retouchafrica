import { clsx } from "clsx";

export function EyebrowHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={clsx("eyebrow", className)}>{children}</p>;
}
