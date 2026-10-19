import React from 'react';
import { Button, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const DeleteVoucherModal = ({ open, onCancel, onConfirm, voucherTitle }) => {
    return (
        <Modal
            open={open}
            centered
            onCancel={onCancel}
            title={
                <div className="flex items-center gap-2">
                    <ExclamationCircleOutlined className="text-red-500 text-xl" />
                    <span className="text-lg font-semibold text-gray-800">Xác nhận xóa voucher</span>
                </div>
            }
            footer={null}
            width={400}
            className="rounded-lg shadow-lg"
            bodyStyle={{ padding: '20px', background: '#ffffff' }}
        >
            <div className="flex flex-col items-center gap-4">
                <p className="text-gray-700 text-center">
                    Bạn có chắc chắn muốn xóa voucher <strong>{voucherTitle}</strong> không?
                </p>
                <Space>
                    <Button onClick={onCancel} className="rounded-md border-gray-300">
                        Hủy
                    </Button>
                    <Button type="primary" danger onClick={onConfirm} className="rounded-md">
                        Xóa
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};
