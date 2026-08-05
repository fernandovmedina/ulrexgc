"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  CircleDot,
  Hammer,
  HardHat,
  House,
  Menu,
  PaintRoller,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import TestimonialMarquee from "@/components/ui/marquee-01";
import { LuxuryHomeScene } from "@/components/ui/luxury-home-scene";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

type Language = "en" | "es";

const englishCopy = {
  nav: [
    { label: "Services", href: "#services" }, { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" }, { label: "Reviews", href: "#reviews" },
  ],
  services: [
    { number: "01", icon: House, title: "Residential Remodeling & Additions", copy: "Kitchens, bathrooms, additions, and full-home updates shaped around the way you live.", detail: "Spaces that work harder—and feel completely yours." },
    { number: "02", icon: Building2, title: "Commercial Construction", copy: "Retail build-outs, office environments, and tenant improvements delivered around your operating schedule.", detail: "From raw shell to ready-for-business." },
    { number: "03", icon: ShieldCheck, title: "Roofing & Exterior Restoration", copy: "Roofing, siding, framing repairs, and storm-damage mitigation that restore confidence from the outside in.", detail: "Durable protection. Meticulous finish." },
    { number: "04", icon: Ruler, title: "Specialty & Custom Work", copy: "Custom cabinetry, concrete, driveways, structural modifications, house leveling, and complex one-off solutions.", detail: "If it requires ingenuity, we are ready." },
    { number: "05", icon: PaintRoller, title: "Residential Painting", copy: "Detailed prep, premium coatings, and clean execution for interiors and exteriors that stand up beautifully.", detail: "A sharper finish in every room." },
  ],
  projects: [
    { id: 1, title: "The Gather Kitchen", description: "A complete kitchen transformation with warm millwork, new lighting, and a more natural family flow.", imageSrc: "/kitchen.webp", tag: "Residential remodeling", href: "#contact" },
    { id: 2, title: "Commerce Reframed", description: "A tenant improvement built for efficient operations and a polished customer-facing experience.", imageSrc: "/commercial.webp", tag: "Commercial construction", href: "#contact" },
    { id: 3, title: "Weatherproof Renewal", description: "Roof and envelope improvements designed to protect the property and sharpen its curb appeal.", imageSrc: "/roofing.webp", tag: "Roofing & exterior", href: "#contact" },
    { id: 4, title: "Built Beyond Standard", description: "Custom field solutions where precision, structural thinking, and craftsmanship meet.", imageSrc: "/craft.webp", tag: "Specialty work", href: "#contact" },
    { id: 5, title: "A Cleaner Canvas", description: "A careful exterior refresh using durable coatings and an exacting preparation process.", imageSrc: "/painting.webp", tag: "Residential painting", href: "#contact" },
  ] as CardStackItem[],
  startProject: "Start a project", heroKicker: "Built with intent. Finished with pride.", heroWords: ["Building", "Innovating", "Excellence"],
  heroCopy: "Residential, commercial, and specialty construction driven by honest communication and uncompromising craft.", explore: "Explore our work", transformation: "Luxury home transformation",
  strengths: ["Residential expertise", "Commercial discipline", "Exterior resilience", "Custom capability"],
  servicesEyebrow: "What we build", servicesTitle: "One standard.", servicesAccent: "Every scope.", servicesIntro: "From the first site walk to the final detail, we bring practical thinking, disciplined coordination, and a craftsman’s eye to every project.",
  teamAlt: "Construction professionals coordinating on site", promiseTitle: "Built like our name is on it.", promiseCopy: "Because it is—on every detail, every deadline, and every promise.",
  aboutEyebrow: "The Ulrex difference", aboutTitle: "Strong process.", aboutAccent: "Stronger results.", aboutCopy: "Construction should feel clear, not chaotic. We align the scope, communicate what comes next, and solve problems before they become surprises.",
  qualities: [
    { icon: Sparkles, title: "Finish-minded", text: "Details are planned from day one, not patched at the end." }, { icon: HardHat, title: "Field-proven", text: "Practical expertise keeps complex work moving." },
    { icon: ShieldCheck, title: "Accountable", text: "Clear updates, honest answers, and respect for your property." }, { icon: Ruler, title: "Built to fit", text: "Solutions tailored to the space, scope, and long-term goal." },
  ],
  projectsEyebrow: "Selected capabilities", projectsTitle: "Work that speaks", projectsAccent: "for itself.", projectsCopy: "Explore the kind of care, coordination, and versatility we bring to every build. Swipe, drag, or use the arrow keys.",
  reviewsEyebrow: "Client perspective", reviewsTitle: "Trust is built", reviewsAccent: "one project at a time.",
  contactEyebrow: "The next great project starts here", contactTitle: "Let’s build", contactMiddle: "something", contactAccent: "lasting.", contactCopy: "Tell us what you are planning. We will help clarify the scope, the right first step, and what it will take to bring it to life.", consultation: "Request a consultation", bilingual: "English + Spanish", serving: "Serving residential and commercial clients",
  navigate: "Navigate", languages: "Languages", footerTagline: "Building. Innovating. Excellence.", footerClosing: "Built on craft. Backed by care.",
  aria: { home: "Ulrex home", mainNav: "Main navigation", languageOptions: "Language options", openMenu: "Open menu", closeMenu: "Close menu", mobileNav: "Mobile navigation" },
};

const spanishCopy: typeof englishCopy = {
  nav: [
    { label: "Servicios", href: "#services" }, { label: "Proyectos", href: "#projects" },
    { label: "Nosotros", href: "#about" }, { label: "Reseñas", href: "#reviews" },
  ],
  services: [
    { number: "01", icon: House, title: "Remodelaciones y ampliaciones residenciales", copy: "Cocinas, baños, ampliaciones y renovaciones integrales diseñadas en torno a tu forma de vivir.", detail: "Espacios más funcionales que se sienten completamente tuyos." },
    { number: "02", icon: Building2, title: "Construcción comercial", copy: "Adecuaciones de locales, oficinas y espacios para inquilinos, ejecutadas según tu calendario operativo.", detail: "Del espacio en obra al negocio listo para operar." },
    { number: "03", icon: ShieldCheck, title: "Techos y restauración exterior", copy: "Techos, revestimientos, reparación de estructuras y mitigación de daños por tormentas que devuelven la tranquilidad.", detail: "Protección duradera. Acabado meticuloso." },
    { number: "04", icon: Ruler, title: "Trabajos especiales y a medida", copy: "Carpintería personalizada, concreto, accesos, modificaciones estructurales, nivelación y soluciones complejas.", detail: "Si exige ingenio, estamos listos." },
    { number: "05", icon: PaintRoller, title: "Pintura residencial", copy: "Preparación detallada, recubrimientos de primera calidad y ejecución limpia para interiores y exteriores.", detail: "Un acabado impecable en cada espacio." },
  ],
  projects: [
    { id: 1, title: "La cocina para convivir", description: "Una transformación completa con carpintería cálida, nueva iluminación y un flujo familiar más natural.", imageSrc: "/kitchen.webp", tag: "Remodelación residencial", href: "#contact" },
    { id: 2, title: "Comercio renovado", description: "Una adecuación pensada para operaciones eficientes y una experiencia impecable para el cliente.", imageSrc: "/commercial.webp", tag: "Construcción comercial", href: "#contact" },
    { id: 3, title: "Renovación contra el clima", description: "Mejoras de techo y envolvente para proteger la propiedad y elevar su atractivo exterior.", imageSrc: "/roofing.webp", tag: "Techos y exteriores", href: "#contact" },
    { id: 4, title: "Más allá del estándar", description: "Soluciones personalizadas donde se unen precisión, criterio estructural y oficio.", imageSrc: "/craft.webp", tag: "Trabajo especializado", href: "#contact" },
    { id: 5, title: "Una fachada renovada", description: "Una cuidadosa renovación exterior con recubrimientos duraderos y una preparación rigurosa.", imageSrc: "/painting.webp", tag: "Pintura residencial", href: "#contact" },
  ],
  startProject: "Inicia un proyecto", heroKicker: "Construido con intención. Terminado con orgullo.", heroWords: ["Construimos", "Innovamos", "Excelencia"],
  heroCopy: "Construcción residencial, comercial y especializada, impulsada por una comunicación honesta y un trabajo impecable.", explore: "Conoce nuestro trabajo", transformation: "Transformación de residencia de lujo",
  strengths: ["Experiencia residencial", "Disciplina comercial", "Resistencia exterior", "Capacidad a medida"],
  servicesEyebrow: "Lo que construimos", servicesTitle: "Un estándar.", servicesAccent: "Cada proyecto.", servicesIntro: "Desde la primera visita hasta el último detalle, aportamos criterio práctico, coordinación disciplinada y mirada artesanal a cada proyecto.",
  teamAlt: "Profesionales de la construcción coordinando en obra", promiseTitle: "Construimos como si llevara nuestro nombre.", promiseCopy: "Porque así es: en cada detalle, cada fecha y cada promesa.",
  aboutEyebrow: "La diferencia Ulrex", aboutTitle: "Un proceso sólido.", aboutAccent: "Resultados superiores.", aboutCopy: "La construcción debe sentirse clara, no caótica. Alineamos el alcance, comunicamos lo que sigue y resolvemos los problemas antes de que sean sorpresas.",
  qualities: [
    { icon: Sparkles, title: "Enfoque en acabados", text: "Los detalles se planean desde el primer día, no se corrigen al final." }, { icon: HardHat, title: "Experiencia en obra", text: "La experiencia práctica mantiene en marcha los trabajos complejos." },
    { icon: ShieldCheck, title: "Responsables", text: "Avances claros, respuestas honestas y respeto por tu propiedad." }, { icon: Ruler, title: "Hecho a la medida", text: "Soluciones adaptadas al espacio, alcance y objetivo a largo plazo." },
  ],
  projectsEyebrow: "Capacidades destacadas", projectsTitle: "Trabajo que habla", projectsAccent: "por sí mismo.", projectsCopy: "Descubre el cuidado, la coordinación y la versatilidad que aportamos a cada obra. Desliza, arrastra o usa las flechas.",
  reviewsEyebrow: "La opinión de clientes", reviewsTitle: "La confianza se construye", reviewsAccent: "proyecto a proyecto.",
  contactEyebrow: "Tu próximo gran proyecto comienza aquí", contactTitle: "Construyamos", contactMiddle: "algo", contactAccent: "duradero.", contactCopy: "Cuéntanos qué estás planeando. Te ayudaremos a definir el alcance, el primer paso y lo necesario para hacerlo realidad.", consultation: "Solicita una consulta", bilingual: "Inglés + Español", serving: "Atendemos clientes residenciales y comerciales",
  navigate: "Navegar", languages: "Idiomas", footerTagline: "Construimos. Innovamos. Excelencia.", footerClosing: "Hecho con oficio. Respaldado con atención.",
  aria: { home: "Inicio de Ulrex", mainNav: "Navegación principal", languageOptions: "Opciones de idioma", openMenu: "Abrir menú", closeMenu: "Cerrar menú", mobileNav: "Navegación móvil" },
};

const content: Record<Language, typeof englishCopy> = { en: englishCopy, es: spanishCopy };
type PageCopy = typeof englishCopy;

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={cn("mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.28em]", light ? "text-[#e2be6c]" : "text-[#8b672a]")}>
      <span className="h-px w-9 bg-current" />{children}
    </div>
  );
}

