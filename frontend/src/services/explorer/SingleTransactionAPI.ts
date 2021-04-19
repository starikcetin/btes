import { DataExplorerTransaction } from './data/transaction/DataExplorerTransaction';
import axios from 'axios';

export const fetchSingleTransactionWithHash = async (
  transactionHash: string
): Promise<DataExplorerTransaction | null> => {
  const url = `https://blockchain.info/rawtx/${transactionHash}?format=json&cors=true`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
