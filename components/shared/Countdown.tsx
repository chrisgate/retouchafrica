"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(target: string): Remaining {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ target, className }: { target: string; className?: string }) {
  const [remaining, setRemaining] = useState<Remaining>(() => getRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  const units: Array<[label: string, value: number]> = [
    ["DAYS", remaining.days],
    ["HOURS", remaining.hours],
    ["MINS", remaining.minutes],
    ["SECS", remaining.seconds],
  ];

  return (
    <div className={className}>
      <p className="eyebrow mb-3 text-center">Workshop starts in</p>
      <div className="flex items-center justify-center divide-x divide-paper/20">
        {units.map(([label, value]) => (
          <div key={label} className="px-4 text-center first:pl-0 last:pr-0 sm:px-8">
            <div className="relative mx-auto h-[1.15em] w-[1.6em] overflow-hidden font-display text-4xl sm:text-5xl">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={value}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center text-paper"
                  suppressHydrationWarning
                >
                  {String(value).padStart(2, "0")}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-1 text-[10px] tracking-[0.2em] text-paper/60">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
