import React, { useEffect, useState } from 'react';

import './DataExplorerTopInfo.scss';
import LoaderMask from '../../LoaderMask/LoaderMask';
import { fetchSimpleMarketData } from '../../../services/explorer/MarketDataAPI';
import { VsCurrency } from '../../../services/explorer/data/CommonTypes';
import { DataExplorerMarketData } from '../../../services/explorer/data/market/DataExplorerMarketData';

interface DataExplorerTopInfoProps {
  vsCurrency: VsCurrency;
  currency: string;
}

const DataExplorerTopInfo: React.FC<DataExplorerTopInfoProps> = (props) => {
  const { currency, vsCurrency } = props;
  const [data, setData] = useState<DataExplorerMarketData | null>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const marketData = await fetchSimpleMarketData(currency, vsCurrency);
        setData(marketData);
        setIsFetching(false);
      } catch (e) {
        setIsFetching(false);
        setData(null);
      }
    };
    fetchData();
  }, [currency, vsCurrency]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: vsCurrency,
  });

  return data ? (
    isFetching && data !== null ? (
      <LoaderMask />
    ) : (
      <div className="comp-data-explorer-top-info container rounded border">
        <div className="row d-flex justify-content-around">
          <div className="col-4 col-md-2 m-3">
            <span className="font-weight-bold">
              {vsCurrency === 'usd'
                ? formatter.format(data.usd)
                : formatter.format(data.eur)}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              Price
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {vsCurrency === 'usd'
                ? formatter.format(data.usd_market_cap / 1000000)
                : formatter.format(data.eur_market_cap / 1000000)}
              M
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              Market Cap
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {vsCurrency === 'usd'
                ? formatter.format(data.usd_24h_vol / 1000000)
                : formatter.format(data.eur_24h_vol / 1000000)}
              M
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              24H Volume
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {vsCurrency === 'usd'
                ? parseFloat(data.usd_24h_change).toFixed(2)
                : parseFloat(data.eur_24h_change).toFixed(2)}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              24H Change
            </span>
          </div>
        </div>
      </div>
    )
  ) : (
    <div></div>
  );
};

export default DataExplorerTopInfo;
