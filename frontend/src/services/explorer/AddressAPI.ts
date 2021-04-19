import { DataExplorerAddressBalance } from './data/address/DataExplorerAddressBalance';
import axios from 'axios';

export const fetchAddressDetail = async (
  address: string
): Promise<DataExplorerAddressBalance | null> => {
  const url = `https://blockchain.info/rawaddr/${address}?cors=true`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
