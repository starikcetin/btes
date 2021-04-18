import { VsCurrency } from './data/CommonTypes';
import { DataExplorerCurrenciesChartDataRaw } from './data/market/DataExplorerCurrenciesChartDataRaw';
import { DataExplorerCurrenciesChartData } from './data/market/DataExplorerCurrenciesChartData';
import axios from 'axios';

const formatData = (
  dataRaw: DataExplorerCurrenciesChartDataRaw
): DataExplorerCurrenciesChartData => {
  const data: DataExplorerCurrenciesChartData = {
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
): Promise<DataExplorerCurrenciesChartData | null> => {
  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vsCurrencies}&days=1`;
  try {
    const response = await axios.get(url);
    return formatData(response.data);
  } catch (e) {
    console.log(e);
    return null;
  }
};
