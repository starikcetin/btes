import React, { useEffect, useState } from 'react';
import './DataExplorerTopInfo.scss';
import LoaderMask from '../LoaderMask/LoaderMask';
import { fetchSimpleMarketData, VsCoins, MarketData } from '../../utils/API';

interface DataExplorerTopInfoProps {
  vsCurrency: VsCoins;
  currency: string;
}

const DataExplorerTopInfo: React.FC<DataExplorerTopInfoProps> = (props) => {
  const { currency, vsCurrency } = props;
  const [data, setData] = useState<MarketData | null>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const marketData = await fetchSimpleMarketData(currency, vsCurrency);
        console.log(marketData);
        setData(marketData);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
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

  // const intToString = (value: number) => {
  //   const suffixes = ['', 'k', 'm', 'b', 't'];
  //   const suffixNum = Math.floor(('' + value).length / 3);
  //   let shortValue = parseFloat(
  //     (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
  //       2
  //     )
  //   );
  //   if (shortValue % 1 != 0) {
  //     shortValue = shortValue.toFixed(1);
  //   }
  //   return shortValue + suffixes[suffixNum];
  // };
  return data ? (
    isFetching && data !== null ? (
      <LoaderMask />
    ) : (
      <div className="container rounded border">
        <div className="row d-flex justify-content-around">
          <div className="col-4 col-md-2 m-3">
            <span className="font-weight-bold">
              {vsCurrency === VsCoins.USD
                ? formatter.format(data.usd)
                : formatter.format(data.eur)}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              Price
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {vsCurrency === VsCoins.USD
                ? formatter.format(data.usd_market_cap)
                : formatter.format(data.eur_market_cap)}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              Market Cap
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {vsCurrency === VsCoins.USD
                ? formatter.format(data.usd_24h_vol)
                : formatter.format(data.eur_24h_vol)}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              24H Volume
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {vsCurrency === VsCoins.USD
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
