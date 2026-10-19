import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Image,
    Input,
    message,
    Rate,
    Space,
    Table,
    Tooltip,
    Typography,
} from 'antd';
import { RefreshCwIcon } from 'lucide-react';
import HotelServices from '~/services/HotelServices';
import config from '~/config';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import DeleteHotelModal from '~/pages/Admin/sections/HotelPage/Components/DeleteHotelModal';
import AddHotelModal from '~/pages/Admin/sections/HotelPage/Components/AddHotelModal';
import EditHotelModal from '~/pages/Admin/sections/HotelPage/Components/EditHotelModal';


const { Title } = Typography;

export const HotelPage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addHotelModalVisible, setAddHotelModalVisible] = useState(false);
    const [editHotelModalVisible, setEditHotelModalVisible] = useState(false);
    const [deleteHotelModalVisible, setDeleteHotelModalVisible] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const fetchHotels = useCallback(async () => {
        setLoading(true);
        try {
            const response = await HotelServices.getAllHotels();
            setHotels(response.data || []);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            message.error('Không thể tải danh sách khách sạn!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    const handleDeleteHotel = async (id) => {
        try {
            await HotelServices.deleteHotel(id);
            message.success('Xóa khách sạn thành công!');
            fetchHotels();
        } catch (error) {
            console.error('Error deleting hotel:', error);
            message.error('Không thể xóa khách sạn!');
        }
    };

    const columns = [
        {
            title: 'Mã khách sạn',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            width: 120,
        },
        {
            title: 'Tên khách sạn',
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
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            width: 200,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            render: (value) => <Rate value={value} allowHalf disabled />,
            filters: [
                { text: '1 sao', value: 1 },
                { text: '2 sao', value: 2 },
                { text: '3 sao', value: 3 },
                { text: '4 sao', value: 4 },
                { text: '5 sao', value: 5 },
            ],
            onFilter: (value, record) => Math.floor(record.rating) === value,
            width: 150,
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'cost',
            key: 'cost',
            sorter: (a, b) => a.cost - b.cost,
            render: (text) => `${config.webConfig.getCurrency(text)}`,
            filters: [
                { text: 'Dưới 1 triệu', value: 1 },
                { text: '1 - 2 triệu', value: 2 },
                { text: '2 - 3 triệu', value: 3 },
                { text: 'Trên 3 triệu', value: 4 },
            ],
            onFilter: (value, record) => {
                const cost = record.cost;
                if (value === 1) return cost < 1000000;
                if (value === 2) return cost >= 1000000 && cost <= 2000000;
                if (value === 3) return cost > 2000000 && cost <= 3000000;
                if (value === 4) return cost > 3000000;
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
                    alt="Hotel"
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                    preview
                />
            ),
            width: 120,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Tooltip title="Xóa khách sạn">
                        <Button
                            onClick={() => {
                                setSelectedHotel(record);
                                setDeleteHotelModalVisible(true);
                            }}
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa thông tin">
                        <Button
                            onClick={() => {
                                setSelectedHotel(record);
                                setEditHotelModalVisible(true);
                            }}
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
            width: 120,
        },
    ];

    const handleRefresh = () => {
        setLoading(true);
        message.success('Danh sách khách sạn đã được cập nhật!', 1);
        fetchHotels();
    };

    return (
        <>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <Title level={2} className="text-gray-800 m-0">
                            Danh sách khách sạn
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
                                onClick={() => setAddHotelModalVisible(true)}
                                className="flex items-center"
                            >
                                Thêm khách sạn
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={hotels}
                        loading={loading}
                        pagination={{ pageSize: 4, showSizeChanger: false }}
                        rowKey="id"
                        bordered
                        className="bg-white shadow-md rounded-lg"
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </div>

            <AddHotelModal
                visible={addHotelModalVisible}
                setVisible={setAddHotelModalVisible}
                loading={loading}
                setLoading={setLoading}
                fetchHotels={fetchHotels}
            />

            <EditHotelModal
                visible={editHotelModalVisible}
                setVisible={setEditHotelModalVisible}
                loading={loading}
                setLoading={setLoading}
                fetchHotels={fetchHotels}
                selectedHotel={selectedHotel}
            />

            <DeleteHotelModal
                visible={deleteHotelModalVisible}
                setVisible={setDeleteHotelModalVisible}
                selectedHotel={selectedHotel}
                setSelectedHotel={setSelectedHotel}
                handleDeleteHotel={handleDeleteHotel}
            />
        </>
    );
};