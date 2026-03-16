import { IngredientTotal, ProductSelection, RecipeIngredient } from "@/types";
import { RECIPES, INGREDIENTS, getIngredient } from "@/data/recipes";
import { formatQuantity } from "./units";

export type RecipeOverrides = Record<string, RecipeIngredient[]>;

/**
 * Calculate total ingredient requirements from product selections.
 * Supports recipe overrides for custom portions.
 */
export function calculateTotals(
  selections: ProductSelection[],
  overrides?: RecipeOverrides
): IngredientTotal[] {
  const totals: Record<string, { units: number; grams: number }> = {};

  for (const sel of selections) {
    if (sel.quantity <= 0) continue;

    const recipeKey = `${sel.product}_${sel.variant}`;
    const recipe = RECIPES.find(
      (r) => r.product === sel.product && r.variant === sel.variant
    );
    if (!recipe) continue;

    // Use override ingredients if available, otherwise recipe defaults
    const ingredients = overrides?.[recipeKey] ?? recipe.ingredients;

    for (const ing of ingredients) {
      if (!totals[ing.id]) {
        totals[ing.id] = { units: 0, grams: 0 };
      }
      if (ing.units) {
        totals[ing.id].units += ing.units * sel.quantity;
      }
      if (ing.grams) {
        totals[ing.id].grams += ing.grams * sel.quantity;
      }
    }
  }

  // Convert to IngredientTotal array
  const result: IngredientTotal[] = [];
  for (const [id, val] of Object.entries(totals)) {
    if (val.units === 0 && val.grams === 0) continue;
    const ingredient = getIngredient(id);
    const name = ingredient?.name ?? id;
    const { value, unit } = formatQuantity(val.units, val.grams);

    result.push({
      id,
      name,
      units: val.units,
      grams: val.grams,
      displayValue: value,
      displayUnit: unit,
    });
  }

  // Sort: units first, then by name
  result.sort((a, b) => {
    const aIsUnit = a.units > 0 ? 0 : 1;
    const bIsUnit = b.units > 0 ? 0 : 1;
    if (aIsUnit !== bIsUnit) return aIsUnit - bIsUnit;
    return a.name.localeCompare(b.name);
  });

  return result;
}

/**
 * Estimate costs based on ingredient totals and prices.
 */
export function calculateCosts(
  totals: IngredientTotal[],
  prices: Record<string, { price: number; perUnit: "unit" | "kg" }>
): { ingredientId: string; name: string; cost: number }[] {
  const costs: { ingredientId: string; name: string; cost: number }[] = [];

  for (const total of totals) {
    const priceInfo = prices[total.id];
    if (!priceInfo) continue;

    let cost = 0;
    if (priceInfo.perUnit === "unit" && total.units > 0) {
      cost = total.units * priceInfo.price;
    } else if (priceInfo.perUnit === "kg" && total.grams > 0) {
      cost = (total.grams / 1000) * priceInfo.price;
    } else if (priceInfo.perUnit === "kg" && total.units > 0) {
      // For items sold by unit but priced per kg, use unit price
      cost = total.units * priceInfo.price;
    }

    costs.push({ ingredientId: total.id, name: total.name, cost });
  }

  return costs;
}
