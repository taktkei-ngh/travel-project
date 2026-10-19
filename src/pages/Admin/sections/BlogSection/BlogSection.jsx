import { message, Pagination, Tabs } from 'antd';
import { FileTextOutlined, EditOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { BlogLists } from '~/pages/Admin/sections/BlogSection/Sections/BlogLists';
import { BlogForm } from '~/pages/Admin/sections/BlogSection/Sections/BlogForm';
import { BlogDetail } from '~/pages/Admin/sections/BlogSection/Sections/BlogDetail';
import BlogServices from '~/services/BlogServices';

const { TabPane } = Tabs;

export const BlogSection = () => {
    const ITEM_PER_PAGE = 8; // Number of items per page
    const [activeKey, setActiveKey] = useState('1');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await BlogServices.getAllBlogs();
            setBlogs(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            message.error('Không thể tải danh sách bài viết.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, ITEM_PER_PAGE]);
    // Handle tab change
    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    // Handle view blog
    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setActiveKey('3'); // Switch to detail tab
    };

    // Handle edit blog
    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setActiveKey('4'); // Switch to edit tab
    };

    // Handle back to list
    const handleBackToList = async () => {
        await fetchBlogs();
        setActiveKey('1'); // Switch back to list tab
    };

    // Handle create new blog
    const handleCreateBlog = () => {
        setSelectedBlog(null);
        setActiveKey('2'); // Switch to create tab
    };

    const setPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Quản lý Blog</h1>
                <Tabs
                    activeKey={activeKey}
                    onChange={handleTabChange}
                    type="card"
                    className="blog-tabs"
                    animated
                >
                    <Tabs.TabPane
                        key={'1'}
                        tab={
                            <span className="flex items-center">
                                <FileTextOutlined className="mr-2" />
                                Danh sách bài viết
                            </span>
                        }
                    >
                        <BlogLists
                            blogs={blogs}
                            onView={handleViewBlog}
                            onEdit={handleEditBlog}
                            onCreateNew={handleCreateBlog}
                        />
                        <Pagination
                            className="mt-4"
                            align="center"
                            defaultCurrent={currentPage}
                            total={ITEM_PER_PAGE * 10} // Example total items
                            pageSize={ITEM_PER_PAGE}
                            showSizeChanger={false}
                            showTotal={(total) => `Tổng ${total} bài viết`}
                            onChange={(page) => {
                                setPage(page);
                            }} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        key={'2'}
                        tab={
                            <span className="flex items-center">
                                <FormOutlined className="mr-2" />
                                Tạo bài viết mới
                            </span>
                        }
                    >
                        <BlogForm onBack={handleBackToList} />
                    </Tabs.TabPane>

                    {/* Blog Detail Tab - Only visible when a blog is selected */}
                    <Tabs.TabPane
                        key={'3'}
                        tab={
                            <span className="flex items-center">
                                <EyeOutlined className="mr-2" />
                                Xem chi tiết
                            </span>
                        }
                        disabled={!selectedBlog}
                    >
                        {selectedBlog && (
                            <BlogDetail
                                blog={selectedBlog}
                                onBack={handleBackToList}
                                onEdit={() => handleEditBlog(selectedBlog)}
                            />
                        )}
                    </Tabs.TabPane>

                    {/* Blog Edit Tab - Only visible when a blog is selected for editing */}
                    <Tabs.TabPane
                        key={'4'}
                        tab={
                            <span className="flex items-center">
                                <EditOutlined className="mr-2" />
                                Chỉnh sửa
                            </span>
                        }
                        disabled={!selectedBlog}
                    >
                        {selectedBlog && (
                            <BlogForm
                                blog={selectedBlog}
                                isEditing={true}
                                onBack={handleBackToList}
                            />
                        )}
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    );
};
