import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tabs, Tooltip } from 'antd';
import ItineraryServices from '~/services/ItineraryServices';
import TourServices from '~/services/TourServices';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill'; // Thêm React-Quill
import 'react-quill/dist/quill.snow.css';
import { RefreshCwIcon } from 'lucide-react'; // Nhập CSS cho giao diện
import config from '~/config';

const { TabPane } = Tabs;

export const ItineraryPage = () => {
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editItinerary, setEditItinerary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    // Cấu hình toolbar cho React-Quill
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image',
        'align',
    ];

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await TourServices.getAllTour({});
                setTours(response.data);
            } catch (error) {
                console.error('Failed to fetch tours:', error);
            }
        };
        fetchTours();
    }, []);

    const fetchItineraries = async (tourId) => {
        try {
            const response = await ItineraryServices.getByTourId(tourId);
            const sortedItineraries = Array.isArray(response.data)
                ? response.data.sort((a, b) => a.dayNumber - b.dayNumber)
                : [];
            setItineraries(sortedItineraries);
        } catch (error) {
            console.error('Failed to fetch itineraries:', error);
            setItineraries([]);
        }
    };

    useEffect(() => {
        if (selectedTour) {
            fetchItineraries(selectedTour.id);
        }
    }, [selectedTour]);

    const handleTourChange = (value) => {
        const tour = tours.find(t => t.id === value);
        setSelectedTour(tour);
    };

    const showModal = () => {
        if (!selectedTour) {
            message.warning('Vui lòng chọn một tour trước!');
            return;
        }
        setIsModalOpen(true);
        const initialDays = Array.from({ length: selectedTour.duration }, (_, i) => ({
            dayNumber: i + 1,
            title: '',
            notes: '',
        }));
        form.setFieldsValue({ days: initialDays });
    };

    const handleAddItinerary = async (values) => {
        try {
            const response = await ItineraryServices.AddItinerary(selectedTour.id, values);
            const sortedItineraries = Array.isArray(response.data)
                ? response.data.sort((a, b) => a.dayNumber - b.dayNumber)
                : [];
            setItineraries(sortedItineraries);
            setIsModalOpen(false);
            form.resetFields();
            message.success('Thêm lịch trình thành công', 2);
        } catch (error) {
            console.error('Failed to add itinerary:', error);
            message.error('Thêm lịch trình thất bại', 2);
        }
    };

    const showEditModal = (record) => {
        setEditItinerary(record);
        setEditModalVisible(true);
        editForm.setFieldsValue({
            dayNumber: record.dayNumber,
            title: record.title,
            notes: record.notes,
        });
    };

    const handleEditItinerary = async (values) => {
        try {
            const updatedItinerary = await ItineraryServices.updateItinerary(editItinerary.id, values);
            const updatedList = itineraries.map(item =>
                item.id === editItinerary.id ? updatedItinerary : item
            );
            const sortedItineraries = updatedList.sort((a, b) => a.dayNumber - b.dayNumber);
            setItineraries(sortedItineraries);
            setEditModalVisible(false);
            editForm.resetFields();
            message.success('Cập nhật lịch trình thành công', 2);
        } catch (error) {
            console.error('Failed to edit itinerary:', error);
            message.error('Cập nhật lịch trình thất bại', 2);
        }
    };

    const handleDeleteAllItineraries = async () => {
        if (!selectedTour) {
            message.warning('Vui lòng chọn một tour trước!');
            return;
        }
        if(!itineraries.length) {
            message.warning('Không có lịch trình nào để xóa');
            return;
        }
        try {
            await ItineraryServices.deleteItinerary(selectedTour.id);
            setItineraries([]);
            message.success('Xóa toàn bộ lịch trình thành công', 2);
        } catch (error) {
            console.error('Failed to delete itineraries:', error);
            message.error('Xóa lịch trình thất bại', 2);
        }
    };

    const columns = [
        { title: 'Ngày', dataIndex: 'dayNumber', key: 'dayNumber', sorter: (a, b) => a.dayNumber - b.dayNumber },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        {
            title: 'Mô tả',
            dataIndex: 'notes',
            key: 'notes',
            // render: text => <div dangerouslySetInnerHTML={{ __html: processImageURLs(text) }} />,
            render: text => <div dangerouslySetInnerHTML={{ __html: text }} />,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa lịch trình">
                    <Button
                        icon={<EditOutlined />}
                        type="text"
                        onClick={() => showEditModal(record)}
                    />
                </Tooltip>
            ),
        },
    ];

    const handleRefresh = () => {
        if (selectedTour) {
            fetchItineraries(selectedTour.id);
        }
        message.success('Làm mới lịch trình thành công', 2);
    }

    return (
        <div style={{ padding: '20px' }}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Lịch trình</h1>
                <Space>
                    <Select
                        placeholder="Chọn tour"
                        style={{ width: 300 }}
                        options={tours}
                        fieldNames={{ label: 'title', value: 'id' }}
                        optionFilterProp="title"
                        showSearch
                        onChange={handleTourChange}
                        value={selectedTour?.id}
                    />
                    <Button
                        type={'text'}
                        icon={<RefreshCwIcon/>}
                        onClick={handleRefresh}
                        className={"border border-gray-300 rounded-md hover:bg-gray-100"}
                        >
                        Làm mới
                    </Button>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                        Thêm lịch trình
                    </Button>
                    <Button danger icon={<DeleteOutlined/>} onClick={handleDeleteAllItineraries}>
                        Xóa toàn bộ lịch trình
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={itineraries}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: 'Chưa có lịch trình nào' }}
            />

            <Modal
                title={`Thêm lịch trình cho tour ${selectedTour?.title}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={700}
            >
                <Form form={form} onFinish={handleAddItinerary} layout="vertical">
                    <Form.List name="days">
                        {(fields) => (
                            <Tabs defaultActiveKey="0" tabPosition="left">
                                {fields.map((field, index) => (
                                    <TabPane tab={`Ngày ${index + 1}`} key={index}>
                                        <Form.Item name={[field.name, 'dayNumber']} hidden>
                                            <InputNumber />
                                        </Form.Item>
                                        <Form.Item
                                            label="Tiêu đề"
                                            name={[field.name, 'title']}
                                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Ghi chú"
                                            name={[field.name, 'notes']}
                                            rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
                                        >
                                            <ReactQuill
                                                className={"overflow-y-scroll overflow-hidden max-h-[200px]"}
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                            />
                                        </Form.Item>
                                    </TabPane>
                                ))}
                                <TabPane tab="Lưu" key="save">
                                    <Button type="primary" htmlType="submit">
                                        Lưu lịch trình
                                    </Button>
                                </TabPane>
                            </Tabs>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            <Modal
                title={`Chỉnh sửa lịch trình - Ngày ${editItinerary?.dayNumber}`}
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
            >
                <Form form={editForm} onFinish={handleEditItinerary} layout="vertical">
                    <Form.Item name="dayNumber" hidden>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Ghi chú"
                        name="notes"
                        rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
                    >
                        <ReactQuill
                            className={"overflow-y-scroll overflow-hidden max-h-[200px]"}
                            theme="snow"
                            modules={quillModules}
                            formats={quillFormats}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};