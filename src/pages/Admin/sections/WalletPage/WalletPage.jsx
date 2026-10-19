import { useCallback, useEffect, useState } from 'react';
import WalletServices from '~/services/WalletServices';
import { useAuth } from '~/config/AuthContext';
import {
    Button,
    Modal,
    notification,
    Select,
    Spin,
    Tooltip,
    Typography,
    Space,
    Table,
    Tag,
    Card,
    Statistic,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, WalletOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import config from '~/config';
import { GamblingCard } from '~/pages/Admin/GamblingCard';

const { Text } = Typography;


export const WalletPage = () => {
    const { currentUser } = useAuth();

    const [refundRequests, setRefundRequests] = useState([]);
    const [systemWallet, setSystemWallet] = useState({
        balance: 0,
        totalRefunded: 0,
        totalTransactions: 0,
    });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [modalAction, setModalAction] = useState(null); // 'approve' or 'reject'

    // Lấy thông tin ví hệ thống
    const getSystemWallet = useCallback(async () => {
        try {
            setLoading(true);
            const response = await WalletServices.getSystemBalance();
            setSystemWallet({
                balance: response.data.balance || 0,
                totalRefunded: response.data.totalRefunded || 0,
                totalTransactions: response.data.totalTransactions || 0,
            });
        } catch (error) {
            console.error('Error fetching system wallet:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải thông tin ví hệ thống. Vui lòng thử lại.',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy danh sách yêu cầu hoàn tiền
    const getRefundRequests = useCallback(async () => {
        try {
            setLoading(true);
            const response = await WalletServices.getRequests();
            setRefundRequests(response.data || []);
        } catch (error) {
            console.error('Error fetching refund requests:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải danh sách yêu cầu hoàn tiền.',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy dữ liệu ban đầu
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getSystemWallet(), getRefundRequests()]);
        };
        if (currentUser?.id) {
            fetchData();
        }
    }, [currentUser, getSystemWallet, getRefundRequests]);

    // Xử lý duyệt/từ chối yêu cầu hoàn tiền
    const handleRefundAction = async () => {
        try {
            setLoading(true);
            await WalletServices.approve({
                bookingId: selectedRequest.bookingId,
                approved: modalAction === 'approve',
                adminId: currentUser.id,
            });
            notification.success({
                message: 'Thành công',
                description: `Yêu cầu hoàn tiền đã được ${modalAction === 'approve' ? 'duyệt' : 'từ chối'}.`,
            });
            setModalVisible(false);
            await Promise.all([getSystemWallet(), getRefundRequests()]); // Cập nhật cả ví và yêu cầu
        } catch (error) {
            console.error('Error processing refund:', error);
            notification.error({
                message: 'Lỗi',
                description: `Không thể ${modalAction === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu hoàn tiền.`,
            });
        } finally {
            setLoading(false);
        }
    };

    // Mở Modal xác nhận
    const openModal = (request, action) => {
        setSelectedRequest(request);
        setModalAction(action);
        setModalVisible(true);
    };

    // Cột cho bảng yêu cầu hoàn tiền
    const refundColumns = [
        {
            title: 'Mã Booking',
            dataIndex: 'bookingNo',
            key: 'bookingNo',
            render: (text) => (
                <Tooltip title={`Booking: ${text}`}>
                    <Text strong className="text-blue-600 hover:underline cursor-pointer">{text}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Người dùng',
            dataIndex: 'userName',
            key: 'userName',
            render: (text, record) => (
                <Tooltip title={`Email: ${record.userEmail}`}>
                    {console.log(record)}
                    <Text>{text}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Số tiền hoàn lại',
            dataIndex: 'refundAmount',
            key: 'refundAmount',
            render: (amount) => (
                <Text className="text-green-600 font-medium">
                    {config.webConfig.getCurrency(amount)}
                </Text>
            ),
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => (
                <Text className="italic text-gray-600">{reason || 'Không cung cấp'}</Text>
            ),
        },
        {
            title: 'Ngày yêu cầu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text>
                    {new Date(date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: () => <Tag color="orange" className="font-medium">Chờ duyệt</Tag>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Duyệt yêu cầu hoàn tiền">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<CheckCircleOutlined />}
                            className="bg-green-500 hover:bg-green-600 border-none"
                            onClick={() => openModal(record, 'approve')}
                        />
                    </Tooltip>
                    <Tooltip title="Từ chối yêu cầu hoàn tiền">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<CloseCircleOutlined />}
                            className="bg-red-500 hover:bg-red-600 border-none"
                            onClick={() => openModal(record, 'reject')}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
            <Title level={2} className="text-gray-800 mb-4 sm:mb-0">
                Quản lý ví và hoàn tiền
            </Title>
            <div className={"flex flex-wrap gap-4 sm:gap-6 mb-8 w-full"}>
                <Card
                    className="mb-6 max-w-lg shadow-md border border-gray-200"
                    title={
                        <div className="flex items-center space-x-2">
                            <WalletOutlined className="text-blue-600" />
                            <Text strong>Ví hệ thống</Text>
                        </div>
                    }
                >
                    <div className="p-4">
                        {loading ? (
                            <div className="flex justify-center">
                                <Spin />
                            </div>
                        ) : (
                            <Space direction="vertical" size="middle" className="w-full justify-between gap-2">
                                <Statistic
                                    title="Số dư hiện tại"
                                    value={systemWallet.balance}
                                    formatter={(value) => (
                                        <Text strong className="text-green-600">
                                            {config.webConfig.getCurrency(value)}
                                        </Text>
                                    )}
                                />
                                <Statistic
                                    title="Tổng tiền đã hoàn"
                                    value={systemWallet.totalRefunded}
                                    formatter={(value) => (
                                        <Text strong className="text-orange-600">
                                            {config.webConfig.getCurrency(value)}
                                        </Text>
                                    )}
                                />
                                <Statistic
                                    title="Tổng giao dịch"
                                    value={systemWallet.totalTransactions}
                                    formatter={(value) => (
                                        <Text strong className="text-blue-600">
                                            {value.toLocaleString('vi-VN')} Giao dịch
                                        </Text>
                                    )}
                                />
                            </Space>
                        )}
                    </div>
                </Card>
                {currentUser.username === 'khang1z2t' && (
                    <GamblingCard onUpdateWallet={getSystemWallet} />
                )}
            </div>

            {/* Ví hệ thống */}

            {/* Section duyệt hoàn tiền */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                <Title level={4} className="text-gray-800 mb-4">
                    Yêu cầu hoàn tiền
                </Title>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={refundColumns}
                        dataSource={refundRequests}
                        rowKey="bookingId"
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        className="rounded-lg overflow-hidden"
                        locale={{ emptyText: 'Không có yêu cầu hoàn tiền nào.' }}
                        scroll={{ x: 'max-content' }}
                    />
                )}
            </div>

            {/* Modal xác nhận duyệt/từ chối */}
            <Modal
                title={
                    <div className="flex items-center space-x-3">
                        <ExclamationCircleOutlined className="text-yellow-500 text-xl" />
                        <span className="text-lg sm:text-xl font-semibold text-gray-800">
                            {modalAction === 'approve' ? 'Xác nhận duyệt hoàn tiền' : 'Xác nhận từ chối hoàn tiền'}
                        </span>
                    </div>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width="90%"
                style={{ maxWidth: 520 }}
                bodyStyle={{ padding: '20px 24px' }}
                className="rounded-xl shadow-lg"
            >
                <div className="p-4">
                    <Text className="text-gray-600 text-sm sm:text-base mb-3 block">
                        Bạn có chắc chắn muốn <strong>{modalAction === 'approve' ? 'duyệt' : 'từ chối'}</strong> yêu cầu
                        hoàn tiền cho booking <strong>{selectedRequest?.bookingNo}</strong>?
                    </Text>
                    {modalAction === 'approve' && (
                        <Text className="text-gray-600 text-sm sm:text-base mb-3 block">
                            Số tiền hoàn lại:{' '}
                            <strong>
                                {config.webConfig.getCurrency(selectedRequest?.refundAmount)}
                            </strong>
                        </Text>
                    )}
                    <div
                        className="flex items-start space-x-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                        <ExclamationCircleOutlined className="text-yellow-500 text-lg mt-1" />
                        <Text className="text-yellow-700 text-sm sm:text-base">
                            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Hãy kiểm tra kỹ trước khi xác
                            nhận.
                        </Text>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="default"
                            size="large"
                            onClick={() => setModalVisible(false)}
                            className="rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 px-4 sm:px-6 py-1 sm:py-2 text-sm"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleRefundAction}
                            loading={loading}
                            className={`rounded-lg font-medium transition-all duration-200 px-4 sm:px-6 py-1 sm:py-2 text-sm ${
                                modalAction === 'approve'
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                            }`}
                        >
                            {modalAction === 'approve' ? 'Duyệt' : 'Từ chối'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};