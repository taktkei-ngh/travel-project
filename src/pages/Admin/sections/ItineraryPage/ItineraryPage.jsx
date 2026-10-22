
import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Empty,
} from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    FileTextOutlined,
    PlusOutlined,
    ReloadOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import ItineraryServices from '~/services/ItineraryServices';
import TourServices from '~/services/TourServices';

const { TabPane } = Tabs;

const getArrayFromResponse = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response)) return response;
    return [];
};

export const ItineraryPage = () => {
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null);
    const [itineraries, setItineraries] = useState([]);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editItinerary, setEditItinerary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loadingTours, setLoadingTours] = useState(false);
    const [loadingItineraries, setLoadingItineraries] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            ['clean'],
        ],
    };

    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'link',
        'image',
        'align',
    ];

    // Load tour list
    useEffect(() => {
        let isMounted = true;

        const fetchTours = async () => {
            setLoadingTours(true);

            try {
                const response = await TourServices.getAllTour({});
                const tourData = getArrayFromResponse(response);

                if (isMounted) {
                    setTours(tourData);
                }
            } catch (error) {
                console.error('Failed to fetch tours:', error);

                if (isMounted) {
                    message.error('Không thể tải danh sách tour');
                }
            } finally {
                if (isMounted) {
                    setLoadingTours(false);
                }
            }
        };

        fetchTours();

        return () => {
            isMounted = false;
        };
    }, []);

    // Load itinerary for selected tour
    const fetchItineraries = useCallback(async (tourId) => {
        setLoadingItineraries(true);

        try {
            const response = await ItineraryServices.getByTourId(tourId);

            const sortedItineraries = getArrayFromResponse(response).sort(
                (a, b) => Number(a.dayNumber) - Number(b.dayNumber)
            );

            setItineraries(sortedItineraries);
            return true;
        } catch (error) {
            console.error('Failed to fetch itineraries:', error);
            setItineraries([]);
            message.error('Không thể tải lịch trình của tour');
            return false;
        } finally {
            setLoadingItineraries(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTour?.id) {
            fetchItineraries(selectedTour.id);
        } else {
            setItineraries([]);
        }
    }, [selectedTour, fetchItineraries]);

    const handleTourChange = (value) => {
        const tour = tours.find((item) => item.id === value);
        setSelectedTour(tour || null);
    };

    const showModal = () => {
        if (!selectedTour) {
            message.warning('Vui lòng chọn một tour trước!');
            return;
        }

        const duration = Math.max(1, Number(selectedTour.duration) || 1);

        const initialDays = Array.from({ length: duration }, (_, index) => ({
            dayNumber: index + 1,
            title: '',
            notes: '',
        }));

        form.resetFields();
        form.setFieldsValue({ days: initialDays });
        setIsModalOpen(true);
    };

    const closeAddModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleAddItinerary = async (values) => {
        if (!selectedTour) {
            message.warning('Vui lòng chọn một tour trước!');
            return;
        }

        setSaving(true);

        try {
            await ItineraryServices.AddItinerary(selectedTour.id, values);

            setIsModalOpen(false);
            form.resetFields();

            await fetchItineraries(selectedTour.id);
            message.success('Thêm lịch trình thành công');
        } catch (error) {
            console.error('Failed to add itinerary:', error);
            message.error('Thêm lịch trình thất bại');
        } finally {
            setSaving(false);
        }
    };

    const showEditModal = (record) => {
        setEditItinerary(record);

        editForm.resetFields();
        editForm.setFieldsValue({
            dayNumber: record.dayNumber,
            title: record.title,
            notes: record.notes,
        });

        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setEditItinerary(null);
        editForm.resetFields();
    };

    const handleEditItinerary = async (values) => {
        if (!editItinerary) return;

        setSaving(true);

        try {
            const response = await ItineraryServices.updateItinerary(
                editItinerary.id,
                values
            );

            const responseData =
                response?.data?.data ?? response?.data ?? response;

            const updatedRecord = {
                ...editItinerary,
                ...(responseData && typeof responseData === 'object'
                    ? responseData
                    : {}),
                ...values,
            };

            const updatedList = itineraries
                .map((item) =>
                    item.id === editItinerary.id ? updatedRecord : item
                )
                .sort(
                    (a, b) => Number(a.dayNumber) - Number(b.dayNumber)
                );

            setItineraries(updatedList);
            closeEditModal();

            message.success('Cập nhật lịch trình thành công');
        } catch (error) {
            console.error('Failed to edit itinerary:', error);
            message.error('Cập nhật lịch trình thất bại');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAllItineraries = async () => {
        if (!selectedTour) {
            message.warning('Vui lòng chọn một tour trước!');
            return;
        }

        if (!itineraries.length) {
            message.warning('Không có lịch trình nào để xóa');
            return;
        }

        try {
            await ItineraryServices.deleteItinerary(selectedTour.id);
            setItineraries([]);
            message.success('Xóa toàn bộ lịch trình thành công');
        } catch (error) {
            console.error('Failed to delete itineraries:', error);
            message.error('Xóa lịch trình thất bại');
        }
    };

    const handleRefresh = async () => {
        if (!selectedTour) {
            message.warning('Vui lòng chọn tour để làm mới lịch trình');
            return;
        }

        const success = await fetchItineraries(selectedTour.id);

        if (success) {
            message.success('Lịch trình đã được làm mới');
        }
    };

    const columns = [
        {
            title: 'NGÀY',
            dataIndex: 'dayNumber',
            key: 'dayNumber',
            width: 100,
            sorter: (a, b) =>
                Number(a.dayNumber) - Number(b.dayNumber),
            render: (dayNumber) => (
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                        {String(dayNumber).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-gray-500">
                        Ngày
                    </span>
                </div>
            ),
        },
        {
            title: 'TIÊU ĐỀ LỊCH TRÌNH',
            dataIndex: 'title',
            key: 'title',
            width: 240,
            render: (title) => (
                <span className="font-semibold leading-6 text-gray-800">
                    {title || 'Chưa có tiêu đề'}
                </span>
            ),
        },
        {
            title: 'NỘI DUNG',
            dataIndex: 'notes',
            key: 'notes',
            render: (html) => (
                <div
                    className="itinerary-rich-text max-w-full break-words text-sm leading-6 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: html || '' }}
                />
            ),
        },
        {
            title: 'THAO TÁC',
            key: 'action',
            width: 115,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa ngày này">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        aria-label={`Chỉnh sửa lịch trình ngày ${record.dayNumber}`}
                        className="!flex !h-9 !w-9 !items-center !justify-center !rounded-xl !text-emerald-700 hover:!bg-emerald-50"
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7f5] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#10291f] via-[#174333] to-[#245740] p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8"
                >
                    <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                                <CalendarOutlined />
                                ROAM · ADMINISTRATION
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Quản lý lịch trình
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/75 sm:text-base">
                                Quản lý nội dung từng ngày trong hành trình
                                của mỗi tour.
                            </p>
                        </div>

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-3xl text-orange-300 shadow-lg sm:h-20 sm:w-20">
                            <CalendarOutlined />
                        </div>
                    </div>
                </motion.div>

                {/* Tour selector and actions */}
                <Card
                    bordered={false}
                    className="!rounded-2xl !shadow-sm"
                    styles={{ body: { padding: 20 } }}
                >
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-[0.13em] text-gray-500">
                                Chọn tour cần quản lý
                            </label>

                            <Select
                                placeholder="Tìm kiếm và chọn một tour"
                                className="w-full sm:max-w-xl"
                                size="large"
                                loading={loadingTours}
                                showSearch
                                allowClear
                                optionFilterProp="label"
                                options={tours.map((tour) => ({
                                    value: tour.id,
                                    label: tour.title,
                                }))}
                                onChange={handleTourChange}
                                value={selectedTour?.id}
                                notFoundContent="Không tìm thấy tour"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={loadingItineraries}
                                className="!h-10 !rounded-xl !border-gray-200 !px-4"
                            >
                                Làm mới
                            </Button>

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                                disabled={!selectedTour}
                                className="!h-10 !rounded-xl !border-0 !bg-[#174333] !px-4 hover:!bg-[#245740]"
                            >
                                Thêm lịch trình
                            </Button>

                            <Popconfirm
                                title="Xóa toàn bộ lịch trình?"
                                description="Thao tác này sẽ xóa tất cả các ngày của tour đang chọn."
                                okText="Xóa lịch trình"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                                onConfirm={handleDeleteAllItineraries}
                                disabled={
                                    !selectedTour || itineraries.length === 0
                                }
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    disabled={
                                        !selectedTour ||
                                        itineraries.length === 0
                                    }
                                    className="!h-10 !rounded-xl !px-4"
                                >
                                    Xóa toàn bộ
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>
                </Card>

                {/* Selected tour overview */}
                {selectedTour && (
                    <motion.div
                        key={selectedTour.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                    >
                        <Card
                            bordered={false}
                            className="!rounded-2xl !shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                                    <EnvironmentOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Tour đang chọn
                                    </p>
                                    <p className="mt-1 truncate font-bold text-gray-800">
                                        {selectedTour.title}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card
                            bordered={false}
                            className="!rounded-2xl !shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-600">
                                    <ClockCircleOutlined />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Thời lượng tour
                                    </p>
                                    <p className="mt-1 font-bold text-gray-800">
                                        {selectedTour.duration || 0} ngày
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card
                            bordered={false}
                            className="!rounded-2xl !shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                                    <FileTextOutlined />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Số ngày đã tạo
                                    </p>
                                    <p className="mt-1 font-bold text-gray-800">
                                        {itineraries.length} ngày
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Itinerary table */}
                <Card
                    bordered={false}
                    className="!rounded-2xl !shadow-sm"
                    styles={{ body: { padding: 0 } }}
                    title={
                        <div className="flex items-center gap-3 py-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <FileTextOutlined />
                            </div>
                            <div>
                                <h2 className="m-0 text-base font-bold text-gray-800">
                                    Danh sách lịch trình
                                </h2>
                                <p className="mt-1 text-xs font-normal text-gray-400">
                                    {selectedTour
                                        ? `${itineraries.length} ngày trong hành trình`
                                        : 'Chọn tour để xem lịch trình'}
                                </p>
                            </div>
                        </div>
                    }
                >
                    {!selectedTour ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Vui lòng chọn tour để xem lịch trình"
                            className="!py-12"
                        />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={itineraries}
                            rowKey="id"
                            loading={loadingItineraries}
                            pagination={false}
                            scroll={{ x: 720 }}
                            locale={{
                                emptyText: (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Tour này chưa có lịch trình"
                                    />
                                ),
                            }}
                            rowClassName={() =>
                                'transition-colors hover:bg-emerald-50/40'
                            }
                        />
                    )}
                </Card>
            </div>

            {/* Add itinerary modal */}
            <Modal
                title={
                    <div className="pr-6">
                        <p className="text-lg font-bold text-gray-900">
                            Thêm lịch trình
                        </p>
                        <p className="mt-1 text-xs font-normal text-gray-500">
                            Tour: {selectedTour?.title}
                        </p>
                    </div>
                }
                open={isModalOpen}
                onCancel={closeAddModal}
                footer={null}
                width={850}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={handleAddItinerary}
                    layout="vertical"
                    className="mt-5"
                >
                    <Form.List name="days">
                        {(fields) => (
                            <Tabs
                                defaultActiveKey="0"
                                tabPosition="left"
                                className="itinerary-day-tabs"
                            >
                                {fields.map((field, index) => (
                                    <TabPane
                                        tab={
                                            <span className="font-medium">
                                                Ngày {index + 1}
                                            </span>
                                        }
                                        key={String(index)}
                                    >
                                        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                                            <div className="mb-5">
                                                <Tag color="green">
                                                    NGÀY {index + 1}
                                                </Tag>
                                                <h3 className="mt-2 text-lg font-bold text-gray-800">
                                                    Nội dung hành trình
                                                </h3>
                                            </div>

                                            <Form.Item
                                                name={[field.name, 'dayNumber']}
                                                hidden
                                            >
                                                <InputNumber />
                                            </Form.Item>

                                            <Form.Item
                                                label="Tiêu đề"
                                                name={[field.name, 'title']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message:
                                                            'Vui lòng nhập tiêu đề',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder={`Ví dụ: Ngày ${index + 1} - Khởi hành và khám phá`}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Chi tiết lịch trình"
                                                name={[field.name, 'notes']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        validator: async (_, value) => {
                                                            const plainText = String(
                                                                value || ''
                                                            )
                                                                .replace(
                                                                    /<[^>]*>/g,
                                                                    ''
                                                                )
                                                                .replace(
                                                                    /&nbsp;/g,
                                                                    ' '
                                                                )
                                                                .trim();

                                                            if (!plainText) {
                                                                throw new Error(
                                                                    'Vui lòng nhập nội dung lịch trình'
                                                                );
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <ReactQuill
                                                    theme="snow"
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    className="itinerary-quill-editor"
                                                />
                                            </Form.Item>
                                        </div>
                                    </TabPane>
                                ))}

                                <TabPane
                                    tab={
                                        <span className="font-bold text-emerald-700">
                                            Lưu lịch trình
                                        </span>
                                    }
                                    key="save"
                                >
                                    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-6 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                                            <CalendarOutlined />
                                        </div>

                                        <h3 className="mt-4 text-lg font-bold text-gray-800">
                                            Hoàn tất lịch trình?
                                        </h3>

                                        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                            Kiểm tra nội dung của từng ngày
                                            trước khi lưu lịch trình cho tour.
                                        </p>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={saving}
                                            icon={<PlusOutlined />}
                                            size="large"
                                            className="!mt-5 !rounded-xl !border-0 !bg-[#174333] !px-6"
                                        >
                                            Lưu lịch trình
                                        </Button>
                                    </div>
                                </TabPane>
                            </Tabs>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            {/* Edit itinerary modal */}
            <Modal
                title={
                    <div className="pr-6">
                        <p className="text-lg font-bold text-gray-900">
                            Chỉnh sửa lịch trình
                        </p>
                        <p className="mt-1 text-xs font-normal text-gray-500">
                            Ngày {editItinerary?.dayNumber}
                            {selectedTour?.title
                                ? ` · ${selectedTour.title}`
                                : ''}
                        </p>
                    </div>
                }
                open={editModalVisible}
                onCancel={closeEditModal}
                footer={null}
                width={750}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    onFinish={handleEditItinerary}
                    layout="vertical"
                    className="mt-5"
                >
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                        <Form.Item name="dayNumber" hidden>
                            <InputNumber />
                        </Form.Item>

                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Vui lòng nhập tiêu đề',
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Nhập tiêu đề cho ngày này"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Chi tiết lịch trình"
                            name="notes"
                            rules={[
                                {
                                    required: true,
                                    validator: async (_, value) => {
                                        const plainText = String(value || '')
                                            .replace(/<[^>]*>/g, '')
                                            .replace(/&nbsp;/g, ' ')
                                            .trim();

                                        if (!plainText) {
                                            throw new Error(
                                                'Vui lòng nhập nội dung lịch trình'
                                            );
                                        }
                                    },
                                },
                            ]}
                        >
                            <ReactQuill
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                                className="itinerary-quill-editor"
                            />
                        </Form.Item>
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                        <Button
                            size="large"
                            onClick={closeEditModal}
                            className="!rounded-xl"
                        >
                            Hủy
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={saving}
                            icon={<EditOutlined />}
                            size="large"
                            className="!rounded-xl !border-0 !bg-[#174333]"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>

            <style>{`
                .itinerary-rich-text {
                    overflow-wrap: anywhere;
                }

                .itinerary-rich-text p {
                    margin-bottom: 0.5rem;
                }

                .itinerary-rich-text img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                }

                .itinerary-rich-text ul,
                .itinerary-rich-text ol {
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }

                .itinerary-quill-editor .ql-toolbar.ql-snow {
                    border-color: #e5e7eb;
                    border-radius: 0.75rem 0.75rem 0 0;
                    background: #fff;
                }

                .itinerary-quill-editor .ql-container.ql-snow {
                    border-color: #e5e7eb;
                    border-radius: 0 0 0.75rem 0.75rem;
                    background: #fff;
                    min-height: 150px;
                    font-size: 14px;
                }

                .itinerary-quill-editor .ql-editor {
                    min-height: 150px;
                    line-height: 1.7;
                }

                .itinerary-day-tabs .ant-tabs-nav {
                    min-width: 110px;
                }

                @media (max-width: 640px) {
                    .itinerary-day-tabs .ant-tabs-nav {
                        min-width: 80px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ItineraryPage;
