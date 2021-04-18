import { DataExplorerBlockWithTransactions } from './data/block/DataExplorerBlockWithTransactions';
import axios from 'axios';

export const fetchSingleBlockWithHeight = async (
  height: number
): Promise<DataExplorerBlockWithTransactions | null> => {
  const url = `https://blockchain.info/block-height/${height}?format=json&cors=true`;
  try {
    const response = await axios.get(url);
    return response.data.blocks[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};
