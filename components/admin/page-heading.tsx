export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.22em] text-[#9a7432]">{eyebrow}</p><h1 className="mt-2 text-3xl font-black uppercase tracking-[-.035em] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#061426]/55">{description}</p></div>{action}</div>;
}
