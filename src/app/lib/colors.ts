import { ProductColor } from '../contexts/cart-context'

// Color mapping from name to CSS hex color
export const COLOR_MAP: Record<string, string> = {
  'Rojo': '#ef4444',
  'Azul': '#3b82f6', 
  'Verde': '#22c55e',
  'Negro': '#1f2937',
  'Blanco': '#ffffff',
  'Amarillo': '#eab308',
  'Rosa': '#ec4899',
  'Morado': '#8b5cf6',
  'Naranja': '#f97316',
  'Gris': '#6b7280',
  'Marrón': '#92400e',
  'Beige': '#d6d3d1',
  'Azul marino': '#1e3a8a'
}

/**
 * Converts color names to ProductColor objects with hex values
 * @param colorNames Array of color names
 * @returns Array of ProductColor objects
 */
export function mapColorsToHex(colorNames: string[]): ProductColor[] {
  return colorNames.map(name => ({
    name,
    color: COLOR_MAP[name] || '#6b7280' // Default to gray if color not found
  }))
}

/**
 * Gets the hex color for a given color name
 * @param colorName The name of the color
 * @returns Hex color string
 */
export function getColorHex(colorName: string): string {
  return COLOR_MAP[colorName] || '#6b7280'
}

/**
 * Gets all available colors
 * @returns Array of all available ProductColor objects
 */
export function getAllAvailableColors(): ProductColor[] {
  return Object.entries(COLOR_MAP).map(([name, color]) => ({
    name,
    color
  }))
}