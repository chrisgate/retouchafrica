"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

const MotionLink = motion.create(Link);

type Variant = "solid" | "solid-dark" | "outline" | "outline-light";

const base =
  "inline-flex flex-none items-center justify-center gap-2 whitespace-nowrap px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors";

const variants: Record<Variant, string> = {
  solid: "bg-gold text-ink hover:bg-gold-soft",
  "solid-dark": "bg-ink text-paper hover:bg-ink/80",
  outline: "border border-gold text-ink hover:bg-gold hover:text-ink",
  "outline-light": "border border-gold text-paper hover:bg-gold hover:text-ink",
};

const tap = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, transition: { duration: 0.15 } };

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
};

type ButtonAsButton = CommonProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
  > & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "solid", className, children } = props;
  const classes = clsx(base, variants[variant], className);

  if ("href" in props && props.href) {
    return (
      <MotionLink href={props.href} className={classes} {...tap}>
        {children}
      </MotionLink>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _variant, className: _className, children: _children, href: _href, ...rest } = props as ButtonAsButton;
  return (
    <motion.button className={classes} {...tap} {...rest}>
      {children}
    </motion.button>
  );
}
