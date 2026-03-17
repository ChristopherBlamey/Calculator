"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";

interface ProductCardProps {
  product: string;
  variant: string;
  variantLabel: string;
  categoryLabel: string;
  emoji: string;
}

export function ProductCard({
  product,
  variant,
  variantLabel,
  categoryLabel,
  emoji,
}: ProductCardProps) {
  const quantity =
    useCalculatorStore((s) =>
      s.selections.find((sel) => sel.product === product && sel.variant === variant)
    )?.quantity ?? 0;
  const setQuantity = useCalculatorStore((s) => s.setQuantity);

  const increment = () => setQuantity(product, variant, quantity + 1);
  const decrement = () => setQuantity(product, variant, quantity - 1);
  const handleInput = (val: string) => {
    const n = parseInt(val, 10);
    setQuantity(product, variant, isNaN(n) ? 0 : n);
  };

  const isActive = quantity > 0;

  return (
    <div
      className={`
        group relative rounded-2xl p-4 transition-all duration-300 cursor-default
        ${
          isActive
            ? "bg-linear-to-br from-[#E91E8C]/10 to-[#00C853]/10 border border-[#E91E8C]/30 shadow-lg shadow-[#E91E8C]/10 scale-[1.02]"
            : "glass-card hover:border-white/10 hover:bg-white/5"
        }
      `}
    >
      {/* Active quantity badge */}
      {isActive && (
        <div className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#E91E8C] to-[#FF6EB9] text-xs font-bold text-white shadow-lg shadow-[#E91E8C]/30 animate-slide-up">
          {quantity}
        </div>
      )}

      {/* Emoji & Title */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-3xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
          {emoji}
        </span>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">
            {categoryLabel}
          </h3>
          <p className={`text-xs font-semibold ${isActive ? "text-[#FF6EB9]" : "text-[#69F0AE]"}`}>
            {variantLabel}
          </p>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          disabled={quantity <= 0}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-wanda text-black text-2xl font-black shadow-[0_0_10px_var(--wanda)] transition-all hover:shadow-[0_0_20px_var(--wanda)] disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none active:scale-90"
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => handleInput(e.target.value)}
          className="h-10 w-14 rounded-xl bg-black/40 border-2 border-white/10 text-center text-lg font-bold text-white focus:border-wanda focus:ring-2 focus:ring-(--wanda)/20 focus:outline-none transition-all"
        />
        <button
          onClick={increment}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-cosmo text-black text-2xl font-black shadow-[0_0_10px_var(--cosmo)] transition-all hover:shadow-[0_0_20px_var(--cosmo)] active:scale-90"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}
