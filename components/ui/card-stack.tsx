"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  tag?: string;
};

type CardStackProps<T extends CardStackItem> = {
  items: T[];
  language?: "en" | "es";
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  className?: string;
};

const wrap = (n: number, len: number) => ((n % len) + len) % len;

function signedOffset(index: number, active: number, len: number, loop: boolean) {
  const raw = index - active;
  if (!loop || len <= 1) return raw;
  const alternate = raw > 0 ? raw - len : raw + len;
  return Math.abs(alternate) < Math.abs(raw) ? alternate : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  language = "en",
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 580,
  cardHeight = 360,
  loop = true,
  autoAdvance = true,
  intervalMs = 3200,
  pauseOnHover = true,
  className,
}: CardStackProps<T>) {
  const reducedMotion = useReducedMotion();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(() => wrap(initialIndex, items.length));
  const [hovering, setHovering] = React.useState(false);
  const [stageWidth, setStageWidth] = React.useState(cardWidth + 80);

  React.useEffect(() => {
    if (!stageRef.current) return;
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const width = Math.min(cardWidth, Math.max(272, stageWidth - 44));
  const height = Math.min(cardHeight, Math.round(width * 0.64));
  const maxOffset = Math.floor(maxVisible / 2);
  const spacing = Math.max(32, Math.min(112, width * 0.17));
  const next = React.useCallback(() => setActive((value) => wrap(value + 1, items.length)), [items.length]);
  const prev = React.useCallback(() => setActive((value) => wrap(value - 1, items.length)), [items.length]);

  React.useEffect(() => {
    if (!autoAdvance || reducedMotion || !items.length || (pauseOnHover && hovering)) return;
    const timer = window.setInterval(next, Math.max(900, intervalMs));
    return () => window.clearInterval(timer);
  }, [autoAdvance, hovering, intervalMs, items.length, next, pauseOnHover, reducedMotion]);

  if (!items.length) return null;
  const activeItem = items[active];

  return (
    <div className={cn("w-full", className)} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden outline-none"
        style={{ height: height + 110 }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") prev();
          if (event.key === "ArrowRight") next();
        }}
      >
        <div className="absolute inset-x-[15%] bottom-6 h-36 rounded-full bg-[#d6aa55]/15 blur-3xl" />
        <div className="absolute inset-0 flex items-end justify-center [perspective:1200px]">
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const offset = signedOffset(index, active, items.length, loop);
              const distance = Math.abs(offset);
              if (distance > maxOffset) return null;
              const isActive = offset === 0;
              return (
                <motion.article
                  key={item.id}
                  className={cn("absolute bottom-5 overflow-hidden rounded-[1.5rem] border border-white/20 bg-slate-900 shadow-2xl", isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer")}
                  style={{ width, height, zIndex: 50 - distance }}
                  initial={reducedMotion ? false : { opacity: 0, y: 70 }}
                  animate={{
                    opacity: isActive ? 1 : 0.62,
                    x: offset * spacing,
                    y: distance * 17 - (isActive ? 20 : 0),
                    rotateZ: offset * 8,
                    rotateY: offset * -5,
                    scale: isActive ? 1 : 0.9,
                  }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ type: "spring", stiffness: 250, damping: 27 }}
                  onClick={() => setActive(index)}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.16}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 80 || info.velocity.x > 500) prev();
                    if (info.offset.x < -80 || info.velocity.x < -500) next();
                  }}
                >
                  {item.imageSrc ? <Image src={item.imageSrc} alt={item.title} fill sizes="(max-width: 768px) 90vw, 580px" className="object-cover" draggable={false} /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020a13] via-[#020a13]/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[.24em] text-[#e2be6c]">{item.tag}</span>
                      <span className="font-mono text-[10px] text-white/55">0{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-[-.03em] text-white sm:text-3xl">{item.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-white/65">{item.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-center gap-4">
        <div className="flex gap-2">
          {items.map((item, index) => (
            <button key={item.id} onClick={() => setActive(index)} aria-label={`${language === "es" ? "Mostrar" : "Show"} ${item.title}`} className={cn("h-1 rounded-full transition-all", index === active ? "w-9 bg-[#d6aa55]" : "w-4 bg-white/20 hover:bg-white/40")} />
          ))}
        </div>
        {activeItem.href ? <Link href={activeItem.href} className="text-white/60 hover:text-[#e2be6c]" aria-label={`${language === "es" ? "Abrir" : "Open"} ${activeItem.title}`}><ArrowUpRight className="size-4" /></Link> : null}
      </div>
    </div>
  );
}
