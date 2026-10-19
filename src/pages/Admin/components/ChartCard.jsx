import React from 'react';
import { Card, Tooltip as tt } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import config from '~/config';

export const ChartCard = ({ title, totalAmount, change, chartData }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <p className="text-sm font-semibold">{`Tháng ${label}`}</p>
                    <p className="text-sm">{`Doanh thu: ${config.webConfig.getCurrency(payload[0].value)}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card
            className="w-full max-h-fit shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            bordered={false}
            style={{ borderRadius: '8px', background: '#fff' }}
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-800">{title}</span>
                <tt title="Đã được cập nhất mới nhất trong năm nay!">
                    <InfoCircleOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </tt>
            </div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-2">
                {config.webConfig.getCurrency(totalAmount)}
            </h2>
            <div className="text-sm mb-4">
                <span
                    className={`font-medium ${
                        change?.type === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {change?.type === 'increase' ? 'Tăng' : 'Giảm'} {change?.value || 0}% so với năm ngoái
                </span>
            </div>
            <div className="w-full border-t border-gray-200 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type={'monotone'}
                            dataKey="value"
                            dot={false}
                            stroke="#6366F1"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};