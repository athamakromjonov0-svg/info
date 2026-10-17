/**
 * SKELETON CARD — mahsulotlar yuklanayotganda ko'rsatiladigan
 * nafis "shimmer" zaxira karta (dizayn yuklanish hissini yashiradi).
 */
export default function SkeletonCard({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-900 bg-slate-950/70 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden"
          aria-hidden="true"
        >
          <div className="aspect-[4/4.2] w-full rounded-xl bg-slate-900/80 relative overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-1/3 rounded bg-slate-900/80 relative overflow-hidden">
              <div className="shimmer absolute inset-0" />
            </div>
            <div className="h-2.5 w-8 rounded bg-slate-900/80 relative overflow-hidden">
              <div className="shimmer absolute inset-0" />
            </div>
          </div>
          <div className="h-3.5 w-3/4 rounded bg-slate-900/80 relative overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="h-3 w-full rounded bg-slate-900/80 relative overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="mt-auto h-10 w-full rounded-xl bg-slate-900/80 relative overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
        </div>
      ))}
    </>
  );
}