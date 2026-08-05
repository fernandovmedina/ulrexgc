import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";

const reviews = [
  { name: "M. Reynolds", project: "Whole-home renovation", body: "The team treated every detail like it mattered. Communication stayed clear, the site stayed organized, and the finish quality exceeded what we had imagined." },
  { name: "J. Castillo", project: "Storm restoration", body: "From the inspection through the final walkthrough, Ulrick Elite made a stressful repair feel completely manageable. The roof and exterior look exceptional." },
  { name: "A. Thompson", project: "Commercial build-out", body: "They understood the schedule, coordinated the trades, and delivered a polished space ready for opening day. A genuinely professional experience." },
  { name: "S. Walker", project: "Kitchen remodel", body: "Smart recommendations, beautiful craftsmanship, and no shortcuts. Our kitchen finally works for the way our family actually lives." },
  { name: "D. Bennett", project: "Exterior painting", body: "Preparation was meticulous and the result transformed the house. The crew was punctual, respectful, and careful with the property." },
  { name: "R. Morgan", project: "Custom carpentry", body: "They turned a rough idea into custom work that feels original to the home. The precision and pride in their work are obvious." },
];

function ReviewCard({ name, project, body }: (typeof reviews)[number]) {
  return (
    <Card className="w-[min(84vw,390px)] shrink-0 border-white/10 bg-white/[.045] text-white shadow-none backdrop-blur-sm">
      <CardContent className="flex h-full min-h-56 flex-col justify-between p-6">
        <Quote className="size-6 text-[#d6aa55]" strokeWidth={1.5} />
        <p className="my-6 text-[15px] leading-7 text-white/72">“{body}”</p>
        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="flex size-9 items-center justify-center rounded-full border border-[#d6aa55]/40 bg-[#d6aa55]/10 font-mono text-xs text-[#e2be6c]">{name.slice(0, 1)}</div>
          <div><p className="text-sm font-bold">{name}</p><p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/40">{project}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialMarquee() {
  return (
    <div className="relative w-full overflow-hidden">
      <Marquee pauseOnHover>{reviews.slice(0, 3).map((review) => <ReviewCard key={review.name} {...review} />)}</Marquee>
      <Marquee reverse pauseOnHover>{reviews.slice(3).map((review) => <ReviewCard key={review.name} {...review} />)}</Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#061426] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#061426] to-transparent sm:w-40" />
    </div>
  );
}
