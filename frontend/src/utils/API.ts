export enum VsCoins {
  USD = 'usd',
  EUR = 'eur',
}

export interface MarketData {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: string;
  eur: number;
  eur_market_cap: number;
  eur_24h_vol: number;
  eur_24h_change: string;
}

export const fetchSimpleMarketData = async (coin: string, vsCoin: VsCoins) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCoin}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

  const data = await (await fetch(url)).json();

  return data[coin];
};
