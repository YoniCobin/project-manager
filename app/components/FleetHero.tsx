interface Props {
  totalCount: number
  availableCount: number
}

export function FleetHero({ totalCount, availableCount }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 mb-6 shadow-sm">
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -right-10 -bottom-16 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative">
        <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
          Luxury Collection
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
          צי הרכבים שלנו
        </h1>
        <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-6">
          פרארי, למבורגיני, פורשה ועוד — להשכרה יומית. חווית נהיגה יוקרתית, ללא פשרות.
        </p>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-2xl font-bold text-white">{totalCount}</p>
            <p className="text-xs text-slate-400">רכבי יוקרה</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-amber-400">{availableCount}</p>
            <p className="text-xs text-slate-400">זמינים עכשיו</p>
          </div>
        </div>
      </div>
    </section>
  )
}
