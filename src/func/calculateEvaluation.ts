interface CalculationVariables {
  basePrice: number;
  sumPercentages: number;
  weight?: number;
}

export function calculateAdjustedPrice({
  basePrice,
  sumPercentages,
}: CalculationVariables): number {
  return basePrice + basePrice * (sumPercentages / 100);
}

export function calculateWeightedPrice({
  basePrice,
  sumPercentages,
  weight = 0,
}: CalculationVariables): number {
  const adjustedPrice = calculateAdjustedPrice({ basePrice, sumPercentages });
  return adjustedPrice * (weight / 100);
}
