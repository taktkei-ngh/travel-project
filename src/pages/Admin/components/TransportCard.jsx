import React from 'react';
import { Button, Space, Switch } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const TransportCard = ({
                           record,
                           onEdit,
                           onDelete,
                           onStatusChange
                       }) => {
    return (
        <Space>
            <Button
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                type="text"
            />
            <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => onDelete(record.id)}
                type="text"
            />
            <Switch
                checked={record.status === "active"}
                onChange={(checked) => onStatusChange(record.id, checked)}
            />
        </Space>
    );
};

export default TransportCard;