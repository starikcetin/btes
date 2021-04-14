import React from 'react';
import LoaderMask from '../../LoaderMask/LoaderMask';
import { Line } from 'react-chartjs-2';
import './DataExplorerLineChart.scss';

interface DataExplorerLinearChartProps {
  xAxisData: Array<string>;
  yAxisData: Array<string>;
  label: string;
  isFetching: boolean | undefined;
  explanation: string;
}

const DataExplorerLineChart: React.FC<DataExplorerLinearChartProps> = (
  props
) => {
  const { xAxisData, yAxisData, label, isFetching, explanation } = props;

  const data = {
    labels: xAxisData,
    datasets: [
      {
        lineTension: 0.1,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#1a237e',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        data: yAxisData,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    responsive: true,
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    scaleLabel: "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>",
  };
  return (
    <div>
      {isFetching ? (
        <LoaderMask></LoaderMask>
      ) : (
        <div className="m-4">
          <div>
            <span className="h4 text-info d-block">{label}</span>
            <span className="text-secondary d-block small">{explanation}</span>
          </div>
          <div className="comp-data-explorer-line-chart-header ml-5"></div>
          <Line height={100} data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default DataExplorerLineChart;
