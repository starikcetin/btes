import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DataExplorerBlockList.scss';
import LoaderMask from '../LoaderMask/LoaderMask';
import { Line } from 'react-chartjs-2';
import { BlockList, fetchBlockList } from '../../apis/BlockListAPI';

interface FormatBytesParams {
  bytes: any;
  decimals?: number;
}

const DataExplorerBlockList: React.FC = () => {
  const [data, setData] = useState<BlockList[] | []>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const formatDate = () => {
    const dateObj = new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = year + month + day;
    return output;
  };

  const formatBytes = ({ bytes, decimals = 2 }: FormatBytesParams) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const blockList = await fetchBlockList();
        setData(blockList);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        setIsFetching(false);
        setData([]);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {isFetching ? (
        <LoaderMask></LoaderMask>
      ) : (
        <div>
          <Table
            borderless
            striped
            hover
            size="sm"
            className="comp-data-explorer-block-list-table"
          >
            <thead>
              <tr className="comp-data-explorer-block-list-table-header-row">
                <th>Height</th>
                <th>Hash</th>
                <th>Transaction Count</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.slice(0, 10).map((block) => (
                <tr>
                  <td>{block.burn_block_height}</td>
                  <td>{block.hash}</td>
                  <td>{block.txs.length}</td>
                  <td>{block.burn_block_time_iso}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DataExplorerBlockList;
