/**
 * Format ingredient quantities for display.
 * - grams >= 1000 → display as kilograms
 * - units stay as "unidades"
 */
export function formatQuantity(
  units: number,
  grams: number
): { value: string; unit: string } {
  if (units > 0 && grams === 0) {
    return { value: units.toString(), unit: units === 1 ? "unidad" : "unidades" };
  }

  if (grams >= 1000) {
    const kg = grams / 1000;
    return {
      value: kg % 1 === 0 ? kg.toString() : kg.toFixed(1),
      unit: "kg",
    };
  }

  return { value: grams.toString(), unit: "g" };
}

/**
 * Format a grams value for display (auto-converts to kg when >= 1000g)
 */
export function formatGrams(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
}
