"use client";

export function SkeletonCard() {
  return (
    <div className="glass-card p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-3 w-16 bg-white/5 rounded" />
          </div>
        </div>
        <div className="h-8 w-16 bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-5 w-5 bg-white/10 rounded" />
          </div>
          <div className="h-8 w-32 bg-white/10 rounded mb-2" />
          <div className="h-3 w-20 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card p-4 animate-pulse space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white/10 rounded" />
            <div className="space-y-1">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-2 w-16 bg-white/5 rounded" />
            </div>
          </div>
          <div className="h-4 w-12 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-6 w-40 bg-white/10 rounded mb-4" />
      <div className="h-[300px] bg-white/5 rounded-xl" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass-card p-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-3 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-6 w-16 bg-white/10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="glass-card p-4 space-y-4 animate-pulse">
      <div className="h-6 w-32 bg-white/10 rounded" />
      <div className="space-y-3">
        <div className="h-10 w-full bg-white/10 rounded-xl" />
        <div className="h-10 w-full bg-white/10 rounded-xl" />
        <div className="h-10 w-full bg-white/10 rounded-xl" />
      </div>
      <div className="h-10 w-24 bg-white/10 rounded-xl" />
    </div>
  );
}
