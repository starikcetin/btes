import React, { useEffect, useState } from 'react';
import DataExplorerLineChart from '../../components/DataExplorerLinearChart/DataExplorerLineChart';
import DataExplorerTopInfo from '../../components/DataExplorerTopInfo/DataExplorerTopInfo';
import DataExplorerBlockList from '../../components/DataExplorerBlockList/DataExplorerBlockList';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './DataExplorer.scss';
import { VsCurrencies } from '../../services/explorer/CommonTypes';
import {
  CurrenciesChartData,
  fetchCurrencyChartsData,
} from '../../services/explorer/CurrenciesChartAPI';
import DataExplorerTransactionList from '../../components/DataExplorerTransactionList/DataExplorerTransactionList';

const DataExplorer = () => {
  const [chartsData, setChartsData] = useState<CurrenciesChartData | null>();
  const [currency, setCurrency] = useState<string>('bitcoin');
  const [vsCurrency, setVsCurrency] = useState<VsCurrencies>(VsCurrencies.USD);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const data = await fetchCurrencyChartsData(currency, vsCurrency);
        setChartsData(data);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        setIsFetching(false);
        setChartsData(null);
      }
    };
    fetchData();
  }, [currency, vsCurrency]);

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
          <div className="col-12 col-md-12">
            {chartsData ? (
              <DataExplorerLineChart
                isFetching={isFetching}
                label={`Price in ${vsCurrency.toUpperCase()}`}
                xAxisData={chartsData?.pricesDates}
                yAxisData={chartsData?.prices}
                explanation={'The price of ' + currency + '  over the last day'}
              />
            ) : (
              <span className="alert-danger">Price Data Couldn't Found</span>
            )}
          </div>
        </div>
        <hr className="comp-data-explorer-horizontal-divider" />
        <div className="row d-flex justify-content-around">
          <div className="col-12 col-md-5">
            {chartsData ? (
              <DataExplorerLineChart
                isFetching={isFetching}
                label={`Total Volume`}
                xAxisData={chartsData?.totalVolumesDates}
                yAxisData={chartsData?.totalVolumes}
                explanation={''}
              />
            ) : (
              <span className="alert-danger">
                Total Volume Data Couldn't Found
              </span>
            )}
          </div>

          <div className="col-12 col-md-5">
            {chartsData ? (
              <DataExplorerLineChart
                isFetching={isFetching}
                label={`Market Cap`}
                xAxisData={chartsData?.marketCapsDates}
                yAxisData={chartsData?.marketCaps}
                explanation={''}
              />
            ) : (
              <span className="alert-danger">
                Market Cap Data Couldn't Found
              </span>
            )}
          </div>
        </div>
        <hr className="comp-data-explorer-horizontal-divider" />
        <div className="row">
          <div className="col-md-6 col-12">
            <DataExplorerBlockList />
          </div>
          <div className="col-md-6 col-12">
            <DataExplorerTransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
