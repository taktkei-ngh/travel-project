import React, { useCallback, useEffect, useState } from 'react';
import { NewsCard } from '~/pages/News/components/NewsCard';
import { motion } from 'framer-motion';
import { Divider, Pagination, Spin, Input, Button, Tag, Empty, notification } from 'antd';
import { SearchOutlined, MailOutlined, ArrowRightOutlined, FireOutlined } from '@ant-design/icons';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEye } from 'react-icons/fa';
import BlogServices from '~/services/BlogServices';
import config from '~/config';
import { TopNews } from '~/pages/News/components/TopNews';
import { TopNewsSection } from '~/pages/News/components/TopNewsSection';
import { useAuth } from '~/config/AuthContext';

export const News = () => {
    const { currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [email, setEmail] = useState('');
    const [sortType, setSortType] = useState('newest'); // 'newest' or 'popular'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const ITEMS_PER_PAGE = 6;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                when: 'beforeChildren',
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [blogsResponse, categoriesResponse] = await Promise.all([
                BlogServices.getAllBlogs({ category: selectedCategory }),
                BlogServices.getBlogCategories(),
            ]);
            const published = blogsResponse.data.filter((blog) => blog.status === 'PUBLISHED');
            setBlogs(published);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: 'Không thể tải bài viết hoặc danh mục.',
            });
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle search
    const handleSearch = useCallback(() => {
        if (!searchTerm.trim()) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const results = blogs.filter((blog) => {
            const createdAt = config.webConfig.convertDateNoTime(blog.createdAt);
            return (
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (blog.metaDescription && blog.metaDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (blog.metaTitle && blog.metaTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (blog.category?.name && blog.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (blog.user?.username && blog.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                createdAt.includes(searchTerm)
            );
        });
        setSearchResults(results);
        setCurrentPage(1);
    }, [searchTerm, blogs]);

    // Handle newsletter subscription
    const handleSubscribe = useCallback(async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            notification.error({
                message: 'Lỗi đăng ký',
                description: 'Vui lòng nhập email hợp lệ.',
                placement: 'bottomRight',
            });
            return;
        }
        await BlogServices.subscribeBlog(email, currentUser?.username);
        notification.success({
            message: 'Đăng ký thành công',
            description: 'Cảm ơn bạn đã đăng ký nhận bản tin!',
            placement: 'bottomRight',
        });
        setEmail('');
    }, [email, currentUser?.username]);

    // Filter blogs
    const getCurrentItems = useCallback(() => {
        const sortBlogs = (arr) => {
            if (sortType === 'popular') {
                return [...arr].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
            }
            // Default: newest
            return [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        };

        if (isSearching) {
            const sorted = sortBlogs(searchResults);
            const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
            const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
            return sorted.slice(indexOfFirstItem, indexOfLastItem);
        }

        const filteredBlogs = selectedCategory
            ? blogs.filter((blog) => blog.category?.name === selectedCategory)
            : blogs;

        const sorted = sortBlogs(filteredBlogs);
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        return sorted.slice(indexOfFirstItem, indexOfLastItem);
    }, [isSearching, searchResults, blogs, currentPage, selectedCategory, sortType]);

    // Get top news
    const getTopNews = useCallback(() => {
        return blogs
            .filter((blog) => blog.viewCount >= 50 || blog.likeCount >= 50)
            .slice(0, 4);
    }, [blogs]);

    // Get categories
    const getCategories = useCallback(() => {
        const categoryCounts = blogs.reduce((acc, blog) => {
            const categoryName = blog.category?.name || 'Khác';
            acc[categoryName] = (acc[categoryName] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
    }, [blogs]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
        setCurrentPage(1);
        setIsSearching(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    useEffect(() => {
        document.title = 'Tin Tức Du Lịch - Blog';
        setCurrentPage(1);
    }, [selectedCategory]);

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            {/* Hero Banner */}
            <div
                className="bg-cover bg-center text-white py-12"
                style={{ backgroundImage: 'url("/img/bg.jpg")' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-orange-800">Khám Phá Thế Giới</h1>
                        <p className="text-sm md:text-base mb-6 max-w-lg mx-auto text-orange-700">
                            Tin tức du lịch mới nhất và kinh nghiệm cho hành trình của bạn
                        </p>
                        <div className="max-w-md mx-auto flex">
                            <Input
                                placeholder="Tìm kiếm theo tiêu đề, mô tả, danh mục, tác giả, ngày..."
                                size="large"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onPressEnter={handleSearch}
                                prefix={<SearchOutlined />}
                                className="rounded-l-full"
                            />
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleSearch}
                                className="rounded-r-full !bg-orange-700 hover:!bg-orange-800 !border-none"
                            >
                                Tìm
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Header */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-orange-600 font-medium text-sm uppercase tracking-wide">
                            Du lịch /
                        </span>
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            {isSearching ? 'Kết quả tìm kiếm' : selectedCategory || 'Tất cả bài viết'}
                        </h2>
                    </div>
                    {isSearching && (
                        <div className="flex items-center space-x-2">
                            <Tag color="orange">Kết quả: {searchResults.length}</Tag>
                            <Button
                                type="link"
                                onClick={() => {
                                    setIsSearching(false);
                                    setSearchTerm('');
                                    setSearchResults([]);
                                }}
                            >
                                Xóa tìm kiếm
                            </Button>
                        </div>
                    )}
                </motion.div>
            </header>

            {/* Category Filter */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
                            !selectedCategory ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                        }`}
                        onClick={() => handleCategoryClick(null)}
                    >
                        Tất cả
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
                                selectedCategory === category.name
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                            }`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Top News Section */}
            {!isSearching && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <TopNewsSection blogs={blogs} loading={loading} isSearching={isSearching} />
                </section>
            )}

            {/* Newsletter Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div
                    className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg shadow-md p-5 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">Nhận Bản Tin</h3>
                        <p className="text-sm text-orange-100 mb-3">
                            Tin tức, ưu đãi và mẹo du lịch mới nhất!
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Email của bạn"
                                size="middle"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                prefix={<MailOutlined />}
                                className="rounded-full"
                            />
                            <Button
                                type="primary"
                                size="middle"
                                onClick={handleSubscribe}
                                className="rounded-full !bg-white !text-orange-600 hover:!bg-orange-50"
                            >
                                Đăng ký
                            </Button>
                        </div>
                    </div>
                    <div className="w-28 h-28 md:w-32 md:h-32 hidden md:block">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80"
                            alt="Travel Newsletter"
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80';
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
                {/* Main Content Section */}
                <section className="lg:w-2/3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-3"
                    >
                        <div className="flex items-center">
                            {isSearching ? (
                                <SearchOutlined className="text-orange-600 text-base mr-2" />
                            ) : (
                                <FireOutlined className="text-orange-500 text-base mr-2" />
                            )}
                            <h2 className="text-lg font-semibold text-gray-800 uppercase">
                                {isSearching ? 'Kết Quả Tìm Kiếm' : selectedCategory || 'Tất Cả Bài Viết'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Sắp xếp:</span>
                            <Button
                                size="small"
                                type={sortType === 'newest' ? 'primary' : 'default'}
                                className="rounded-full"
                                onClick={() => setSortType('newest')}
                            >
                                Mới nhất
                            </Button>
                            <Button
                                size="small"
                                type={sortType === 'popular' ? 'primary' : 'default'}
                                className="rounded-full"
                                onClick={() => setSortType('popular')}
                            >
                                Phổ biến
                            </Button>
                        </div>
                    </motion.div>
                    <Divider className="my-2 border-gray-200" />
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-5"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <Spin size="large" tip="Đang tải..." />
                            </div>
                        ) : getCurrentItems().length > 0 ? (
                            getCurrentItems().map((article) => (
                                <motion.div key={article.id} variants={itemVariants}>
                                    <NewsCard blog={article} />
                                </motion.div>
                            ))
                        ) : (
                            <Empty
                                description={isSearching ? 'Không tìm thấy kết quả' : 'Không có bài viết'}
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                className="py-8"
                            />
                        )}
                    </motion.div>
                    {(isSearching ? searchResults.length : blogs.length) > ITEMS_PER_PAGE && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mt-6 flex justify-center"
                        >
                            <Pagination
                                current={currentPage}
                                total={isSearching ? searchResults.length : blogs.length}
                                pageSize={ITEMS_PER_PAGE}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                className="[&>li>.ant-pagination-item-active]:bg-orange-600 [&>li>.ant-pagination-item-active]:border-orange-600 [&>li>.ant-pagination-item-active>a]:text-white [&>li>.ant-pagination-item:hover]:border-orange-600 [&>li>.ant-pagination-item:hover>a]:text-orange-600"
                            />
                        </motion.div>
                    )}
                </section>

                {/* Sidebar */}
                <section className="lg:w-1/3">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Popular Posts */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-gray-800">Bài viết phổ biến</h3>
                                <Button type="text" size="small" className="text-orange-600">Xem thêm</Button>
                            </div>
                            <Divider className="my-2 border-gray-200" />
                            <div className="space-y-3">
                                {getTopNews().slice(0, 3).map((article) => (
                                    <TopNews
                                        key={article.id}
                                        news={article}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-5">
                            <h3 className="text-base font-semibold text-gray-800 mb-2">Danh mục</h3>
                            <Divider className="my-2 border-gray-200" />
                            <div className="space-y-2">
                                {getCategories().map((category) => (
                                    <button
                                        key={category.name}
                                        className={`w-full flex justify-between items-center py-1.5 px-2 rounded text-sm transition-all duration-200 ${
                                            selectedCategory === category.name
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                        onClick={() => handleCategoryClick(category.name)}
                                    >
                                        <span>{category.name}</span>
                                        <span
                                            className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="text-base font-semibold text-gray-800 mb-2">Kết nối</h3>
                            <Divider className="my-2 border-gray-200" />
                            <div className="flex gap-3 justify-center">
                                <a href="#"
                                   className="p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors duration-200">
                                    <FaFacebook className="text-orange-600 text-lg" />
                                </a>
                                <a href="#"
                                   className="p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors duration-200">
                                    <FaTwitter className="text-orange-400 text-lg" />
                                </a>
                                <a href="#"
                                   className="p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors duration-200">
                                    <FaInstagram className="text-pink-600 text-lg" />
                                </a>
                                <a href="#"
                                   className="p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors duration-200">
                                    <FaYoutube className="text-red-600 text-lg" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
};