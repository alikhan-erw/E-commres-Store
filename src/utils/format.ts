/**
 * Formats a number into Pakistani Rupee (PKR) representation.
 * Example: 18500 -> "₨ 18,500" or "PKR 18,500"
 */
export function formatPKR(amount: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}

export function formatPKRWithCode(amount: number): string {
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `PKR ${formatted}`;
}

/**
 * Calculates discount percentage between original price and current price.
 */
export function calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Generates an authentic Zevora Order ID (e.g. ZV-84920).
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ZV-${randomNum}`;
}

/**
 * Generates an authentic courier tracking number (e.g. TCS-7392841).
 */
export function generateTrackingNumber(): string {
  const couriers = ['TCS', 'LEOPARDS', 'M&P', 'TRAX'];
  const courier = couriers[Math.floor(Math.random() * couriers.length)];
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `${courier}-${num}`;
}
