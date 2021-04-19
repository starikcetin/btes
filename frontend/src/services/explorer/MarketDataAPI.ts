import { VsCurrency } from './data/CommonTypes';
import { DataExplorerMarketData } from './data/market/DataExplorerMarketData';
import axios from 'axios';

export const fetchSimpleMarketData = async (
  coin: string,
  vsCurrencies: VsCurrency
): Promise<DataExplorerMarketData | null> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrencies}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
  try {
    const response = await axios.get(url);
    return response.data[coin];
  } catch (e) {
    console.log(e);
    return null;
  }
};
