import axios from 'axios';
import { DataExplorerBlock } from './data/block/DataExplorerBlock';

export const fetchBlockList = async (): Promise<DataExplorerBlock[] | null> => {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/block`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    console.log(e);
    return null;
  }
};
