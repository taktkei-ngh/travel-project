import {useCallback, useEffect, useState} from 'react';
import {Button, InputNumber, notification, Spin, Typography, Table, Tag, Space, Tooltip} from 'antd';
import {WalletOutlined, PlusOutlined, MinusOutlined} from '@ant-design/icons';
import WalletServices from '~/services/WalletServices';
import {useAuth} from '~/config/AuthContext';
import config from '~/config';

const {Title, Text} = Typography;

export const PersonalWallet = () => {
    const {currentUser} = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lấy số dư ví
    const fetchBalance = useCallback(async () => {
        try {
            setLoading(true);
            const response = await WalletServices.getBalance({
                id: currentUser.id,
                type: 'USER',
            });
            setBalance(response.balance || 0);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải số dư ví.',
            });
        } finally {
            setLoading(false);
        }
    }, [currentUser.id]);

    // Lấy lịch sử giao dịch
    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await WalletServices.getTransactions(currentUser.id);
            const filteredTransactions = (response || [])
                .filter(transaction => ['DEPOSIT', 'WITHDRAW', 'REFUNDED'].includes(transaction.type))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTransactions(filteredTransactions);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải lịch sử giao dịch.',
            });
        } finally {
            setLoading(false);
        }
    }, [currentUser.id]);

    // Nạp tiền
    const handleDeposit = async () => {
        if (!amount || amount <= 0) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Vui lòng nhập số tiền hợp lệ.',
            });
            return;
        }
        try {
            setLoading(true);
            await WalletServices.depositWallet(amount);
            notification.success({
                message: 'Thành công',
                description: `Đã nạp ${config.webConfig.getCurrency(amount)} vào ví.`,
            });
            setAmount(null);
            await fetchBalance();
            await fetchTransactions();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể nạp tiền vào ví.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Rút tiền
    const handleWithdraw = async () => {
        if (!amount || amount <= 0) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Vui lòng nhập số tiền hợp lệ.',
            });
            return;
        }
        if (amount > balance) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Số tiền rút vượt quá số dư hiện tại.',
            });
            return;
        }
        try {
            setLoading(true);
            await WalletServices.withdrawWallet(amount);
            notification.success({
                message: 'Thành công',
                description: `Đã rút ${config.webConfig.getCurrency(amount)} từ ví.`,
            });
            setAmount(null);
            await fetchBalance();
            await fetchTransactions();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể rút tiền từ ví.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu ban đầu
    useEffect(() => {
        if (currentUser?.id) {
            fetchBalance();
            fetchTransactions();
        }
    }, [currentUser, fetchBalance, fetchTransactions]);

    // Cột cho bảng giao dịch
    const transactionColumns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Tooltip title={text}><Text strong>{text.slice(0, 8)}...</Text></Tooltip>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                <Text
                    className={record.type === 'DEPOSIT' || record.type === 'REFUNDED' ? 'text-green-600' : 'text-red-600'}>
                    {record.type === 'DEPOSIT' || record.type === 'REFUNDED' ? '+' : '-'}
                    {config.webConfig.getCurrency(amount)}
                </Text>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const typeMap = {
                    DEPOSIT: 'Nạp tiền',
                    WITHDRAW: 'Rút tiền',
                    REFUNDED: 'Hoàn tiền',
                    REFUND_REQUEST: 'Yêu cầu hoàn',
                };
                return <Text>{typeMap[type] || type}</Text>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'COMPLETED' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}>
                    {status === 'COMPLETED' ? 'Thành công' : status === 'PENDING' ? 'Đang chờ' : 'Thất bại'}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (description) => {
                const desc = description || 'Không có';
                return desc.length > 40 ? (
                    <Tooltip title={desc}>
                        <Text className="italic">
                            {desc.slice(0, 40)}...
                        </Text>
                    </Tooltip>
                ) : (
                    <Text className="italic">{desc}</Text>
                );
            },
        },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text>
                    {new Date(date).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            ),
        },
    ];

    return (
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
            <Title level={2} className="text-gray-800 mb-6 flex items-center">
                <WalletOutlined className="mr-2 text-blue-600"/> Ví cá nhân
            </Title>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Spin size="large"/>
                </div>
            ) : (
                <>
                    {/* Số dư ví */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 mb-6">
                        <Title level={4} className="text-gray-800 mb-4">
                            Số dư hiện tại
                        </Title>
                        <Text className="text-2xl sm:text-3xl font-bold text-green-600">
                            {balance.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
                        </Text>
                    </div>

                    {/* Form nạp/rút tiền */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 mb-6">
                        <Title level={4} className="text-gray-800 mb-4">
                            Quản lý ví
                        </Title>
                        <Space direction="vertical" size="middle" className="w-full">
                            <InputNumber
                                min={0}
                                value={amount}
                                onChange={(value) => setAmount(value)}
                                placeholder="Nhập số tiền"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                className="w-full sm:w-64"
                                size="large"
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined/>}
                                    onClick={handleDeposit}
                                    loading={loading}
                                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                    size="large"
                                >
                                    Nạp tiền
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<MinusOutlined/>}
                                    onClick={handleWithdraw}
                                    loading={loading}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                                    size="large"
                                >
                                    Rút tiền
                                </Button>
                            </Space>
                        </Space>
                    </div>

                    {/* Lịch sử giao dịch */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                        <Title level={4} className="text-gray-800 mb-4">
                            Lịch sử giao dịch
                        </Title>
                        <Table
                            columns={transactionColumns}
                            dataSource={transactions}
                            rowKey="id"
                            pagination={{pageSize: 5, showSizeChanger: false}}
                            className="rounded-lg overflow-hidden"
                            locale={{emptyText: 'Không có giao dịch nào.'}}
                            scroll={{x: 'max-content'}}
                        />
                    </div>
                </>
            )}
        </div>
    );
};