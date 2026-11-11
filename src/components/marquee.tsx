const words = [
  "Sushi",
  "Baos",
  "Arroces",
  "Perritos gourmet",
  "Hamburguesas",
  "Ceviches",
  "Parrilla",
  "Postres",
];

/** Cinta infinita de antojos entre el hero y las categorías. */
export function Marquee() {
  const run = [...words, ...words];
  return (
    <div className="relative z-10 -rotate-1 overflow-hidden border-y-2 border-carbon bg-coral py-4 shadow-[0_0_60px_-10px_rgb(240_82_67/0.5)]" aria-hidden>
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-6 font-display text-2xl uppercase text-carbon sm:text-3xl">{word}</span>
                <svg width="22" height="22" viewBox="0 0 24 24" className="text-white">
                  <path d="M12 1l2.6 7.4L22 11l-7.4 2.6L12 21l-2.6-7.4L2 11l7.4-2.6z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
