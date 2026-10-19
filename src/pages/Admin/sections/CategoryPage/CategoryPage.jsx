import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Input, message, Space, Table, Tooltip, Typography, Form, Modal, Select } from 'antd';
import CategoryServices from '~/services/CategoryServices';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { RefreshCwIcon } from 'lucide-react';

const { Text } = Typography;

export const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);
    const [deleteCategoryModalVisible, setDeleteCategoryModalVisible] = useState(false);
    const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);
    const [form] = Form.useForm();


    const fetchCategories = useCallback(() => {
        setLoading(true);
        CategoryServices.getCategories()
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => {
                console.error('Error fetching categories:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchCategories();
    },[fetchCategories]);

    const handleCreateCategory = async (values) => {
        try {
            const body = {
                title: values.title,
                status: "ACTIVE",
                type: null,
            }
            setLoading(true);
            await CategoryServices.createCategories(body);
            setCategories((prev) => [...prev, body]);
            form.resetFields();
            message.success('Tạo danh mục thành công');
            setCreateCategoryModalVisible(false);
            fetchCategories();
        } catch (err) {
            console.error('Error creating category:', err);
        } finally {
            setLoading(false);
        }
    }
    const handleUpdateCategory = async (values) => {
        try {
            const body = {
                title: values.title,
                status: "ACTIVE",
                type: null,
            }
            setLoading(true);
            await CategoryServices.updateCategories(selectedCategory.id, body);
            setCategories((prev) => prev.map((category) => (category.id === selectedCategory.id ? body : category)));
            form.resetFields();
            message.success('Cập nhật danh mục thành công');
            setEditCategoryModalVisible(false);
            fetchCategories();
        } catch (err) {
            console.error('Error updating category:', err);
        } finally {
            setLoading(false);
        }
    }
    const handleDeleteCategory = async () => {
        try {
            setLoading(true);
            await CategoryServices.deleteCategories(selectedCategory.id);
            setCategories((prev) => prev.filter((category) => category.id !== selectedCategory.id));
            message.success('Xóa danh mục thành công');
            setDeleteCategoryModalVisible(false);
            setSelectedCategory(null);
        } catch (err) {
            console.error('Error deleting category:', err);
        } finally {
            setLoading(false);
        }
    }
    const handleRefresh = async () => {
        setLoading(true);
        await fetchCategories();
        setLoading(false);
        message.success('Danh sách danh mục đã được làm mới');
    }



    const columns = [
        {
            title: 'Mã danh mục',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id, // Numeric sorting for ID
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title), // A-Z sorting for title
            filters: [
                { text: 'Bắc', value: 'Bắc' },
                { text: 'Trung', value: 'Trung' },
                { text: 'Nam', value: 'Nam' },
            ],
            onFilter: (value, record) => record.title.includes(value), // Filter by title
            filterSearch: true, // Enable search in filter dropdown
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xóa danh mục">
                        <Button
                            onClick={() => {
                                setSelectedCategory(record);
                                setDeleteCategoryModalVisible(true);
                            }}
                            danger
                            icon={<DeleteOutlined />} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa danh mục">
                        <Button
                            onClick={() => {
                                setSelectedCategory(record);
                                form.setFieldsValue({ status: "ACTIVE", title: record.title, type: null });
                                setEditCategoryModalVisible(true);
                            }}
                            icon={<EditOutlined />} />
                    </Tooltip>
                </Space>
            ),
        }
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg min-h-screen font-sans">
            <div className="mb-6 flex flex-col gap-4">
                <div className={"flex justify-between items-center"}>
                    <h1 className="text-2xl font-bold text-gray-800">Danh sách danh mục</h1>
                    <Space>
                        <Button
                            icon={<RefreshCwIcon/>}
                            type={'text'}
                            className={"border border-gray-300 rounded-md hover:bg-gray-200"}
                            onClick={handleRefresh}
                            >
                            Làm mới
                        </Button>
                        <Button
                            icon={<PlusOutlined/>}
                            type={'primary'}
                            className={"bg-blue-600 hover:bg-blue-700"}
                            onClick={() => {
                                setCreateCategoryModalVisible(true);
                            }}
                            >
                            Thêm danh mục
                        </Button>
                    </Space>
                </div>

                {/* Optimized Card Notification */}
                <Card
                    className="bg-indigo-50 border border-blue-700 shadow-md w-1/2 rounded-lg p-4"
                    bodyStyle={{ padding: 0 }}
                >
                    <Text strong className="text-blue-900">
                        Lưu ý:
                    </Text>
                    <Text className="text-gray-800">
                        {' '}
                        Danh mục ở đây là các miền như Bắc, Nam, Trung! Nếu thêm danh mục, hãy thống nhất trong
                        database.
                    </Text>
                </Card>

                {/* Enhanced Table */}
                <Table
                    columns={columns}
                    dataSource={categories}
                    loading={loading}
                    pagination={{ pageSize: 10 }} // Enable pagination with 10 items per page
                    rowKey="id"
                    className="w-full shadow-sm rounded-lg overflow-hidden"
                    scroll={{ x: 'max-content' }} // Responsive horizontal scroll
                />
            </div>
            {/* Create Category Modal */}
            <Modal
                title="Thêm danh mục"
                open={createCategoryModalVisible}
                onCancel={() => setCreateCategoryModalVisible(false)}
                footer={null}
                width={400}
                className="rounded-lg"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateCategory}
                    className="p-4"
                >
                    <Form.Item
                        label="Tên danh mục"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Edit Category Modal */}
            <Modal
                title="Chỉnh sửa danh mục"
                open={editCategoryModalVisible}
                onCancel={() => setEditCategoryModalVisible(false)}
                footer={null}
                width={400}
                className="rounded-lg"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateCategory}
                    className="p-4"
                >
                    <Form.Item
                        label="Tên danh mục"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Delete Category Modal */}
            <Modal
                title="Xóa danh mục"
                open={deleteCategoryModalVisible}
                onCancel={() => setDeleteCategoryModalVisible(false)}
                footer={null}
                width={400}
                className="rounded-lg"
            >
                <div className="p-4">
                    <Text> Bạn có chắc chắn muốn xóa danh mục này không? </Text>
                    <Space className="mt-4">
                        <Button
                            type="primary"
                            danger
                            onClick={handleDeleteCategory}
                            loading={loading}
                        >
                            Xóa
                        </Button>
                        <Button onClick={() => setDeleteCategoryModalVisible(false)}>
                            Hủy
                        </Button>
                    </Space>
                </div>
            </Modal>
        </div>
    );
};