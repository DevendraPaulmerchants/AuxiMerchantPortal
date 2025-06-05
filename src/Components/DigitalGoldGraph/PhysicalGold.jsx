import React from 'react';
import { IoMdArrowRoundDown } from 'react-icons/io';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { year: '2022', value: 999 },
  { year: '2023', value: 699 },
  { year: '2024', value: 299 }
];

const PhysicalGoldChart = () => {
  return (
    <div style={{ width: '100%', height: 200 }}>
      <p style={{ color: 'rgba(38,38,38,0.7)', marginBottom: 8 }}>Physical Gold(<IoMdArrowRoundDown/>)</p>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis
            dataKey="year"
            label={{
              value: 'Year',
              position: 'bottom',
              offset: 10
            }}
          />
          <YAxis
            label={{
              value: '₹',
              angle: 0,
              position: 'insideLeft'
            }}
          />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#424141"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PhysicalGoldChart;
