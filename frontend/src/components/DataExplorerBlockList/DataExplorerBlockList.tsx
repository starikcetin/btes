import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DataExplorerBlockList.scss';
import LoaderMask from '../LoaderMask/LoaderMask';
import { Line } from 'react-chartjs-2';
import { BlockList, fetchBlockList } from '../../apis/BlockListAPI';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';

interface FormatBytesParams {
  bytes: any;
  decimals?: number;
}

const DataExplorerBlockList: React.FC = () => {
  const [data, setData] = useState<BlockList[] | null>(null);
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
        setData(null);
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
          <div>
            <span className="h4 text-info d-block">Latest Blocks</span>
            <span className="text-secondary d-block small">
              The most recently mined blocks
            </span>
          </div>
          <Table
            borderless
            hover
            className="comp-data-explorer-block-list-table"
          >
            <thead>
              <tr className="comp-data-explorer-block-list-table-header-row row">
                <th className="col-2">Height</th>
                <th className="col-4">Hash</th>
                <th className="col-1">Tx Count</th>
                <th className="col-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                data?.slice(0, 6).map((block) => (
                  <tr className="row" key={block.burn_block_height}>
                    <td className="col-2">{block.burn_block_height}</td>
                    <td className="col-4 text-truncate">{block.hash}</td>
                    <td className="col-1">{block.txs.length}</td>
                    <td className="col-4 text-truncate">
                      {formatTimestampForTimeInput(block.burn_block_time)}
                    </td>
                  </tr>
                ))
              ) : (
                <span className="alert-danger">
                  Block List Couldn't Downloaded!
                </span>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DataExplorerBlockList;
