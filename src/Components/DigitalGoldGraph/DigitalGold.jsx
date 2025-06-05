import React from 'react';
import { IoMdArrowRoundUp } from 'react-icons/io';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
    { year: '2022', value: 299 },
    { year: '2023', value: 699 },
    { year: '2024', value: 1199 }
];

const DigitalGoldChart = () => {
    return (
        <div style={{ width: '100%', height: 150 }}>
            <p style={{ color: 'rgba(38,38,38,0.7)' }}>Digital Gold(<IoMdArrowRoundUp/>)</p>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#424141" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DigitalGoldChart;
