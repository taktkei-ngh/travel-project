import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Switch, Table, Tooltip } from 'antd';
import { RefreshCwIcon } from 'lucide-react';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import React, { useCallback, useEffect, useState } from 'react';
import GuideServices from '~/services/GuideServices';

const { Option } = Select;

export const GuidePage = () => {
    const [loading, setLoading] = useState(false);
    const [guideList, setGuideList] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [addGuideModalVisible, setAddGuideModalVisible] = useState(false);
    const [updateGuideModalVisible, setUpdateGuideModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Fetch danh sách guides
    const fetchGuideList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await GuideServices.getAllGuides();
            setGuideList(response.data || []);
        } catch (error) {
            console.error('Error fetching guide list:', error);
            message.error('Không thể tải danh sách hướng dẫn viên!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGuideList();
    }, [fetchGuideList]);

    // Xử lý thêm guide
    const handleAddGuide = async (values) => {
        setLoading(true);
        try {
            await GuideServices.createGuide(values);
            message.success('Thêm hướng dẫn viên thành công!');
            setAddGuideModalVisible(false);
            form.resetFields();
            await fetchGuideList();
        } catch (error) {
            console.error('Error adding guide:', error);
            message.error('Thêm hướng dẫn viên thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý cập nhật guide
    const handleUpdateGuide = async (values) => {
        setLoading(true);
        try {
            await GuideServices.updateGuide(selectedGuide.id, values);
            message.success('Cập nhật hướng dẫn viên thành công!');
            setUpdateGuideModalVisible(false);
            form.resetFields();
            await fetchGuideList();
        } catch (error) {
            console.error('Error updating guide:', error);
            message.error('Cập nhật hướng dẫn viên thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý xóa guide
    const handleDeleteGuide = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa hướng dẫn viên này?',
            onOk: async () => {
                setLoading(true);
                try {
                    await GuideServices.deleteGuide(id);
                    message.success('Xóa hướng dẫn viên thành công!');
                    await fetchGuideList();
                } catch (error) {
                    console.error('Error deleting guide:', error);
                    message.error('Xóa hướng dẫn viên thất bại!');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    // Xử lý thay đổi trạng thái active
    const handleStatusChange = async (id, checked) => {
        setLoading(true);
        try {
            await GuideServices.updateGuideStatus(id, !!checked);
            message.success('Cập nhật trạng thái thành công!');
            await fetchGuideList();
        } catch (error) {
            console.error('Error updating guide status:', error);
            message.error('Cập nhật trạng thái thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý làm mới danh sách
    const handleRefresh = () => {
        fetchGuideList();
    };

    // Mở modal cập nhật và điền dữ liệu
    const openUpdateModal = (record) => {
        setSelectedGuide(record);
        form.setFieldsValue({
            firstName: record.firstName,
            lastName: record.lastName,
            phone: record.phone,
            email: record.email,
            address: record.address,
            experienceYears: record.experienceYears,
            active: record.active,
        });
        setUpdateGuideModalVisible(true);
    };

    // Cấu hình cột cho bảng
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
                <Tooltip title={'Tìm họ'}>
                    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
                </Tooltip>
            ),
            onFilter: (value, record) => record.lastName.toLowerCase().includes(value.toLowerCase()),
            width: 150,
        },
        {
            title: 'Tên',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm tên"
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
                <Tooltip title={'Tìm tên'}>
                    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
                </Tooltip>
            ),
            onFilter: (value, record) => record.firstName.toLowerCase().includes(value.toLowerCase()),
            width: 150,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm số điện thoại"
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
                <Tooltip title={'Tìm số điện thoại'}>
                    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
                </Tooltip>
            ),
            onFilter: (value, record) => record.phone.toLowerCase().includes(value.toLowerCase()),
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
                <Tooltip title={'Tìm email'}>
                    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
                </Tooltip>
            ),
            onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
            width: 150,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm địa chỉ"
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
                <Tooltip title={'Tìm địa chỉ'}>
                    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
                </Tooltip>
            ),
            onFilter: (value, record) => record.address.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'kinh nghiệm',
            dataIndex: 'experienceYears',
            key: 'experienceYears',
            render: (text) => <span>{text} năm</span>,
            sorter: (a, b) => a.experienceYears - b.experienceYears,
            width: 100,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-2">
                    <Input
                        placeholder="Tìm kiếm kinh nghiệm"
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
                <Tooltip title={'Tìm kinh nghiệm'}>
                    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
                </Tooltip>
            ),
            onFilter: (value, record) => record.experienceYears === Number(value),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active, record) => (
                <Switch
                    checkedChildren="Có sẵn"
                    unCheckedChildren="Bận"
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
                <Space size="middle">
                    <Tooltip title="Cập nhật hướng dẫn viên">
                        <Button
                            icon={<EditOutlined />}
                            type="text"
                            onClick={() => openUpdateModal(record)}
                            className="border border-gray-300"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa hướng dẫn viên">
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            // onClick={() => handleDeleteGuide(record.id)}
                            onClick={() => message.warning('Chức năng đang bảo trì!',2)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <Title level={2} className="text-gray-800 m-0">
                            Danh sách hướng dẫn viên
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
                                onClick={() => setAddGuideModalVisible(true)}
                                className="flex items-center"
                            >
                                Thêm hướng dẫn viên
                            </Button>
                        </Space>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={guideList}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={{
                            pageSize: 6,
                            showSizeChanger: false,
                        }}
                    />

                    {/* Modal Thêm Guide */}
                    <Modal
                        title="Thêm hướng dẫn viên"
                        open={addGuideModalVisible}
                        onCancel={() => {
                            setAddGuideModalVisible(false);
                            form.resetFields();
                        }}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleAddGuide}
                        >
                            <Form.Item
                                name="firstName"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="Tên hướng dẫn viên" />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label="Họ"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input placeholder="Họ hướng dẫn viên" />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải là 10 chữ số!' },
                                ]}
                            >
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Địa chỉ" />
                            </Form.Item>
                            <Space className={'grid grid-cols-2 gap-4'}>
                                <Form.Item
                                    name="experienceYears"
                                    label="Số năm kinh nghiệm"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' },
                                    ]}
                                >
                                    <InputNumber className={'w-auto'} min={0} placeholder="Số năm kinh nghiệm" />
                                </Form.Item>
                                <Form.Item
                                    name="active"
                                    label="Hoạt động"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Có sẵn"
                                        unCheckedChildren="Bận"
                                        defaultChecked={true}
                                    />
                                </Form.Item>
                            </Space>

                            <div className="flex justify-end gap-2">
                                <Button onClick={() => setAddGuideModalVisible(false)}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Thêm
                                </Button>
                            </div>
                        </Form>
                    </Modal>

                    {/* Modal Cập nhật Guide */}
                    <Modal
                        title="Cập nhật hướng dẫn viên"
                        open={updateGuideModalVisible}
                        onCancel={() => {
                            setUpdateGuideModalVisible(false);
                            form.resetFields();
                        }}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleUpdateGuide}
                        >
                            <Form.Item
                                name="firstName"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="Tên hướng dẫn viên" />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label="Họ"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input placeholder="Họ hướng dẫn viên" />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải là 10 chữ số!' },
                                ]}
                            >
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Địa chỉ" />
                            </Form.Item>
                            <Space className={"grid grid-cols-2 gap-4"}>
                                <Form.Item
                                    name="experienceYears"
                                    label="Số năm kinh nghiệm"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' },
                                    ]}
                                >
                                    <InputNumber min={0} placeholder="Số năm kinh nghiệm" />
                                </Form.Item>
                                <Form.Item
                                    name="active"
                                    label="Hoạt động"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Có sẵn"
                                        unCheckedChildren="Bận"
                                        defaultChecked={selectedGuide?.active}
                                    />
                                </Form.Item>
                            </Space>
                            <div className="flex justify-end gap-2">
                                <Button onClick={() => setUpdateGuideModalVisible(false)}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Lưu
                                </Button>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};