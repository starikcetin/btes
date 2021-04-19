import { DataExplorerUnconfirmedTransaction } from './data/transaction/DataExplorerUnconfirmedTransaction';
import axios from 'axios';

export const fetchTransactionList = async (): Promise<
  DataExplorerUnconfirmedTransaction[] | null
> => {
  const url =
    'https://blockchain.info/unconfirmed-transactions?format=json&cors=true';
  try {
    const response = await axios.get(url);
    return response.data.txs;
  } catch (e) {
    console.log(e);
    return null;
  }
};
