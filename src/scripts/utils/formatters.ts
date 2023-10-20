/**
 * Returns a decimal value with two decimals using Math.Round
 * @param num
 * @returns number
 */
export const twoDecimalFormat = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
