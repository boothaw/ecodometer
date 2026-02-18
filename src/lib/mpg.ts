type RefuelForMpg = {
  miles: number;
  gallons: { toNumber(): number };
};

/**
 * Calculate lifetime average MPG from an ordered (asc by date) list of refuels.
 * Requires at least 2 refuels — the oldest establishes the baseline odometer
 * reading, and each subsequent refuel contributes its gallons and miles driven.
 * Returns a string like "28.4", or null if there's not enough data.
 */
export function calcMpg(refuels: RefuelForMpg[]): string | null {
  if (refuels.length < 2) return null;
  const totalMiles = refuels[refuels.length - 1].miles - refuels[0].miles;
  // Exclude the oldest refuel's gallons — we don't know how far the car travelled on that tank
  const totalGallons = refuels
    .slice(1)
    .reduce((sum, r) => sum + r.gallons.toNumber(), 0);
  if (totalGallons <= 0) return null;
  return (totalMiles / totalGallons).toFixed(1);
}
