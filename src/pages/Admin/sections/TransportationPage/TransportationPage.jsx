import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Image,
    Input,
    message,
    Space,
    Table,
    Tooltip,
    Typography,
} from 'antd';
import { RefreshCwIcon } from 'lucide-react';
import TransportServices from '~/services/TransportServices';
import config from '~/config';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddTransportModal from '~/pages/Admin/sections/TransportationPage/Components/AddTransportModal';
import EditTransportModal from '~/pages/Admin/sections/TransportationPage/Components/EditTransportModal';
import DeleteTransportModal from '~/pages/Admin/sections/TransportationPage/Components/DeleteTransportModal';

const { Title } = Typography;

// TYPE TRANSPORT: 1 - TRAIN, 2 - BUS, 3 - FLIGHT
const transportTypes = {
    1: 'Tàu',
    2: 'Xe khách',
    3: 'Máy bay',
};

export const TransportationPage = () => {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addTransportModalVisible, setAddTransportModalVisible] = useState(false);
    const [editTransportModalVisible, setEditTransportModalVisible] = useState(false);
    const [deleteTransportModalVisible, setDeleteTransportModalVisible] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState(null);

    const fetchTransports = useCallback(async () => {
        setLoading(true);
        try {
            const response = await TransportServices.getTransports();
            setTransports(response || []);
        } catch (error) {
            console.error('Error fetching transports:', error);
            message.error('Không thể tải danh sách phương tiện!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransports();
    }, [fetchTransports]);

    const handleDeleteTransport = async (id) => {
        try {
            await TransportServices.deleteTransport(id);
            message.success('Xóa phương tiện thành công!');
            fetchTransports();
        } catch (error) {
            console.error('Error deleting transport:', error);
            message.error('Không thể xóa phương tiện!');
        }
    };

    const columns = [
        {
            title: 'Mã phương tiện',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            width: 150,
        },
        {
            title: 'Tên phương tiện',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            filterSearch: true,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Tìm theo tên`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={confirm}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm
                        </Button>
                        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            width: 200,
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'cost',
            key: 'cost',
            sorter: (a, b) => a.cost - b.cost,
            render: (text) => `${config.webConfig.getCurrency(text)}`,
            filters: [
                { text: 'Dưới 500 nghìn', value: 1 },
                { text: '500 nghìn - 1 triệu', value: 2 },
                { text: '1 - 2 triệu', value: 3 },
                { text: 'Trên 2 triệu', value: 4 },
            ],
            onFilter: (value, record) => {
                const cost = record.cost;
                if (value === 1) return cost < 500000;
                if (value === 2) return cost >= 500000 && cost <= 1000000;
                if (value === 3) return cost > 1000000 && cost <= 2000000;
                if (value === 4) return cost > 2000000;
                return true;
            },
            width: 150,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <Image
                    src={config.imageConfig.getImage(image)}
                    alt="Transport"
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                    preview
                />
            ),
            width: 120,
        },
        {
            title: 'Loại phương tiện',
            dataIndex: 'typeTransport',
            key: 'typeTransport',
            sorter: (a, b) => a.typeTransport - b.typeTransport,
            render: (text) => transportTypes[text] || 'Không xác định',
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <span className={`text-sm font-semibold ${active ? 'text-red-500' : 'text-green-500'}`}>
                    {active ? 'Không hoạt động' : 'Hoạt động'}
                </span>
            ),
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Không hoạt động', value: false },
            ],
            onFilter: (value, record) => record.active === value,
            width: 150,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Tooltip title="Xóa phương tiện">
                        <Button
                            onClick={() => {
                                setSelectedTransport(record);
                                setDeleteTransportModalVisible(true);
                            }}
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa phương tiện">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedTransport(record);
                                setEditTransportModalVisible(true);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
            width: 120,
        },
    ];

    const handleRefresh = () => {
        setLoading(true);
        message.success('Danh sách phương tiện đã được cập nhật!');
        fetchTransports();
    };

    return (
        <>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <Title level={2} className="text-gray-800 m-0">
                            Danh sách phương tiện
                        </Title>
                        <Space>
                            <Button
                                icon={<RefreshCwIcon size={16} />}
                                loading={loading}
                                onClick={handleRefresh}
                                type="text"
                                className="flex items-center border border-gray-300"
                            >
                                Làm mới
                            </Button>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setAddTransportModalVisible(true)}
                                className="flex items-center"
                            >
                                Thêm phương tiện
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={transports}
                        loading={loading}
                        pagination={{ pageSize: 4, showSizeChanger: false }}
                        rowKey="id"
                        bordered
                        className="bg-white shadow-md rounded-lg"
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </div>

            <AddTransportModal
                loading={loading}
                visible={addTransportModalVisible}
                setVisible={setAddTransportModalVisible}
                setLoading={setLoading}
                fetchTransports={fetchTransports}
            />

            <EditTransportModal
                visible={editTransportModalVisible}
                setVisible={setEditTransportModalVisible}
                setLoading={setLoading}
                fetchTransports={fetchTransports}
                loading={loading}
                selectedTransport={selectedTransport}
            />

            <DeleteTransportModal
                setSelectedTransport={setSelectedTransport}
                visible={deleteTransportModalVisible}
                setVisible={setDeleteTransportModalVisible}
                selectedTransport={selectedTransport}
                handleDeleteTransport={handleDeleteTransport}
            />
        </>
    );
};