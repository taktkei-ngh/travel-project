import React from 'react';
import { Card } from 'antd';
import { InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import config from '~/config';

export const StatusCard = ({ title, totalAmount, change }) => {
    return (
        <Card
            className="w-full h-fit border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            bordered={false}
            style={{ borderRadius: '8px', background: '#fff' }}
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-800">{title}</span>
                <InfoCircleOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-2">
                {config.webConfig.getCurrency(totalAmount)}
            </h2>
            <div className="text-sm">
                <span
                    className={`flex items-center font-medium ${
                        change?.type === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {change?.type === 'increase' ? (
                        <ArrowUpOutlined className="mr-1" />
                    ) : (
                        <ArrowDownOutlined className="mr-1" />
                    )}
                    {change?.value || 0}% so với năm ngoái
                </span>
            </div>
        </Card>
    );
};