function Header({ copy, language, setLanguage }: { copy: PageCopy; language: Language; setLanguage: (language: Language) => void }) {
  const [open, setOpen] = useState(false);
  const languageButton = (value: Language, flag: string, label: string) => (
    <button
      type="button"
      onClick={() => setLanguage(value)}
      className={cn("flex size-8 items-center justify-center rounded-full text-base transition", language === value ? "bg-white/15 opacity-100 ring-1 ring-white/20" : "opacity-50 hover:opacity-100")}
      aria-label={label}
      aria-pressed={language === value}
    >
      <span aria-hidden="true">{flag}</span>
    </button>
  );
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#061426]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="#top" aria-label={copy.aria.home} className="flex items-center gap-3">
          <Image src="/logo_icon_with_transparent_background.png" alt="" width={46} height={46} className="size-10 object-contain" priority />
          <span className="hidden leading-none text-white sm:block"><strong className="block text-[13px] tracking-[.15em]">ULREX</strong><span className="mt-1 block font-mono text-[8px] tracking-[.24em] text-[#e2be6c]">GENERAL CONTRACTING</span></span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label={copy.aria.mainNav}>
          {copy.nav.map((item) => <Link key={item.href} href={item.href} className="font-mono text-[10px] uppercase tracking-[.18em] text-white/65 transition hover:text-white">{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1" role="group" aria-label={copy.aria.languageOptions}>
            {languageButton("en", "🇺🇸", "English")}
            {languageButton("es", "🇪🇸", "Español")}
          </div>
          <Link href="#contact" className="group flex h-11 items-center gap-3 bg-[#d6aa55] px-5 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#061426] transition hover:bg-[#eccd86]">{copy.startProject} <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></Link>
        </div>
        <button onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center border border-white/15 text-white lg:hidden" aria-label={open ? copy.aria.closeMenu : copy.aria.openMenu}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
      <div className={cn("overflow-hidden bg-[#061426] transition-[max-height] duration-500 lg:hidden", open ? "max-h-96 border-t border-white/10" : "max-h-0")}>
        <nav className="space-y-1 px-5 py-5" aria-label={copy.aria.mobileNav}>
          {copy.nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 text-sm font-bold uppercase tracking-[.08em] text-white">{item.label}<ChevronRight className="size-4 text-[#d6aa55]" /></Link>)}
          <div className="flex items-center justify-between pt-5"><div className="flex gap-1 rounded-full border border-white/15 bg-white/5 p-1" role="group" aria-label={copy.aria.languageOptions}>{languageButton("en", "🇺🇸", "English")}{languageButton("es", "🇪🇸", "Español")}</div><Link href="#contact" onClick={() => setOpen(false)} className="bg-[#d6aa55] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#061426]">{copy.startProject}</Link></div>
        </nav>
      </div>
    </header>
  );
}

function Hero({ copy, language }: { copy: PageCopy; language: Language }) {
  return (
    <section id="top" className="relative min-h-[820px] overflow-hidden bg-[#061426] pt-[74px] text-white lg:min-h-screen">
      <video autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[.09] mix-blend-screen" src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477" />
      <div className="blueprint-grid absolute inset-0 opacity-25" />
      <div className="absolute -left-52 top-40 size-[520px] rounded-full bg-[#173a5e]/35 blur-[120px]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-74px)] max-w-[1440px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:px-12 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.3em] text-[#e2be6c]"><span className="size-1.5 rounded-full bg-[#e2be6c] shadow-[0_0_18px_#e2be6c]" />{copy.heroKicker}</motion.div>
          <h1 className="max-w-[780px] text-[clamp(3.5rem,8vw,7.8rem)] font-black uppercase leading-[.82] tracking-[-.065em]">
            <motion.span initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className="block">{copy.heroWords[0]}</motion.span>
            <motion.span initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: .08, ease: [0.22, 1, 0.36, 1] }} className="block text-outline-gold">{copy.heroWords[1]}</motion.span>
            <motion.span initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: .16, ease: [0.22, 1, 0.36, 1] }} className="block">{copy.heroWords[2]}<span className="text-[#d6aa55]">.</span></motion.span>
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .45 }} className="mt-9 grid max-w-2xl gap-7 border-l border-[#d6aa55]/55 pl-5 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-7">
            <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg">{copy.heroCopy}</p>
            <Link href="#services" className="group flex w-fit items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-white">{copy.explore} <span className="flex size-10 items-center justify-center rounded-full border border-white/20 transition group-hover:border-[#d6aa55] group-hover:bg-[#d6aa55] group-hover:text-[#061426]"><ArrowDown className="size-4" /></span></Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .2 }} className="relative h-[380px] lg:h-[640px]">
          <Card className="relative h-full overflow-hidden rounded-[2rem] border-white/10 bg-[#081a2c]/70 shadow-[0_45px_100px_rgba(0,0,0,.45)]">
            <Spotlight className="left-1/2 top-1/2" size={520} />
            <div className="absolute inset-0 blueprint-grid opacity-30" />
            <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#061426]/70 px-3 py-2 backdrop-blur-md"><CircleDot className="size-3 text-[#d6aa55]" /><span className="font-mono text-[8px] uppercase tracking-[.2em] text-white/60">{copy.transformation}</span></div>
            <LuxuryHomeScene className="h-full w-full" language={language} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061426] to-transparent" />
          </Card>
        </motion.div>
      </div>
      <div className="relative border-y border-white/10 bg-[#04101d]/80 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 font-mono text-[9px] uppercase tracking-[.18em] text-white/45 sm:px-8 lg:px-12">
          {copy.strengths.map((item) => <span key={item} className="flex items-center gap-3"><Check className="size-3 text-[#d6aa55]" />{item}</span>)}
        </div>
      </div>
    </section>
  );
}

