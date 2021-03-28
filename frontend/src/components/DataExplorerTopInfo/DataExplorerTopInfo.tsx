import React, { useEffect, useState } from 'react';
import './DataExplorerTopInfo.scss';
import LoaderMask from '../LoaderMask/LoaderMask';

interface DataExplorerTopInfoProps {
  vsCurrency: string;
  currency: string;
}

interface Idata {
  [key: string]: any;
}

const DataExplorerTopInfo: React.FC<DataExplorerTopInfoProps> = (props) => {
  const { currency, vsCurrency } = props;
  const [data, setData] = useState<Idata | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({ isFetching: true });
        fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=${vsCurrency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setData({ data: data, isFetching: false });
          });
      } catch (e) {
        console.log(e);
        setData({ data: null, isFetching: false });
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
    data.isFetching ? (
      <LoaderMask />
    ) : (
      <div className="container rounded border">
        <div className="row d-flex justify-content-around">
          <div className="col-4 col-md-2 m-3">
            <span className="font-weight-bold">
              {formatter.format(data.data[currency][vsCurrency])}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              Price
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {formatter.format(
                data.data[currency][vsCurrency + '_market_cap']
              )}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              Market Cap
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {formatter.format(data.data[currency][vsCurrency + '_24h_vol'])}
            </span>
            <span className="comp-data-explorer-top-info--info-span">
              24H Volume
            </span>
          </div>
          <div className="col-4 col-md-2 m-3 ">
            <span className="font-weight-bold">
              {parseFloat(
                data.data[currency][vsCurrency + '_24h_change']
              ).toFixed(2)}
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
