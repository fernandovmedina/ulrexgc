import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";

const englishReviews = [
  { name: "M. Reynolds", project: "Whole-home renovation", body: "The team treated every detail like it mattered. Communication stayed clear, the site stayed organized, and the finish quality exceeded what we had imagined." },
  { name: "J. Castillo", project: "Storm restoration", body: "From the inspection through the final walkthrough, Ulrex made a stressful repair feel completely manageable. The roof and exterior look exceptional." },
  { name: "A. Thompson", project: "Commercial build-out", body: "They understood the schedule, coordinated the trades, and delivered a polished space ready for opening day. A genuinely professional experience." },
  { name: "S. Walker", project: "Kitchen remodel", body: "Smart recommendations, beautiful craftsmanship, and no shortcuts. Our kitchen finally works for the way our family actually lives." },
  { name: "D. Bennett", project: "Exterior painting", body: "Preparation was meticulous and the result transformed the house. The crew was punctual, respectful, and careful with the property." },
  { name: "R. Morgan", project: "Custom carpentry", body: "They turned a rough idea into custom work that feels original to the home. The precision and pride in their work are obvious." },
];

const spanishReviews: typeof englishReviews = [
  { name: "M. Reynolds", project: "Renovación integral", body: "El equipo trató cada detalle como algo importante. La comunicación fue clara, la obra se mantuvo organizada y la calidad de los acabados superó lo que imaginábamos." },
  { name: "J. Castillo", project: "Restauración por tormenta", body: "Desde la inspección hasta el recorrido final, Ulrex hizo que una reparación estresante fuera totalmente manejable. El techo y el exterior quedaron excepcionales." },
  { name: "A. Thompson", project: "Adecuación comercial", body: "Entendieron el calendario, coordinaron los oficios y entregaron un espacio impecable, listo para la apertura. Una experiencia verdaderamente profesional." },
  { name: "S. Walker", project: "Remodelación de cocina", body: "Buenas recomendaciones, un trabajo hermoso y sin atajos. Por fin nuestra cocina funciona para la forma en que vive nuestra familia." },
  { name: "D. Bennett", project: "Pintura exterior", body: "La preparación fue meticulosa y el resultado transformó la casa. El equipo fue puntual, respetuoso y cuidadoso con la propiedad." },
  { name: "R. Morgan", project: "Carpintería a medida", body: "Convirtieron una idea inicial en un trabajo a medida que se siente original de la casa. La precisión y el orgullo en su trabajo son evidentes." },
];

function ReviewCard({ name, project, body }: (typeof englishReviews)[number]) {
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

export default function TestimonialMarquee({ language = "en" }: { language?: "en" | "es" }) {
  const reviews = language === "es" ? spanishReviews : englishReviews;
  return (
    <div className="relative w-full overflow-hidden">
      <Marquee pauseOnHover>{reviews.slice(0, 3).map((review) => <ReviewCard key={review.name} {...review} />)}</Marquee>
      <Marquee reverse pauseOnHover>{reviews.slice(3).map((review) => <ReviewCard key={review.name} {...review} />)}</Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#061426] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#061426] to-transparent sm:w-40" />
    </div>
  );
}
