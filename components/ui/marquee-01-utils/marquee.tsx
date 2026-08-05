import * as React from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({ className, reverse, pauseOnHover, children, ...props }: MarqueeProps) {
  return (
    <div className={cn("group flex overflow-hidden py-2 [--duration:28s]", className)} {...props}>
      {[0, 1].map((copy) => (
        <div key={copy} aria-hidden={copy === 1} className={cn("flex shrink-0 animate-marquee items-stretch gap-4 pr-4", reverse && "[animation-direction:reverse]", pauseOnHover && "group-hover:[animation-play-state:paused]")}>
          {children}
        </div>
      ))}
    </div>
  );
}
