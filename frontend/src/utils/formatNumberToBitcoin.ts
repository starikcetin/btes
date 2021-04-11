/** number ->  */
export const formatNumberToBitcoin = (
  value: number | undefined | null
): string =>
  value === null || value === undefined ? '0 BTC' : value / 100000000 + ' BTC';
