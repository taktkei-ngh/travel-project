import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal, Space, Table, Tooltip, Typography } from 'antd';
import config from '~/config';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '~/config/AuthContext';

const { Title, Text } = Typography;

export default function HistoryPayment() {
    const { token, getPaymentHistory, paymentHistory } = useAuth();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (token) {
            getPaymentHistory(token);
        }
    }, [token]);

    const [visible, setVisible] = useState(false);
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => config.webConfig.convertDateNoTime(date),
        },
        {
            title: 'Số tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (price) => config.webConfig.getCurrency(price),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status ? 'Thành công' : 'Thất bại'),
        },
        {
            title: 'Yêu cầu',
            key: 'action',
            render: (record) => (
                <Tooltip placement="top" title={'Gửi yêu cầu hoàn tiền'}>
                    <Button
                        icon={<PlusOutlined />} onClick={() => setVisible(!visible)}></Button>
                </Tooltip>
            ),
        },
    ];

    const handleSubmit = () => {
        //
        setTimeout(() => {
            message.success('Yêu cầu hoàn tiền đã được gửi thành công!', 1);
            setVisible(false); // Close modal after submission
        },300)
        //
    };

    const handleCancel = () => {
        setVisible(false); // Close modal
    };
    return (
        <div className="container mx-auto">
            <Table columns={columns} dataSource={paymentHistory} pagination={true} />
            <Modal
                open={visible}
                onCancel={handleCancel}
                footer={null}
                width={600} // Slightly reduced width for better focus
                className="rounded-xl overflow-hidden shadow-2xl"
                closeIcon={<span className="text-gray-500 text-xl hover:text-gray-700">×</span>}
                centered // Center the modal on screen
            >
                <div className="p-8 bg-white">
                    {/* Header with Icon and Title */}
                    <div className="flex items-center justify-center mb-6">
                        <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#faad14' }} />
                        <Title level={3} className="ml-3 mb-0 uppercase text-red-800">
                            Xác nhận yêu cầu hoàn tiền
                        </Title>
                    </div>

                    {/* Description */}
                    <Text className="block text-center text-gray-600 text-lg mb-8">
                        Bạn có chắc chắn muốn gửi yêu cầu hoàn tiền cho giao dịch này không?
                        Hành động này không thể hoàn tác.
                    </Text>
                    <div className={"flex flex-col w-full justify-center mb-6"}>
                        <label className={"text-gray-600 text-lg mr-2"}>Lý do hoàn tiền:</label>
                        <Input.TextArea className={"max-h-80"} rows={4} placeholder={"Nhập lý do hoàn tiền..."} />
                    </div>
                    <span className={"text-red-500 text-md mb-4"}>(* Quý khách sẽ được hoàn tiền 80% số tiền gốc)</span>
                    {/* Buttons */}
                    <Space direction="horizontal" size="large" className="flex justify-center">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                            style={{ minWidth: '120px' }}
                        >
                            Gửi yêu cầu
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            onClick={handleCancel}
                            className="rounded-lg border-gray-300 hover:border-gray-400 transition-colors duration-300"
                            style={{ minWidth: '120px' }}
                        >
                            Hủy
                        </Button>
                    </Space>
                </div>
            </Modal>
        </div>
    );
}
