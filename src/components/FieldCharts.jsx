import { useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Stack , Typography } from '@mui/material';
import { Line, LineChart, Scatter, ScatterChart, XAxis, YAxis, Tooltip, Dot } from 'recharts';


function LineChartTooltip({ payload, label, active }) {
  if (active && payload && payload.length) {
    const date = new Date(label + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const niceString = `${month} ${day}, ${year}`;

    return (
      <div
        style={{
          border: '1px solid #3182bd',
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        <p style={{ margin: '0', fontWeight: '700' }}>{niceString}</p>
        <p style={{ margin: '0' }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }

  return null;
}
LineChartTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.string,
  active: PropTypes.bool
};

const RenderLargeHitArea = (props) => {
  const { cx, cy } = props;
  return (
    <svg>
      {/* Invisible large dot for hover */}
      <circle cx={cx} cy={cy} r={15} fill="transparent" />
      {/* Visible small dot */}
      <Dot {...props} r={5} />
    </svg>
  );
};
RenderLargeHitArea.propTypes = {
  cx: PropTypes.any,
  cy: PropTypes.any
};

function ScatterChartTooltip({ payload, active }) {
  if (active && payload && payload.length) {
    const { x, y } = payload[0].payload;
    const date = new Date(x);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const niceDateString = `${month} ${day}, ${year}`;

    const options = { 
      hour: '2-digit', 
      minute: '2-digit', 
    };
    const niceTimeString = date.toLocaleTimeString("en-US", options);

    return (
      <div
        style={{
          border: '1px solid #3182bd',
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        <p style={{ margin: '0', fontWeight: '700' }}>{niceDateString}</p>
        <p style={{ margin: '0', fontWeight: '700' }}>{niceTimeString}</p>
        <p style={{ margin: '0' }}>
          {y}%
        </p>
      </div>
    );
  }

  return null;
}
ScatterChartTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.string,
  active: PropTypes.bool
};

const reformatDate = (timestamp) => {
  const date = new Date(timestamp);
  // Months are 0-indexed, so add 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}`;
};

export default function FieldCharts({ lineChartData, scatterChartData }) {
  const [chart, setChart] = useState('line');

  const changeChartType = () => {
    setChart(chart === 'line' ? 'scatter' : 'line');
  }

  return (
    <div>
      <hr className='mx-auto mb-5 mt-10 border-gray-300' />

      <div className='text-center mb-4'>
        <p className='text-3xl'>{chart === 'line' ? 'Daily Average Field Moisture Percentage' : 'All Samples Taken in Field'}</p>
      </div>

      {chart === 'line' ? (
        <LineChart style={{ width: 'calc(100% + 50px)', aspectRatio: 1.5, marginLeft: -50 }} responsive data={lineChartData}>
          <Line dataKey="y" />
          <XAxis
            height={40}
            label={{
              value: 'Date',
              position: 'insideBottom'
            }}
            dataKey='x'
            tickFormatter={(date) => date.slice(5).replace('-','/')}
          />
          <YAxis
            width={85}
            label={{
              value: 'Daily Avg. Moisture (%)',
              angle: -90,
            }}
          />
          <Tooltip content={LineChartTooltip} />
        </LineChart>
      ) : (
        <ScatterChart style={{ width: 'calc(100% + 50px)', aspectRatio: 1.5, marginLeft: -50 }} responsive>
          <Scatter
            name='Samples'
            data={scatterChartData}
            shape={RenderLargeHitArea}
            fill='#3182bd'
          />
          <XAxis
            height={40}
            label={{
              value: 'Date',
              position: 'insideBottom'
            }}
            type='number'
            dataKey='x'
            tickFormatter={(timestamp) => reformatDate(timestamp)}
            domain={['auto', 'auto']}
          />
          <YAxis
            width={85}
            label={{
              value: 'Moisture (%)',
              angle: -90,
            }}
            dataKey='y'
          />
          <Tooltip content={ScatterChartTooltip} />
        </ScatterChart>
      )}

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: 'fit-content', margin: '0 auto', padding: '12px', border: '1px solid #3182bd', borderRadius: '5px' }}>
        <div className='w-24 text-center'>
          <Typography sx={{ fontSize: '12px' }}>Daily Average Moisture</Typography>
        </div>
        <Switch
          checked={chart === 'scatter'}
          onChange={changeChartType}
        />
        <div className='w-24 text-center'>
          <Typography sx={{ fontSize: '12px' }}>All Samples</Typography>
        </div>
      </Stack>

      <hr className='mx-auto mb-5 mt-10 border-gray-300' />
    </div>
  );
}

FieldCharts.propTypes = {
  lineChartData: PropTypes.array,
  scatterChartData: PropTypes.array
};