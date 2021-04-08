/** number ->  */
export const formatNumberToBitcoin = (value: number | undefined): string =>
  value ? value / 100000000 + ' BTC' : '0 BTC';
