import { Button, Card, Image, Input, message, Modal, Skeleton, Space, Spin, Switch, Table, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import UserServices from '~/services/UserServices';
import webConfig from '~/config/webConfig';
import { BiDetail } from 'react-icons/bi';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip as ReTooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { PhoneCall, RefreshCwIcon } from 'lucide-react';
import config from '~/config';
import { FaCheckCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [topBookedUsers, setTopBookedUsers] = useState([]);
    const [countUsers, setCountUsers] = useState(0);
    const [limit, setLimit] = useState(5);
    const [DetailModal, setDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchedData = useCallback(async () => {
        try {
            const [allUsers, topBooked, totalUsers] = await Promise.all([
                UserServices.getAllUsers(),
                UserServices.getTopBookedUsers(limit),
                UserServices.getCountUsers(),
            ]);
            setUsers(allUsers.data || []);
            setTopBookedUsers(topBooked.data || []);
            setCountUsers(totalUsers.data || 0);
        } catch (err) {
            console.error('Error:', err);
            message.error('Không thể tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchedData();
    }, [fetchedData, loading, limit]);

    const handleStatusChange = async (id, status) => {
        setLoading(true);
        try {
            await UserServices.updateUserStatus(id, status);
            message.success('Cập nhật trạng thái thành công!');
            fetchedData();
        } catch (error) {
            console.error('Error:', error);
            message.error('Không thể cập nhật trạng thái!');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        await fetchedData();
    };

    const chartData = topBookedUsers.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        bookings: `${user.bookingCount}`,
    }));

    const columns = [
        {
            title: 'Họ',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm Họ"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className="mb-2 block"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => confirm()}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Tìm
                        </button>
                        <button onClick={() => clearFilters()} className="bg-gray-300 px-2 py-1 rounded">
                            Xóa
                        </button>
                    </div>
                </div>
            ),
            filterIcon: <Tooltip title={'Tìm tên người dùng'}>
                <SearchOutlined />
            </Tooltip>,
            onFilter: (value, record) => record.lastName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Tên',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm Tên"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className="mb-2 block"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => confirm()}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Tìm
                        </button>
                        <button onClick={() => clearFilters()} className="bg-gray-300 px-2 py-1 rounded">
                            Xóa
                        </button>
                    </div>
                </div>
            ),
            filterIcon: <Tooltip title={'Tìm tên'}>
                <SearchOutlined />
            </Tooltip>,
            onFilter: (value, record) => record.lastName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm email"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className="mb-2 block"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => confirm()}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Tìm
                        </button>
                        <button onClick={() => clearFilters()} className="bg-gray-300 px-2 py-1 rounded">
                            Xóa
                        </button>
                    </div>
                </div>
            ),
            filterIcon: <Tooltip title={'Tìm email'}>
                <SearchOutlined />
            </Tooltip>,
            onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm số điện thoại"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className="mb-2 block"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => confirm()}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Tìm
                        </button>
                        <button onClick={() => clearFilters()} className="bg-gray-300 px-2 py-1 rounded">
                            Xóa
                        </button>
                    </div>
                </div>
            ),
            filterIcon: <Tooltip title={'Tìm Số điện thoại'}>
                <SearchOutlined />
            </Tooltip>,
            onFilter: (value, record) => record.phone.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            key: 'birthday',
            sorter: (a, b) => new Date(a.birthday) - new Date(b.birthday),
            render: (text) => {
                return `${webConfig.convertDateNoTime(text)}`;
            },
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            filters: [
                { text: 'Nam', value: 'MALE' },
                { text: 'Nữ', value: 'FEMALE' },
            ],
            render: (text) => (
                <>
                    {text ? 'Nữ' : 'Nam'}
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active, record) => (
                <Switch
                    checkedChildren="Mở khóa tài khoản"
                    unCheckedChildren="Khóa tài khoản"
                    checked={record.active}
                    onChange={(checked) => handleStatusChange(record.id, checked)}
                    loading={loading}
                />
            ),
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Không hoạt động', value: false },
            ],
            onFilter: (value, record) => record.active === value,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Tooltip title="Xem chi tiết thông tin">
                    <Button
                        icon={<BiDetail />}
                        type="text"
                        onClick={() => {
                            setSelectedUser(record);
                            setDetailModal(true);
                        }}
                        className="border border-gray-300"
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <div className="p-6">
                {/* Thống kê */}
                <Card title="Top người dùng đặt tour nhiều nhất" className="shadow-md">
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip
                                    formatter={(value) => `${value} lượt đặt`}
                                    labelFormatter={(label) => `Người dùng: ${label}`}
                                />
                                <Legend />
                                <Bar dataKey="bookings" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Card>

                {/* Bảng danh sách người dùng */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className={'flex justify-between items-center mb-4'}>
                        <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
                        <Space>
                            <h2 className={'text-orange-500 font-bold'}>Tổng số người dùng: {countUsers}</h2>
                            <Button
                                type={'text'}
                                icon={<RefreshCwIcon />}
                                onClick={handleRefresh}
                            >
                                Làm mới
                            </Button>
                        </Space>
                    </div>
                    {loading ? (
                        <Spin tip="Đang tải dữ liệu..." className="w-full flex justify-center" />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={users}
                            rowKey="id"
                            pagination={{ pageSize: 6 }}
                        />
                    )}
                </div>
            </div>
            <Modal
                title={
                    <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-black">Chi tiết người dùng</span>
                    </div>
                }
                open={DetailModal}
                onCancel={() => setDetailModal(false)}
                footer={null}
                width={900}
                className="rounded-lg overflow-hidden" // TailwindCSS cho modal
                headStyle={{
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    padding: '16px 24px',
                }} // Gradient header
                bodyStyle={{ padding: 0, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
            >
                {selectedUser ? (
                    <div className="flex flex-col md:flex-row p-6 gap-6">
                        {/* Phần Avatar và thông tin cơ bản */}
                        <div
                            className="flex-shrink-0 w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform duration-300">
                            <div className="flex flex-col items-center">
                                <Image
                                    width={150}
                                    height={150}
                                    src={config.imageConfig.getAvatar(selectedUser.avatar) || config.webConfig.defaultUser}
                                    alt="Avatar"
                                    className="rounded-full border-4 border-blue-500 object-cover"
                                    onError={(e) => {
                                        e.target.src = config.webConfig.defaultUser;
                                    }}
                                />
                                <h2 className="text-2xl font-bold text-gray-800">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h2>
                                <p className="text-sm text-gray-500">{selectedUser.role || 'Chưa xác định'}</p>
                                <div className="mt-2">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                            selectedUser.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                      {selectedUser.active ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <p className="text-gray-600">{selectedUser.phone || 'Chưa có'}</p>
                                        {selectedUser?.phoneVerified ? (
                                            <FaCheckCircle className={'text-green-500 text-xl font-semibold'} />
                                        ) : (
                                            <Tooltip title={'Chưa xác thực số điện thoại'}>
                                                <PhoneCall className={'text-red-500 text-xl font-semibold'} />
                                            </Tooltip>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-gray-600">{selectedUser.email || 'Chưa có'}</p>
                                        {selectedUser?.emailVerified ? (
                                            <FaCheckCircle className={'text-green-500 text-xl font-semibold'} />
                                        ) : (
                                            <Tooltip title={'Chưa xác thực email'}>
                                                <MdEmail className={'text-red-500 text-xl font-semibold'} />
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phần thông tin chi tiết */}
                        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Thông tin liên hệ */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Thông tin liên
                                        hệ</h3>
                                    <div>
                                        <span className="font-medium text-gray-600">Địa chỉ: </span>
                                        <span className="text-gray-800">{selectedUser.address || 'Chưa cung cấp'}</span>
                                    </div>
                                </div>

                                {/* Thông tin cá nhân */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Thông tin cá
                                        nhân</h3>
                                    <div>
                                        <span className="font-medium text-gray-600">Tên đăng nhập: </span>
                                        <span className="text-gray-800">{selectedUser.username}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Ngày sinh: </span>
                                        <span className="text-gray-800">
                                        {webConfig.convertDateNoTime(selectedUser.birthday) || 'Chưa cung cấp'}
                                      </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Giới tính: </span>
                                        <span className="text-gray-800">
                                            {selectedUser.gender === 'MALE'
                                                ? 'Nam'
                                                : selectedUser.gender === 'FEMALE'
                                                    ? 'Nữ'
                                                    : selectedUser.gender || 'Chưa xác định'}
                                          </span>
                                    </div>
                                </div>

                                {/* Thông tin tài khoản */}
                                <div className="space-y-3 md:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Thông tin tài
                                        khoản</h3>
                                    <div>
                                        <span className="font-medium text-gray-600">Số dư: </span>
                                        <span className="text-gray-800">
                                            {selectedUser.deposit !== null ? `${config.webConfig.getCurrency(selectedUser.deposit)}` : 'Chưa có'}
                                          </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Trạng thái: </span>
                                        {selectedUser.status === 'REQUIRE_USERNAME_PASSWORD_CHANGE' && (
                                            <span className={'text-red-500'}>Yêu cầu đổi mật khẩu khi sử dụng GOOGLE login</span>
                                        )}
                                        {selectedUser.status === 'REQUIRE_PASSWORD_CHANGE' && (
                                            <span className={'text-red-500'}>Yêu cầu đổi mật khẩu khi sử dụng GOOGLE login</span>
                                        )}
                                        {selectedUser.status === 'REQUIRE_USERNAME_CHANGE' && (
                                            <span className={'text-green-500'}>Hoạt động và có thể đổi username</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">Không có dữ liệu người dùng</div>
                )}
            </Modal>
        </>
    );
};