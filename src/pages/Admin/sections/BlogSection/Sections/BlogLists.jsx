import { Button, Input, Empty, Spin, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { BlogCard } from '~/pages/Admin/sections/BlogSection/Components/BlogCard';
import BlogServices from '~/services/BlogServices';

export const BlogLists = ({ onView, onEdit, onCreateNew, blogs }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { confirm } = Modal;

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Handle view blog
    const handleViewBlog = (blog) => {
        if (onView) {
            onView(blog);
        }
    };

    // Handle edit blog
    const handleEditBlog = (blog) => {
        if (onEdit) {
            onEdit(blog);
        }
    };

    // Handle delete blog with confirmation
    const handleDeleteBlog = (blog) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa bài viết này?',
            icon: <ExclamationCircleOutlined />,
            content: `Bài viết "${blog.title}" sẽ bị xóa vĩnh viễn.`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try{
                    await BlogServices.deleteBlog(blog.id);
                    setLoading(true);
                    setTimeout(() => {
                        message.success(`Đã xóa bài viết "${blog.title}"`);
                        setLoading(false);
                    }, 1000);
                }catch (error) {
                    message.error('Không thể xóa bài viết này.');
                }finally {
                    setLoading(false);
                }
            },
        });
    };

    // Handle create new blog
    const handleCreateBlog = () => {
        if (onCreateNew) {
            onCreateNew();
        }
    };

    return (
        <div className="p-6 container mx-auto">
            {/* Header with search and add button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-1/2">
                    <Input
                        placeholder="Tìm kiếm bài viết..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleCreateBlog}
                >
                    Tạo bài viết mới
                </Button>
            </div>

            {/* Blog grid */}
            <Spin spinning={loading}>
                {filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBlogs.map(blog => (
                            <BlogCard
                                key={blog.id}
                                blog={blog}
                                onView={handleViewBlog}
                                onEdit={handleEditBlog}
                                onDelete={handleDeleteBlog}
                            />
                        ))}
                    </div>
                ) : (
                    <Empty
                        description="Không tìm thấy bài viết nào"
                        className="my-12"
                    />
                )}
            </Spin>
        </div>
    );
};
