export const twoDecimalFormat = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
