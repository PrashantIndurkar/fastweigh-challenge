/**
 * Utility functions for weight calculations and conversions
 */

/**
 * Calculates net weight in pounds (gross - tare)
 * Never returns negative values (clamped to 0)
 */
export function calculateNetLbs(grossLbs: number, tareLbs: number): number {
  return Math.max(0, grossLbs - tareLbs);
}

/**
 * Converts pounds to tons (1 ton = 2000 lbs)
 * Rounds to 2 decimal places
 */
export function poundsToTons(lbs: number): number {
  return Number((lbs / 2000).toFixed(2));
}

/**
 * Parses price per ton from string format like "$22.50/T"
 * Returns numeric value (e.g., 22.50)
 */
export function parsePricePerTon(priceString: string): number {
  // Remove $, /T, and any whitespace, then parse as float
  const cleaned = priceString.replace(/[$/T\s]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculates total price from net tons and price per ton
 * Rounds to 2 decimal places
 */
export function calculateTotalPrice(
  netTons: number,
  pricePerTon: number,
): number {
  return Number((netTons * pricePerTon).toFixed(2));
}

/**
 * Parses tare weight string format like "31.2k" to pounds
 * Handles formats: "31.2k" (31,200 lbs), "29.3k" (29,300 lbs), etc.
 * Returns numeric value in pounds
 */
export function parseTareWeight(tareString: string): number {
  // Remove any whitespace
  const cleaned = tareString.trim();

  // Check if it ends with 'k' (thousands)
  if (cleaned.toLowerCase().endsWith("k")) {
    const numericPart = cleaned.slice(0, -1);
    const parsed = parseFloat(numericPart);
    if (!isNaN(parsed)) {
      // Convert to pounds (e.g., 31.2k -> 31,200 lbs)
      return parsed * 1000;
    }
  }

  // Try parsing as direct number (fallback)
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
