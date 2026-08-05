"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
];

const services = [
  { number: "01", icon: House, title: "Residential Remodeling & Additions", copy: "Kitchens, bathrooms, additions, and full-home updates shaped around the way you live.", detail: "Spaces that work harder—and feel completely yours." },
  { number: "02", icon: Building2, title: "Commercial Construction", copy: "Retail build-outs, office environments, and tenant improvements delivered around your operating schedule.", detail: "From raw shell to ready-for-business." },
  { number: "03", icon: ShieldCheck, title: "Roofing & Exterior Restoration", copy: "Roofing, siding, framing repairs, and storm-damage mitigation that restore confidence from the outside in.", detail: "Durable protection. Meticulous finish." },
  { number: "04", icon: Ruler, title: "Specialty & Custom Work", copy: "Custom cabinetry, concrete, driveways, structural modifications, house leveling, and complex one-off solutions.", detail: "If it requires ingenuity, we are ready." },
  { number: "05", icon: PaintRoller, title: "Residential Painting", copy: "Detailed prep, premium coatings, and clean execution for interiors and exteriors that stand up beautifully.", detail: "A sharper finish in every room." },
];

const projects: CardStackItem[] = [
  { id: 1, title: "The Gather Kitchen", description: "A complete kitchen transformation with warm millwork, new lighting, and a more natural family flow.", imageSrc: "/kitchen.webp", tag: "Residential remodeling", href: "#contact" },
  { id: 2, title: "Commerce Reframed", description: "A tenant improvement built for efficient operations and a polished customer-facing experience.", imageSrc: "/commercial.webp", tag: "Commercial construction", href: "#contact" },
  { id: 3, title: "Weatherproof Renewal", description: "Roof and envelope improvements designed to protect the property and sharpen its curb appeal.", imageSrc: "/roofing.webp", tag: "Roofing & exterior", href: "#contact" },
  { id: 4, title: "Built Beyond Standard", description: "Custom field solutions where precision, structural thinking, and craftsmanship meet.", imageSrc: "/craft.webp", tag: "Specialty work", href: "#contact" },
  { id: 5, title: "A Cleaner Canvas", description: "A careful exterior refresh using durable coatings and an exacting preparation process.", imageSrc: "/painting.webp", tag: "Residential painting", href: "#contact" },
];

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

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#061426]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="#top" aria-label="Ulrick Elite home" className="flex items-center gap-3">
          <Image src="/logo_icon_with_transparent_background.png" alt="" width={46} height={46} className="size-10 object-contain" priority />
          <span className="hidden leading-none text-white sm:block"><strong className="block text-[13px] tracking-[.15em]">ULRICK ELITE</strong><span className="mt-1 block font-mono text-[8px] tracking-[.24em] text-[#e2be6c]">GENERAL CONTRACTING</span></span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => <Link key={item.label} href={item.href} className="font-mono text-[10px] uppercase tracking-[.18em] text-white/65 transition hover:text-white">{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1" aria-label="Language options">
            <button className="flex size-8 items-center justify-center rounded-full bg-white/10 text-base" aria-label="English"><span aria-hidden="true">🇺🇸</span></button>
            <button className="flex size-8 items-center justify-center rounded-full text-base opacity-55 transition hover:opacity-100" aria-label="Español"><span aria-hidden="true">🇪🇸</span></button>
          </div>
          <Link href="#contact" className="group flex h-11 items-center gap-3 bg-[#d6aa55] px-5 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#061426] transition hover:bg-[#eccd86]">Start a project <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></Link>
        </div>
        <button onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center border border-white/15 text-white lg:hidden" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
      <div className={cn("overflow-hidden bg-[#061426] transition-[max-height] duration-500 lg:hidden", open ? "max-h-96 border-t border-white/10" : "max-h-0")}>
        <nav className="space-y-1 px-5 py-5" aria-label="Mobile navigation">
          {navItems.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 text-sm font-bold uppercase tracking-[.08em] text-white">{item.label}<ChevronRight className="size-4 text-[#d6aa55]" /></Link>)}
          <div className="flex items-center justify-between pt-5"><div className="flex gap-2 text-xl"><span aria-label="English">🇺🇸</span><span aria-label="Español" className="opacity-55">🇪🇸</span></div><Link href="#contact" onClick={() => setOpen(false)} className="bg-[#d6aa55] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#061426]">Start a project</Link></div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[820px] overflow-hidden bg-[#061426] pt-[74px] text-white lg:min-h-screen">
      <video autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[.09] mix-blend-screen" src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477" />
      <div className="blueprint-grid absolute inset-0 opacity-25" />
      <div className="absolute -left-52 top-40 size-[520px] rounded-full bg-[#173a5e]/35 blur-[120px]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-74px)] max-w-[1440px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:px-12 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.3em] text-[#e2be6c]"><span className="size-1.5 rounded-full bg-[#e2be6c] shadow-[0_0_18px_#e2be6c]" />Built with intent. Finished with pride.</motion.div>
          <h1 className="max-w-[780px] text-[clamp(3.5rem,8vw,7.8rem)] font-black uppercase leading-[.82] tracking-[-.065em]">
            <motion.span initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className="block">Building</motion.span>
            <motion.span initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: .08, ease: [0.22, 1, 0.36, 1] }} className="block text-outline-gold">Innovating</motion.span>
            <motion.span initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: .16, ease: [0.22, 1, 0.36, 1] }} className="block">Excellence<span className="text-[#d6aa55]">.</span></motion.span>
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .45 }} className="mt-9 grid max-w-2xl gap-7 border-l border-[#d6aa55]/55 pl-5 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-7">
            <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg">Residential, commercial, and specialty construction driven by honest communication and uncompromising craft.</p>
            <Link href="#services" className="group flex w-fit items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-white">Explore our work <span className="flex size-10 items-center justify-center rounded-full border border-white/20 transition group-hover:border-[#d6aa55] group-hover:bg-[#d6aa55] group-hover:text-[#061426]"><ArrowDown className="size-4" /></span></Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .2 }} className="relative h-[380px] lg:h-[640px]">
          <Card className="relative h-full overflow-hidden rounded-[2rem] border-white/10 bg-[#081a2c]/70 shadow-[0_45px_100px_rgba(0,0,0,.45)]">
            <Spotlight className="left-1/2 top-1/2" size={520} />
            <div className="absolute inset-0 blueprint-grid opacity-30" />
            <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#061426]/70 px-3 py-2 backdrop-blur-md"><CircleDot className="size-3 text-[#d6aa55]" /><span className="font-mono text-[8px] uppercase tracking-[.2em] text-white/60">Interactive build model</span></div>
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="h-full w-full" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061426] to-transparent" />
            <div className="absolute bottom-5 left-5 z-20"><p className="font-mono text-[8px] uppercase tracking-[.22em] text-[#e2be6c]">Drag to explore</p><p className="mt-1 text-sm font-bold uppercase tracking-[.08em] text-white">Craft from every angle</p></div>
          </Card>
          <div className="absolute -bottom-4 -right-1 z-20 grid size-28 place-items-center rounded-full border border-[#d6aa55]/30 bg-[#d6aa55] text-center text-[#061426] shadow-xl sm:-right-4 sm:size-32"><div><HardHat className="mx-auto mb-1 size-5" /><p className="font-mono text-[8px] font-bold uppercase tracking-[.16em]">General<br />Contracting</p></div></div>
        </motion.div>
      </div>
      <div className="relative border-y border-white/10 bg-[#04101d]/80 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 font-mono text-[9px] uppercase tracking-[.18em] text-white/45 sm:px-8 lg:px-12">
          {["Residential expertise", "Commercial discipline", "Exterior resilience", "Custom capability"].map((item) => <span key={item} className="flex items-center gap-3"><Check className="size-3 text-[#d6aa55]" />{item}</span>)}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-[#f3efe7] px-5 py-24 text-[#061426] sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1344px]">
        <Reveal className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><Eyebrow>What we build</Eyebrow><h2 className="text-[clamp(2.7rem,6vw,5.6rem)] font-black uppercase leading-[.9] tracking-[-.055em]">One standard.<br /><span className="text-[#a57a2f]">Every scope.</span></h2></div><p className="max-w-xl text-lg leading-8 text-[#061426]/60 lg:ml-auto">From the first site walk to the final detail, we bring practical thinking, disciplined coordination, and a craftsman’s eye to every project.</p></Reveal>
        <div className="mt-16 divide-y divide-[#061426]/15 border-y border-[#061426]/15">
          {services.map((service, index) => {
            const Icon = service.icon;
            return <Reveal key={service.number} delay={index * .04}><article className="group grid gap-5 py-8 transition sm:grid-cols-[80px_1.1fr_1fr_44px] sm:items-center lg:py-10"><span className="font-mono text-xs text-[#9a7432]">/{service.number}</span><div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full border border-[#061426]/15 bg-white/40 transition group-hover:border-[#d6aa55] group-hover:bg-[#d6aa55]"><Icon className="size-5" strokeWidth={1.6} /></span><h3 className="text-xl font-black uppercase leading-tight tracking-[-.025em] lg:text-2xl">{service.title}</h3></div><div><p className="text-sm leading-6 text-[#061426]/60">{service.copy}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.15em] text-[#9a7432]">{service.detail}</p></div><ArrowRight className="hidden size-5 text-[#9a7432] transition group-hover:translate-x-1 sm:block" /></article></Reveal>;
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="overflow-hidden bg-white px-5 py-24 text-[#061426] sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-[1344px] gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal className="relative min-h-[520px]">
          <div className="absolute left-0 top-0 h-[88%] w-[86%] overflow-hidden rounded-[1.5rem]"><Image src="/team.webp" alt="Construction professionals coordinating on site" fill className="object-cover" sizes="(max-width: 1024px) 90vw, 44vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#061426]/55 to-transparent" /></div>
          <div className="absolute bottom-0 right-0 w-[62%] border border-[#d6aa55]/25 bg-[#061426] p-6 text-white shadow-2xl sm:p-8"><Hammer className="mb-8 size-6 text-[#d6aa55]" /><p className="text-2xl font-black uppercase leading-tight tracking-[-.035em]">Built like our name is on it.</p><p className="mt-3 text-sm leading-6 text-white/55">Because it is—on every detail, every deadline, and every promise.</p></div>
        </Reveal>
        <Reveal className="lg:pl-10"><Eyebrow>The Ulrick Elite difference</Eyebrow><h2 className="text-[clamp(2.8rem,5.5vw,5.4rem)] font-black uppercase leading-[.9] tracking-[-.055em]">Strong process.<br />Stronger results.</h2><p className="mt-8 text-lg leading-8 text-[#061426]/60">Construction should feel clear, not chaotic. We align the scope, communicate what comes next, and solve problems before they become surprises.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">{[{ icon: Sparkles, title: "Finish-minded", text: "Details are planned from day one, not patched at the end." }, { icon: HardHat, title: "Field-proven", text: "Practical expertise keeps complex work moving." }, { icon: ShieldCheck, title: "Accountable", text: "Clear updates, honest answers, and respect for your property." }, { icon: Ruler, title: "Built to fit", text: "Solutions tailored to the space, scope, and long-term goal." }].map((item) => { const Icon = item.icon; return <div key={item.title} className="border-l border-[#d6aa55] pl-4"><Icon className="mb-3 size-5 text-[#9a7432]" strokeWidth={1.5} /><h3 className="text-sm font-black uppercase tracking-[.02em]">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#061426]/55">{item.text}</p></div>; })}</div>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="overflow-hidden bg-[#061426] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1344px]"><Reveal className="text-center"><div className="flex justify-center"><Eyebrow light>Selected capabilities</Eyebrow></div><h2 className="text-[clamp(2.8rem,6vw,5.8rem)] font-black uppercase leading-[.88] tracking-[-.055em]">Work that speaks<br /><span className="text-outline-gold">for itself.</span></h2><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/55">Explore the kind of care, coordination, and versatility we bring to every build. Swipe, drag, or use the arrow keys.</p></Reveal><Reveal className="mt-12"><CardStack items={projects} /></Reveal></div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="overflow-hidden bg-[#061426] pb-28 text-white lg:pb-36"><div className="mx-auto max-w-[1344px] px-5 pb-12 pt-4 text-center sm:px-8"><Reveal><div className="flex justify-center"><Eyebrow light>Client perspective</Eyebrow></div><h2 className="text-[clamp(2.6rem,5vw,4.8rem)] font-black uppercase leading-[.92] tracking-[-.05em]">Trust is built<br />one project at a time.</h2></Reveal></div><TestimonialMarquee /></section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#d6aa55] px-5 py-24 text-[#061426] sm:px-8 lg:px-12 lg:py-32">
      <div className="blueprint-grid absolute inset-0 opacity-15" />
          <div className="relative mx-auto grid max-w-[1344px] gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><Reveal><p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[.28em]">The next great project starts here</p><h2 className="max-w-4xl text-[clamp(3.2rem,7.5vw,7.4rem)] font-black uppercase leading-[.82] tracking-[-.065em]">Let’s build<br />something <span className="text-white">lasting.</span></h2></Reveal><Reveal className="lg:pb-2" delay={.12}><p className="max-w-lg text-lg leading-8 text-[#061426]/65">Tell us what you are planning. We will help clarify the scope, the right first step, and what it will take to bring it to life.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="mailto:?subject=Project%20Consultation%20%E2%80%94%20Ulrick%20Elite" className="group flex h-14 items-center justify-center gap-3 bg-[#061426] px-7 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-white transition hover:bg-[#102b45]">Request a consultation <ArrowRight className="size-4 transition group-hover:translate-x-1" /></a><span className="flex h-14 items-center justify-center gap-3 border border-[#061426]/25 px-7 font-mono text-[10px] font-bold uppercase tracking-[.18em]">English + Spanish</span></div><p className="mt-4 font-mono text-[8px] uppercase tracking-[.16em] text-[#061426]/45">Serving residential and commercial clients</p></Reveal></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#030d17] px-5 pb-8 pt-16 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-[1344px]"><div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto_auto]"><div className="flex items-center gap-4"><Image src="/logo_icon_with_transparent_background.png" alt="Ulrick Elite General Contracting" width={70} height={70} className="size-16 object-contain" /><div><p className="text-lg font-black tracking-[.14em]">ULRICK ELITE</p><p className="font-mono text-[9px] tracking-[.24em] text-[#d6aa55]">GENERAL CONTRACTING</p><p className="mt-3 text-xs text-white/40">Building. Innovating. Excellence.</p></div></div><div><p className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#d6aa55]">Navigate</p><div className="grid gap-2 text-sm text-white/55">{navItems.map((item) => <Link key={item.label} href={item.href} className="hover:text-white">{item.label}</Link>)}</div></div><div><p className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#d6aa55]">Languages</p><div className="flex gap-3 text-xl"><span aria-label="English">🇺🇸</span><span aria-label="Spanish">🇪🇸</span></div><p className="mt-3 text-xs text-white/40">English / Español</p></div></div><div className="flex flex-col justify-between gap-3 pt-7 font-mono text-[8px] uppercase tracking-[.16em] text-white/30 sm:flex-row"><p>© {new Date().getFullYear()} Ulrick Elite General Contracting</p><p>Built on craft. Backed by care.</p></div></div></footer>
  );
}

export default function HomePage() {
  return <main className="overflow-x-clip"><Header /><Hero /><Services /><About /><Projects /><Reviews /><Contact /><Footer /></main>;
}
