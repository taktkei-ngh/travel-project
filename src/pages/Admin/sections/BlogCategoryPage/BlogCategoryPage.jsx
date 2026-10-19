import { Button, Space, Table, Tooltip, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import BlogServices from '~/services/BlogServices';
import { CreateModal } from '~/pages/Admin/sections/BlogCategoryPage/Components/CreateModal';
import { EditModal } from '~/pages/Admin/sections/BlogCategoryPage/Components/EditModal';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const BlogCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await BlogServices.getBlogCategories();
            setCategories(response.data || []);
        } catch (error) {
            message.error('Lỗi khi tải danh mục!');
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            setLoading(true);
            const response = await BlogServices.createCategory(values);
            if (response) {
                message.success('Tạo danh mục thành công!');
                setIsCreating(false);
                await fetchCategories();
            }
        } catch (error) {
            message.error('Tạo danh mục thất bại!');
            console.error('Error creating category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (categoryId, values) => {
        try {
            setLoading(true);
            const response = await BlogServices.updateCategory(categoryId, values);
            if (response) {
                message.success('Cập nhật danh mục thành công!');
                setIsEditing(false);
                await fetchCategories();
            }
        } catch (error) {
            message.error('Cập nhật danh mục thất bại!');
            console.error('Error updating category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (categoryId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc muốn xóa danh mục này?',
            onOk: async () => {
                try {
                    setLoading(true);
                    await BlogServices.deleteCategory(categoryId);
                    message.success('Xóa danh mục thành công!');
                    await fetchCategories();
                } catch (error) {
                    message.error('Xóa danh mục thất bại!');
                    console.error('Error deleting category:', error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedCategory(record);
                                setIsEditing(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách danh mục bài viết</h2>
                <Button type="primary" onClick={() => setIsCreating(true)}>
                    Tạo danh mục mới
                </Button>
            </div>
            <Table
                dataSource={categories}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            <CreateModal
                visible={isCreating}
                onCreate={handleCreate}
                onCancel={() => setIsCreating(false)}
            />
            <EditModal
                visible={isEditing}
                category={selectedCategory}
                onUpdate={handleUpdate}
                onCancel={() => setIsEditing(false)}
            />
        </div>
    );
};