function Services({ copy }: { copy: PageCopy }) {
  return (
    <section id="services" className="bg-[#f3efe7] px-5 py-24 text-[#061426] sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1344px]">
        <Reveal className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><Eyebrow>{copy.servicesEyebrow}</Eyebrow><h2 className="text-[clamp(2.7rem,6vw,5.6rem)] font-black uppercase leading-[.9] tracking-[-.055em]">{copy.servicesTitle}<br /><span className="text-[#a57a2f]">{copy.servicesAccent}</span></h2></div><p className="max-w-xl text-lg leading-8 text-[#061426]/60 lg:ml-auto">{copy.servicesIntro}</p></Reveal>
        <div className="mt-16 divide-y divide-[#061426]/15 border-y border-[#061426]/15">
          {copy.services.map((service, index) => {
            const Icon = service.icon;
            return <Reveal key={service.number} delay={index * .04}><article className="group grid gap-5 py-8 transition sm:grid-cols-[80px_1.1fr_1fr_44px] sm:items-center lg:py-10"><span className="font-mono text-xs text-[#9a7432]">/{service.number}</span><div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full border border-[#061426]/15 bg-white/40 transition group-hover:border-[#d6aa55] group-hover:bg-[#d6aa55]"><Icon className="size-5" strokeWidth={1.6} /></span><h3 className="text-xl font-black uppercase leading-tight tracking-[-.025em] lg:text-2xl">{service.title}</h3></div><div><p className="text-sm leading-6 text-[#061426]/60">{service.copy}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.15em] text-[#9a7432]">{service.detail}</p></div><ArrowRight className="hidden size-5 text-[#9a7432] transition group-hover:translate-x-1 sm:block" /></article></Reveal>;
          })}
        </div>
      </div>
    </section>
  );
}

function About({ copy }: { copy: PageCopy }) {
  return (
    <section id="about" className="overflow-hidden bg-white px-5 py-24 text-[#061426] sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-[1344px] gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal className="relative min-h-[520px]">
          <div className="absolute left-0 top-0 h-[88%] w-[86%] overflow-hidden rounded-[1.5rem]"><Image src="/team.webp" alt={copy.teamAlt} fill className="object-cover" sizes="(max-width: 1024px) 90vw, 44vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#061426]/55 to-transparent" /></div>
          <div className="absolute bottom-0 right-0 w-[62%] border border-[#d6aa55]/25 bg-[#061426] p-6 text-white shadow-2xl sm:p-8"><Hammer className="mb-8 size-6 text-[#d6aa55]" /><p className="text-2xl font-black uppercase leading-tight tracking-[-.035em]">{copy.promiseTitle}</p><p className="mt-3 text-sm leading-6 text-white/55">{copy.promiseCopy}</p></div>
        </Reveal>
        <Reveal className="lg:pl-10"><Eyebrow>{copy.aboutEyebrow}</Eyebrow><h2 className="text-[clamp(2.8rem,5.5vw,5.4rem)] font-black uppercase leading-[.9] tracking-[-.055em]">{copy.aboutTitle}<br />{copy.aboutAccent}</h2><p className="mt-8 text-lg leading-8 text-[#061426]/60">{copy.aboutCopy}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">{copy.qualities.map((item) => { const Icon = item.icon; return <div key={item.title} className="border-l border-[#d6aa55] pl-4"><Icon className="mb-3 size-5 text-[#9a7432]" strokeWidth={1.5} /><h3 className="text-sm font-black uppercase tracking-[.02em]">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#061426]/55">{item.text}</p></div>; })}</div>
        </Reveal>
      </div>
    </section>
  );
}

function Projects({ copy, language }: { copy: PageCopy; language: Language }) {
  return (
    <section id="projects" className="overflow-hidden bg-[#061426] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1344px]"><Reveal className="text-center"><div className="flex justify-center"><Eyebrow light>{copy.projectsEyebrow}</Eyebrow></div><h2 className="text-[clamp(2.8rem,6vw,5.8rem)] font-black uppercase leading-[.88] tracking-[-.055em]">{copy.projectsTitle}<br /><span className="text-outline-gold">{copy.projectsAccent}</span></h2><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/55">{copy.projectsCopy}</p></Reveal><Reveal className="mt-12"><CardStack items={copy.projects} language={language} /></Reveal></div>
    </section>
  );
}

function Reviews({ copy, language }: { copy: PageCopy; language: Language }) {
  return (
    <section id="reviews" className="overflow-hidden bg-[#061426] pb-28 text-white lg:pb-36"><div className="mx-auto max-w-[1344px] px-5 pb-12 pt-4 text-center sm:px-8"><Reveal><div className="flex justify-center"><Eyebrow light>{copy.reviewsEyebrow}</Eyebrow></div><h2 className="text-[clamp(2.6rem,5vw,4.8rem)] font-black uppercase leading-[.92] tracking-[-.05em]">{copy.reviewsTitle}<br />{copy.reviewsAccent}</h2></Reveal></div><TestimonialMarquee language={language} /></section>
  );
}

function Contact({ copy, language }: { copy: PageCopy; language: Language }) {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#d6aa55] px-5 py-24 text-[#061426] sm:px-8 lg:px-12 lg:py-32">
      <div className="blueprint-grid absolute inset-0 opacity-15" />
      <div className="relative mx-auto grid max-w-[1344px] gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><Reveal><p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[.28em]">{copy.contactEyebrow}</p><h2 className="max-w-4xl text-[clamp(3.2rem,7.5vw,7.4rem)] font-black uppercase leading-[.82] tracking-[-.065em]">{copy.contactTitle}<br />{copy.contactMiddle} <span className="text-white">{copy.contactAccent}</span></h2></Reveal><Reveal className="lg:pb-2" delay={.12}><p className="max-w-lg text-lg leading-8 text-[#061426]/65">{copy.contactCopy}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={`mailto:?subject=${encodeURIComponent(language === "es" ? "Consulta de proyecto — Ulrex" : "Project Consultation — Ulrex")}`} className="group flex h-14 items-center justify-center gap-3 bg-[#061426] px-7 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-white transition hover:bg-[#102b45]">{copy.consultation} <ArrowRight className="size-4 transition group-hover:translate-x-1" /></a><span className="flex h-14 items-center justify-center gap-3 border border-[#061426]/25 px-7 font-mono text-[10px] font-bold uppercase tracking-[.18em]">{copy.bilingual}</span></div><p className="mt-4 font-mono text-[8px] uppercase tracking-[.16em] text-[#061426]/45">{copy.serving}</p></Reveal></div>
    </section>
  );
}

function Footer({ copy }: { copy: PageCopy }) {
  return (
    <footer className="bg-[#030d17] px-5 pb-8 pt-16 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-[1344px]"><div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto_auto]"><div className="flex items-center gap-4"><Image src="/logo_icon_with_transparent_background.png" alt="Ulrex General Contracting" width={70} height={70} className="size-16 object-contain" /><div><p className="text-lg font-black tracking-[.14em]">ULREX</p><p className="font-mono text-[9px] tracking-[.24em] text-[#d6aa55]">GENERAL CONTRACTING</p><p className="mt-3 text-xs text-white/40">{copy.footerTagline}</p></div></div><div><p className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#d6aa55]">{copy.navigate}</p><div className="grid gap-2 text-sm text-white/55">{copy.nav.map((item) => <Link key={item.href} href={item.href} className="hover:text-white">{item.label}</Link>)}</div></div><div><p className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#d6aa55]">{copy.languages}</p><div className="flex gap-3 text-xl"><span aria-label="English">🇺🇸</span><span aria-label="Español">🇪🇸</span></div><p className="mt-3 text-xs text-white/40">English / Español</p></div></div><div className="flex flex-col justify-between gap-3 pt-7 font-mono text-[8px] uppercase tracking-[.16em] text-white/30 sm:flex-row"><p>© {new Date().getFullYear()} Ulrex General Contracting</p><p>{copy.footerClosing}</p></div></div></footer>
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const copy = content[language];
  return <main className="overflow-x-clip"><Header copy={copy} language={language} setLanguage={selectLanguage} /><Hero copy={copy} language={language} /><Services copy={copy} /><About copy={copy} /><Projects copy={copy} language={language} /><Reviews copy={copy} language={language} /><Contact copy={copy} language={language} /><Footer copy={copy} /></main>;
}
