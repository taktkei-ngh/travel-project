import React from 'react';
import { Button, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteTransportModal = ({ visible, setVisible, selectedTransport, setSelectedTransport, handleDeleteTransport }) => {
    return (
        <Modal
            open={visible}
            centered
            onCancel={() => {
                setVisible(false);
                setSelectedTransport(null);
            }}
            title={
                <div className="flex items-center gap-2">
                    <ExclamationCircleOutlined className="text-red-500 text-xl" />
                    <span className="text-lg font-semibold text-gray-800">Xác nhận xóa phương tiện</span>
                </div>
            }
            footer={null}
            width={400}
            className="rounded-lg shadow-lg"
            bodyStyle={{ padding: '20px', background: 'linear-gradient(to bottom right, #fef2f2, #fee2e2)' }}
        >
            <div className="flex flex-col items-center gap-4">
                <p className="text-gray-700 text-center">
                    Bạn có chắc chắn muốn xóa phương tiện <strong>{selectedTransport?.name}</strong> không?
                </p>
                <Space>
                    <Button
                        onClick={() => setVisible(false)}
                        className="rounded-md border-gray-300"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            handleDeleteTransport(selectedTransport.id);
                            setVisible(false);
                        }}
                        className="rounded-md"
                    >
                        Xóa
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default DeleteTransportModal;