import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import DestinationServices from '~/services/DestinationServices';
import { RefreshCwIcon } from 'lucide-react';

const { Option } = Select;

export const DestinationPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [form] = Form.useForm();

    // Lấy danh sách destinations khi component mount
    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const response = await DestinationServices.getAll();
            setDestinations(response || []);
        } catch (error) {
            message.error('Không thể tải danh sách điểm đến!');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thêm destination
    const handleAdd = async (values) => {
        try {
            await DestinationServices.addDestination(values);
            message.success('Thêm điểm đến thành công!');
            setAddModalVisible(false);
            form.resetFields();
            fetchDestinations(); // Làm mới danh sách
        } catch (error) {
            message.error('Thêm điểm đến thất bại!');
        }
    };

    // Xử lý sửa destination
    const handleUpdate = async (values) => {
        try {
            await DestinationServices.updateDestination(selectedDestination.id, values);
            message.success('Cập nhật điểm đến thành công!');
            setEditModalVisible(false);
            form.resetFields();
            fetchDestinations();
        } catch (error) {
            message.error('Cập nhật điểm đến thất bại!');
        }
    };

    // Xử lý xóa destination
    const handleDelete = async (id) => {
        Modal.confirm({
            centered: true,
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa điểm đến này?',
            onOk: async () => {
                try {
                    await DestinationServices.deleteDestination(id);
                    message.success('Xóa điểm đến thành công!');
                    fetchDestinations();
                } catch (error) {
                    message.error('Xóa điểm đến thất bại!');
                }
            },
        });
    };

    // Mở modal sửa và điền dữ liệu
    const openEditModal = (record) => {
        setSelectedDestination(record);
        form.setFieldsValue(record);
        setEditModalVisible(true);
    };

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'Tên điểm đến',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name), // Sắp xếp A-Z
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm tên điểm đến"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        className="mb-2 block w-48"
                    />
                    <Space>
                        <Button type="primary" onClick={confirm} size="small">
                            Tìm
                        </Button>
                        <Button onClick={clearFilters} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
            sorter: (a, b) => a.city.localeCompare(b.city), // Sắp xếp A-Z
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm thành phố"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        className="mb-2 block w-48"
                    />
                    <Space>
                        <Button type="primary" onClick={confirm} size="small">
                            Tìm
                        </Button>
                        <Button onClick={clearFilters} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) => record.city.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Quốc gia',
            dataIndex: 'country',
            key: 'country',
            sorter: (a, b) => a.country.localeCompare(b.country), // Sắp xếp A-Z
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm quốc gia"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        className="mb-2 block w-48"
                    />
                    <Space>
                        <Button type="primary" onClick={confirm} size="small">
                            Tìm
                        </Button>
                        <Button onClick={clearFilters} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) => record.country.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Địa chỉ đầy đủ',
            dataIndex: 'fullAddress',
            key: 'fullAddress',
            sorter: (a, b) => a.fullAddress.localeCompare(b.fullAddress), // Sắp xếp A-Z
        },
        {
            title: 'Khu vực',
            dataIndex: 'region',
            key: 'region',
            filters: [
                { text: 'Trong nước', value: 'INSIDE' },
                { text: 'Ngoài nước', value: 'OUTSIDE' },
            ],
            render: (text) => (
                text === 'INSIDE' ? (
                    <p className="text-green-500 font-bold">Trong nước</p>
                ) : (
                    <p className="text-red-500 font-bold">Ngoài nước</p>
                )
            ),
            onFilter: (value, record) => record.region === value,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
            <div className={'p-2 w-fit rounded-lg bg-indigo-50 shadow-md'}>
                <p className={"text-red-500 text-lg font-semibold"}>
                    Bạn cần phải xóa tour có điểm đến này trước khi xóa điểm đến
                </p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex justify-between gap-2 items-center">
                    <h1 className="text-2xl font-bold">Quản lý điểm đến</h1>
                    <Space>
                        <Button
                            type={'text'}
                            icon={<RefreshCwIcon />}
                            onClick={() => {
                                setLoading(true);
                                fetchDestinations();
                            }}
                        >
                            Làm mới
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setAddModalVisible(true)}
                        >
                            Thêm điểm đến
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={destinations}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                {/* Modal Thêm Destination */}
                <Modal
                    title="Thêm điểm đến"
                    open={addModalVisible}
                    onCancel={() => {
                        setAddModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleAdd}
                    >
                        <Form.Item
                            name="name"
                            label="Tên điểm đến"
                            rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
                        >
                            <Input placeholder="Tên điểm đến" />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                        >
                            <Input placeholder="Thành phố" />
                        </Form.Item>
                        <Form.Item
                            name="country"
                            label="Quốc gia"
                            rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
                        >
                            <Input placeholder="Quốc gia" />
                        </Form.Item>
                        <Form.Item
                            name="fullAddress"
                            label="Địa chỉ đầy đủ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input placeholder="Địa chỉ đầy đủ" />
                        </Form.Item>
                        <Form.Item
                            name="region"
                            label="Khu vực"
                            rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}
                        >
                            <Select placeholder="Chọn khu vực">
                                <Option value="INSIDE">Trong nước</Option>
                                <Option value="OUTSIDE">Ngoài nước</Option>
                            </Select>
                        </Form.Item>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setAddModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Modal Sửa Destination */}
                <Modal
                    title="Sửa điểm đến"
                    open={editModalVisible}
                    onCancel={() => {
                        setEditModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                    >
                        <Form.Item
                            name="name"
                            label="Tên điểm đến"
                            rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
                        >
                            <Input placeholder="Tên điểm đến" />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                        >
                            <Input placeholder="Thành phố" />
                        </Form.Item>
                        <Form.Item
                            name="country"
                            label="Quốc gia"
                            rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
                        >
                            <Input placeholder="Quốc gia" />
                        </Form.Item>
                        <Form.Item
                            name="fullAddress"
                            label="Địa chỉ đầy đủ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input placeholder="Địa chỉ đầy đủ" />
                        </Form.Item>
                        <Form.Item
                            name="region"
                            label="Khu vực"
                            rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}
                        >
                            <Select placeholder="Chọn khu vực">
                                <Option value="INSIDE">Trong nước</Option>
                                <Option value="OUTSIDE">Ngoài nước</Option>
                            </Select>
                        </Form.Item>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setEditModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};