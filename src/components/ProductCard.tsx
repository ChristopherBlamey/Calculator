"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";
import { Edit3 } from "lucide-react";

interface ProductCardProps {
  product: string;
  variant: string;
  variantLabel: string;
  categoryLabel: string;
  emoji: string;
  price?: number;
  onEdit?: () => void;
}

export function ProductCard({
  product,
  variant,
  variantLabel,
  categoryLabel,
  emoji,
  price,
  onEdit,
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
        group relative rounded-2xl p-3 transition-all duration-300 cursor-default
        ${
          isActive
            ? "bg-wanda-pink/10 border-2 border-wanda-pink/30 shadow-lg shadow-wanda-pink/10 scale-[1.02]"
            : "glass-card hover:border-[var(--cosmo)]"
        }
      `}
    >
      {/* Edit button - pencil icon */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-[var(--input-bg)] text-[var(--text-muted)] hover:bg-wanda-pink hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          title="Editar"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}

      {/* Active quantity badge */}
      {isActive && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-wanda-pink text-xs font-bold text-white shadow-lg animate-slide-up">
          {quantity}
        </div>
      )}

      {/* Emoji & Title */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">
          {emoji}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
            {variantLabel}
          </h3>
          {price && (
            <p className="text-xs font-semibold text-[var(--cosmo)]">
              ${price.toLocaleString("es-CL")}
            </p>
          )}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={decrement}
          disabled={quantity <= 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-wanda-pink text-white font-bold text-xl transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => handleInput(e.target.value)}
          className="h-9 flex-1 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-center text-base font-bold text-[var(--text-primary)] focus:border-wanda-pink focus:outline-none"
        />
        <button
          onClick={increment}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--cosmo)] text-black font-bold text-xl transition-all hover:opacity-80 active:scale-90"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}
