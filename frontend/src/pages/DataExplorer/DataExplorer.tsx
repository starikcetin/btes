import React, { useEffect, useState } from 'react';
import DataExplorerLinearChart from '../../components/DataExplorerLinearChart/DataExplorerLinearChart';
import DataExplorerTopInfo from '../../components/DataExplorerTopInfo/DataExplorerTopInfo';
import DataExplorerBlockList from '../../components/DataExplorerBlockList/DataExplorerBlockList';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './DataExplorer.scss';
import { VsCoins } from '../../utils/API';

const DataExplorer = () => {
  const [chartData, setChartData] = useState({
    prices: [[]],
    total_volumes: [[]],
    market_caps: [[]],
  });
  const [currency, setCurrency] = useState<string>('bitcoin');
  const [vsCurrency, setVsCurrency] = useState<VsCoins>(VsCoins.USD);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        fetch(
          `https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=${vsCurrency}&days=1`
        )
          .then((response) => response.json())
          .then((data) => {
            setChartData(data);
            console.log(data);
            setIsFetching(false);
          });
      } catch (e) {
        console.log(e);
        setIsFetching(false);
      }
    };
    fetchData();
  }, [currency, vsCurrency]);

  const priceListForPrice: Array<string> = [];
  const timeListForPrice: Array<string> = [];
  const priceListForVolume: Array<string> = [];
  const timeListForVolume: Array<string> = [];
  const priceListForMarketCap: Array<string> = [];
  const timeListForMarketCap: Array<string> = [];
  chartData.prices.forEach((price) => {
    priceListForPrice.push(parseFloat(price[1]).toFixed(2));
    timeListForPrice.push(new Date(price[0]).getHours() + ':00');
  });
  chartData.market_caps.forEach((price) => {
    priceListForMarketCap.push(Number(price[1] / 1000000).toFixed(2));
    timeListForMarketCap.push(new Date(price[0]).getHours() + ':00');
  });
  chartData.total_volumes.forEach((price) => {
    priceListForVolume.push(Number(price[1] / 1000000).toFixed(2));
    timeListForVolume.push(new Date(price[0]).getHours() + ':00');
  });

  const changeCurrency = (e: any) => {
    setCurrency(e);
  };
  const changeVsCurrency = (e: any) => {
    setVsCurrency(e);
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-3 d-flex justify-content-center">
            <div className="row">
              <div className="col d-flex m-2">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={currency.toUpperCase()}
                  size="sm"
                  onSelect={changeCurrency}
                >
                  <Dropdown.Item eventKey="bitcoin">
                    <div>
                      <img
                        src={
                          'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579'
                        }
                      />
                      <span className="m-2">Bitcoin</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="ethereum">
                    <div>
                      <img
                        src={
                          'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880'
                        }
                      />
                      <span className="m-2">Ethereum</span>
                    </div>
                  </Dropdown.Item>
                </DropdownButton>
              </div>

              <div className="col d-flex m-2">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={vsCurrency.toUpperCase()}
                  size="sm"
                  onSelect={changeVsCurrency}
                >
                  <Dropdown.Item eventKey="usd" className="w-100">
                    <div>
                      <i className="fa fa-usd" />
                      <span className="m-2">USD</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="eur" className="w-100">
                    <div>
                      <i className="fa fa-eur" />
                      <span className="m-2">EUR</span>
                    </div>
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8 m-2">
            <DataExplorerTopInfo vsCurrency={vsCurrency} currency={currency} />
          </div>
          <hr className="comp-data-explorer-horizontal-divider" />
        </div>
        <div className="row">
          <div className="col-12">
            <DataExplorerLinearChart
              isFetching={isFetching}
              label={`Price in ${vsCurrency.toUpperCase()}`}
              xAxisData={timeListForPrice}
              yAxisData={priceListForPrice}
            />
          </div>
        </div>
        <hr className="comp-data-explorer-horizontal-divider" />
        <div className="row">
          <div className="col-12 col-md-6">
            <DataExplorerLinearChart
              isFetching={isFetching}
              label={'Total Volume'}
              xAxisData={timeListForVolume}
              yAxisData={priceListForVolume}
            />
          </div>

          <div className="col-12 col-md-6">
            <DataExplorerLinearChart
              isFetching={isFetching}
              label={'Market Cap'}
              xAxisData={timeListForMarketCap}
              yAxisData={priceListForMarketCap}
            />
          </div>
        </div>
        <hr className="comp-data-explorer-horizontal-divider" />
        <div className="row">
          <div className="col-md-6 col-12">
            <DataExplorerBlockList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
