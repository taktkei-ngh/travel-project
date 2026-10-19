import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Table,
    Space,
    Typography,
    Tooltip,
    Input,
    message,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import VoucherServices from '~/services/VoucherServices';
import CategoryServices from '~/services/CategoryServices';
import TourServices from '~/services/TourServices';
import config from '~/config';
import { FaCheckCircle } from 'react-icons/fa';
import { AddEditVoucherModal } from '~/pages/Admin/sections/VoucherPage/Components/AddEditVoucherModal';
import { DeleteVoucherModal } from '~/pages/Admin/sections/VoucherPage/Components/DeleteVoucherModal';

const { Title } = Typography;

export const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    // Memoized function to fetch all data
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [voucherResponse, categoryResponse, tourResponse] = await Promise.all([
                VoucherServices.getAllVouchers(),
                CategoryServices.getCategories(),
                TourServices.getAllTour({}),
            ]);
            setVouchers(voucherResponse.data || []);
            setCategories(categoryResponse);
            setTours(tourResponse.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            message.error('Không thể tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on mount
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Memoized function to handle add voucher
    const handleAddVoucher = useCallback(
        async (values) => {
            try {
                setLoading(true);
                await VoucherServices.addVoucher(values);
                message.success('Thêm voucher thành công!');
                await fetchAllData();
                setOpenAddModal(false);
            } catch (error) {
                console.error('Error adding voucher:', error);
                message.error('Có lỗi xảy ra khi thêm voucher!');
            } finally {
                setLoading(false);
            }
        },
        [fetchAllData],
    );

    // Memoized function to handle edit voucher
    const handleEditVoucher = useCallback(
        async (values) => {
            try {
                setLoading(true);
                await VoucherServices.updateVoucher(selectedVoucher.id, values);
                message.success('Cập nhật voucher thành công!');
                await fetchAllData();
                setOpenEditModal(false);
            } catch (error) {
                console.error('Error updating voucher:', error);
                message.error('Có lỗi xảy ra khi cập nhật voucher!');
            } finally {
                setLoading(false);
            }
        },
        [fetchAllData, selectedVoucher?.id],
    );

    // Memoized function to handle delete voucher
    const handleDeleteVoucher = useCallback(
        async () => {
            try {
                setLoading(true);
                await VoucherServices.deleteVoucherForce(selectedVoucher.id);
                message.success('Xóa voucher thành công!');
                await fetchAllData();
                setOpenDeleteModal(false);
            } catch (error) {
                console.error('Error deleting voucher:', error);
                message.error('Có lỗi xảy ra khi xóa voucher!');
            } finally {
                setLoading(false);
            }
        },
        [fetchAllData, selectedVoucher?.id],
    );

    // Memoized function to handle active voucher
    const handleActiveVoucher = useCallback(
        async (id) => {
            try {
                setLoading(true);
                await VoucherServices.updateVoucherStatus(id, 'ACTIVE');
                message.success('Kích hoạt voucher thành công!');
                await fetchAllData();
            } catch (error) {
                console.error('Error activating voucher:', error);
                message.error('Có lỗi xảy ra khi kích hoạt voucher!');
            } finally {
                setLoading(false);
            }
        },
        [fetchAllData],
    );

    // Memoized function to handle inactive voucher
    const handleInactiveVoucher = useCallback(
        async (id) => {
            try {
                setLoading(true);
                await VoucherServices.updateVoucherStatus(id, 'INACTIVE');
                message.success('Tắt voucher thành công!');
                await fetchAllData();
            } catch (error) {
                console.error('Error deactivating voucher:', error);
                message.error('Có lỗi xảy ra khi tắt voucher!');
            } finally {
                setLoading(false);
            }
        },
        [fetchAllData],
    );

    // Memoized function to handle edit
    const handleEdit = useCallback(
        (record) => {
            setSelectedVoucher(record);
            setOpenEditModal(true);
        },
        [],
    );

    const columns = [
        {
            title: 'Mã voucher',
            dataIndex: 'codeVoucher',
            key: 'codeVoucher',
            width: 200,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Tìm mã voucher"
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
            sorter: (a, b) => a.codeVoucher.localeCompare(b.codeVoucher),
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.codeVoucher.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Tên voucher',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Tìm tên voucher"
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
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.title.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Giá trị',
            dataIndex: 'discountValue',
            key: 'discountValue',
            width: 100,
            render: (text) => `${text}%`,
            sorter: (a, b) => a.discountValue - b.discountValue,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 150,
            render: (text) => config.webConfig.convertDateNoTime(text),
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 150,
            render: (text) => config.webConfig.convertDateNoTime(text),
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (text) => (
                <span
                    className={`${
                        text === 'ACTIVE'
                            ? 'text-green-500 font-semibold bg-green-100 p-2 rounded-lg'
                            : text === 'INACTIVE'
                                ? 'text-yellow-500 font-semibold bg-yellow-100 p-2 rounded-lg'
                                : 'text-red-500 font-semibold bg-red-100 p-2 rounded-lg'
                    }`}
                >
                    {text === 'ACTIVE'
                        ? 'Đang hoạt động'
                        : text === 'INACTIVE'
                            ? 'Không hoạt động'
                            : 'Hết hạn'}
                </span>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (text, record) => (
                <Space>
                    <Tooltip title="Xóa voucher">
                        <Button
                            onClick={() => {
                                setSelectedVoucher(record);
                                setOpenDeleteModal(true);
                            }}
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title={record.status === 'ACTIVE' ? 'Tắt voucher' : 'Kích hoạt voucher'}>
                        {record.status === 'ACTIVE' ? (
                            <Button
                                icon={<FaCheckCircle color="red" />}
                                onClick={() => handleInactiveVoucher(record.id)}
                            />
                        ) : (
                            <Button
                                icon={<FaCheckCircle color="green" />}
                                onClick={() => handleActiveVoucher(record.id)}
                            />
                        )}
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa voucher">
                        <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={vouchers}
                pagination={{
                    pageSize: 10,
                    total: vouchers.length,
                }}
                rowKey="id"
                bordered
                className="shadow-sm rounded-lg"
                title={() => (
                    <div className="flex justify-between items-center">
                        <Title level={4} className="text-gray-800">
                            Danh sách voucher
                        </Title>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setOpenAddModal(true)}
                                type="primary"
                                className="rounded-md"
                            >
                                Thêm voucher
                            </Button>
                            <Button
                                onClick={fetchAllData}
                                icon={<ReloadOutlined />}
                                type="default"
                                className="rounded-md"
                            >
                                Làm mới
                            </Button>
                        </div>
                    </div>
                )}
                loading={loading}
            />

            <AddEditVoucherModal
                open={openAddModal}
                onCancel={() => setOpenAddModal(false)}
                onSubmit={handleAddVoucher}
                loading={loading}
                categories={categories}
                tours={tours}
                isEditMode={false}
            />

            <AddEditVoucherModal
                open={openEditModal}
                onCancel={() => setOpenEditModal(false)}
                onSubmit={handleEditVoucher}
                loading={loading}
                categories={categories}
                tours={tours}
                initialValues={selectedVoucher}
                isEditMode={true}
            />

            <DeleteVoucherModal
                open={openDeleteModal}
                onCancel={() => setOpenDeleteModal(false)}
                onConfirm={handleDeleteVoucher}
                voucherTitle={selectedVoucher?.title}
            />
        </>
    );
};