import { VsCurrency } from './CommonTypes';

export interface CurrenciesChartDataRaw {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

export interface CurrenciesChartData {
  prices: string[];
  pricesDates: string[];
  marketCaps: string[];
  marketCapsDates: string[];
  totalVolumes: string[];
  totalVolumesDates: string[];
}

const formatData = (dataRaw: CurrenciesChartDataRaw): CurrenciesChartData => {
  const data: CurrenciesChartData = {
    marketCapsDates: [],
    totalVolumes: [],
    totalVolumesDates: [],
    prices: [],
    pricesDates: [],
    marketCaps: [],
  };
  dataRaw.prices.forEach((price) => {
    data.prices.push(parseFloat(String(price[1])).toFixed(2));
    data.pricesDates.push(new Date(price[0]).getHours() + ':00');
  });
  dataRaw.market_caps.forEach((price) => {
    data.marketCaps.push(Number(price[1] / 1000000).toFixed(2));
    data.marketCapsDates.push(new Date(price[0]).getHours() + ':00');
  });
  dataRaw.total_volumes.forEach((price) => {
    data.totalVolumes.push(Number(price[1] / 1000000).toFixed(2));
    data.totalVolumesDates.push(new Date(price[0]).getHours() + ':00');
  });

  return data;
};

export const fetchCurrencyChartsData = async (
  coin: string,
  vsCurrencies: VsCurrency
): Promise<CurrenciesChartData> => {
  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vsCurrencies}&days=1`;
  const dataRaw = await (await fetch(url)).json();

  return formatData(dataRaw);
};
