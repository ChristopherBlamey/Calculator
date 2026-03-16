import { Recipe, Ingredient, ProductCategory } from "@/types";

// ===== Product Categories =====
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    type: "completo",
    label: "Completo",
    emoji: "🌭",
    variants: [
      { key: "solo", label: "Solo" },
      { key: "italiano", label: "Italiano" },
      { key: "dinamico", label: "Dinámico" },
      { key: "completo", label: "Completo" },
    ],
  },
  {
    type: "hamburguesa",
    label: "Hamburguesa",
    emoji: "🍔",
    variants: [
      { key: "simple", label: "Simple" },
      { key: "italiana", label: "Italiana" },
      { key: "completa", label: "Completa" },
    ],
  },
  {
    type: "churrasco",
    label: "Churrasco",
    emoji: "🥪",
    variants: [
      { key: "italiano", label: "Italiano" },
      { key: "completo", label: "Completo" },
    ],
  },
  {
    type: "as",
    label: "As",
    emoji: "🥩",
    variants: [
      { key: "italiano", label: "Italiano" },
      { key: "completo", label: "Completo" },
    ],
  },
];

// ===== Ingredients Master List =====
export const INGREDIENTS: Ingredient[] = [
  { id: "pan_completo", name: "Pan de Completo", defaultUnit: "units" },
  { id: "pan_hamburguesa", name: "Pan de Hamburguesa", defaultUnit: "units" },
  { id: "pan_frica", name: "Pan de Frica", defaultUnit: "units" },
  { id: "vienesa", name: "Vienesa", defaultUnit: "units" },
  { id: "carne_hamburguesa", name: "Carne de Hamburguesa", defaultUnit: "grams" },
  { id: "carne_churrasco", name: "Carne de Churrasco", defaultUnit: "grams" },
  { id: "palta", name: "Palta", emoji: "🥑", defaultUnit: "grams" },
  { id: "tomate", name: "Tomate", emoji: "🍅", defaultUnit: "grams" },
  { id: "mayonesa", name: "Mayonesa", defaultUnit: "grams" },
  { id: "ketchup", name: "Ketchup", defaultUnit: "grams" },
  { id: "mostaza", name: "Mostaza", defaultUnit: "grams" },
  { id: "chucrut", name: "Chucrut", defaultUnit: "grams" },
  { id: "americana", name: "Americana", defaultUnit: "grams" },
  { id: "queso", name: "Queso", defaultUnit: "grams" },
];

// ===== Recipes =====
export const RECIPES: Recipe[] = [
  // === COMPLETOS ===
  {
    product: "completo",
    variant: "solo",
    variantLabel: "Solo",
    ingredients: [
      { id: "pan_completo", units: 1 },
      { id: "vienesa", units: 1 },
      { id: "mayonesa", grams: 20 },
    ],
  },
  {
    product: "completo",
    variant: "italiano",
    variantLabel: "Italiano",
    ingredients: [
      { id: "pan_completo", units: 1 },
      { id: "vienesa", units: 1 },
      { id: "palta", grams: 50 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 25 },
    ],
  },
  {
    product: "completo",
    variant: "dinamico",
    variantLabel: "Dinámico",
    ingredients: [
      { id: "pan_completo", units: 1 },
      { id: "vienesa", units: 1 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 20 },
      { id: "chucrut", grams: 30 },
      { id: "americana", grams: 25 },
    ],
  },
  {
    product: "completo",
    variant: "completo",
    variantLabel: "Completo",
    ingredients: [
      { id: "pan_completo", units: 1 },
      { id: "vienesa", units: 1 },
      { id: "palta", grams: 50 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 25 },
      { id: "chucrut", grams: 30 },
      { id: "americana", grams: 25 },
    ],
  },
  // === HAMBURGUESAS ===
  {
    product: "hamburguesa",
    variant: "simple",
    variantLabel: "Simple",
    ingredients: [
      { id: "pan_hamburguesa", units: 1 },
      { id: "carne_hamburguesa", grams: 120 },
      { id: "mayonesa", grams: 20 },
      { id: "ketchup", grams: 15 },
      { id: "mostaza", grams: 10 },
    ],
  },
  {
    product: "hamburguesa",
    variant: "italiana",
    variantLabel: "Italiana",
    ingredients: [
      { id: "pan_hamburguesa", units: 1 },
      { id: "carne_hamburguesa", grams: 120 },
      { id: "palta", grams: 50 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 25 },
    ],
  },
  {
    product: "hamburguesa",
    variant: "completa",
    variantLabel: "Completa",
    ingredients: [
      { id: "pan_hamburguesa", units: 1 },
      { id: "carne_hamburguesa", grams: 120 },
      { id: "palta", grams: 50 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 25 },
      { id: "ketchup", grams: 15 },
      { id: "mostaza", grams: 10 },
      { id: "queso", grams: 30 },
    ],
  },
  // === CHURRASCOS ===
  {
    product: "churrasco",
    variant: "italiano",
    variantLabel: "Italiano",
    ingredients: [
      { id: "pan_frica", units: 1 },
      { id: "carne_churrasco", grams: 120 },
      { id: "palta", grams: 50 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 25 },
    ],
  },
  {
    product: "churrasco",
    variant: "completo",
    variantLabel: "Completo",
    ingredients: [
      { id: "pan_frica", units: 1 },
      { id: "carne_churrasco", grams: 120 },
      { id: "palta", grams: 50 },
      { id: "tomate", grams: 40 },
      { id: "mayonesa", grams: 25 },
      { id: "chucrut", grams: 30 },
      { id: "americana", grams: 25 },
    ],
  },
  // === AS ===
  {
    product: "as",
    variant: "italiano",
    variantLabel: "Italiano",
    ingredients: [
      { id: "pan_frica", units: 1 },
      { id: "carne_churrasco", grams: 150 },
      { id: "palta", grams: 60 },
      { id: "tomate", grams: 50 },
      { id: "mayonesa", grams: 30 },
    ],
  },
  {
    product: "as",
    variant: "completo",
    variantLabel: "Completo",
    ingredients: [
      { id: "pan_frica", units: 1 },
      { id: "carne_churrasco", grams: 150 },
      { id: "palta", grams: 60 },
      { id: "tomate", grams: 50 },
      { id: "mayonesa", grams: 30 },
      { id: "chucrut", grams: 30 },
      { id: "americana", grams: 25 },
    ],
  },
];

export function getRecipe(product: string, variant: string): Recipe | undefined {
  return RECIPES.find((r) => r.product === product && r.variant === variant);
}

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}
