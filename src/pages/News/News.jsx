
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Button,
    Divider,
    Empty,
    Input,
    Pagination,
    Spin,
    Tag,
    notification,
} from 'antd';
import {
    SearchOutlined,
    MailOutlined,
    ArrowRightOutlined,
    FireOutlined,
    ClockCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaNewspaper,
} from 'react-icons/fa';

import { NewsCard } from '~/pages/News/components/NewsCard';
import { TopNews } from '~/pages/News/components/TopNews';
import { TopNewsSection } from '~/pages/News/components/TopNewsSection';
import BlogServices from '~/services/BlogServices';
import config from '~/config';
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
    const [sortType, setSortType] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSubscribing, setIsSubscribing] = useState(false);

    const ITEMS_PER_PAGE = 6;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.45,
                when: 'beforeChildren',
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 18, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    // Load published blog posts and categories
    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const [blogsResponse, categoriesResponse] = await Promise.all([
                BlogServices.getAllBlogs({
                    category: selectedCategory,
                }),
                BlogServices.getBlogCategories(),
            ]);

            const blogData = Array.isArray(blogsResponse?.data)
                ? blogsResponse.data
                : [];

            const categoryData = Array.isArray(categoriesResponse?.data)
                ? categoriesResponse.data
                : [];

            setBlogs(
                blogData.filter((blog) => blog.status === 'PUBLISHED')
            );
            setCategories(categoryData);
        } catch (error) {
            console.error('Failed to fetch news data:', error);

            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: 'Không thể tải bài viết hoặc danh mục.',
                placement: 'bottomRight',
            });

            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        document.title = 'Tin tức du lịch | ROAM';
    }, []);

    // Search title, description, category, author and publication date
    const handleSearch = useCallback(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) {
            setIsSearching(false);
            setSearchResults([]);
            setCurrentPage(1);
            return;
        }

        const results = blogs.filter((blog) => {
            const createdAt = blog.createdAt
                ? config.webConfig.convertDateNoTime(blog.createdAt)
                : '';

            return (
                (blog.title || '').toLowerCase().includes(keyword) ||
                (blog.metaDescription || '').toLowerCase().includes(keyword) ||
                (blog.metaTitle || '').toLowerCase().includes(keyword) ||
                (blog.category?.name || '').toLowerCase().includes(keyword) ||
                (blog.user?.username || '').toLowerCase().includes(keyword) ||
                String(createdAt).toLowerCase().includes(keyword)
            );
        });

        setSearchResults(results);
        setIsSearching(true);
        setCurrentPage(1);
    }, [searchTerm, blogs]);

    // Newsletter subscription
    const handleSubscribe = useCallback(async () => {
        const normalizedEmail = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            notification.error({
                message: 'Email chưa hợp lệ',
                description: 'Vui lòng nhập địa chỉ email hợp lệ.',
                placement: 'bottomRight',
            });
            return;
        }

        setIsSubscribing(true);

        try {
            await BlogServices.subscribeBlog(
                normalizedEmail,
                currentUser?.username
            );

            notification.success({
                message: 'Đăng ký thành công',
                description: 'Cảm ơn bạn đã đăng ký nhận bản tin ROAM!',
                placement: 'bottomRight',
            });

            setEmail('');
        } catch (error) {
            console.error('Newsletter subscription failed:', error);

            notification.error({
                message: 'Chưa thể đăng ký',
                description: 'Vui lòng thử lại sau.',
                placement: 'bottomRight',
            });
        } finally {
            setIsSubscribing(false);
        }
    }, [email, currentUser?.username]);

    // Select the source list for the current view
    const sourceBlogs = useMemo(() => {
        if (isSearching) {
            return searchResults;
        }

        if (selectedCategory) {
            return blogs.filter(
                (blog) => blog.category?.name === selectedCategory
            );
        }

        return blogs;
    }, [isSearching, searchResults, selectedCategory, blogs]);

    // Sort without mutating the original state
    const sortedBlogs = useMemo(() => {
        return [...sourceBlogs].sort((a, b) => {
            if (sortType === 'popular') {
                return (b.viewCount || 0) - (a.viewCount || 0);
            }

            return (
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            );
        });
    }, [sourceBlogs, sortType]);

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        return sortedBlogs.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [sortedBlogs, currentPage]);

    const topBlogs = useMemo(() => {
        return blogs
            .filter(
                (blog) =>
                    (blog.viewCount || 0) >= 50 ||
                    (blog.likeCount || 0) >= 50
            )
            .sort(
                (a, b) =>
                    (b.viewCount || 0) - (a.viewCount || 0)
            )
            .slice(0, 4);
    }, [blogs]);

    const categorySummaries = useMemo(() => {
        const categoryCounts = blogs.reduce((accumulator, blog) => {
            const categoryName = blog.category?.name || 'Khác';

            accumulator[categoryName] =
                (accumulator[categoryName] || 0) + 1;

            return accumulator;
        }, {});

        return Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count,
        }));
    }, [blogs]);

    const availableCategories = useMemo(() => {
        if (categories.length > 0) {
            return categories;
        }

        return categorySummaries;
    }, [categories, categorySummaries]);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 420,
            behavior: 'smooth',
        });
    };

    const handleCategoryClick = (categoryName) => {
        const nextCategory =
            categoryName === selectedCategory ? null : categoryName;

        setSelectedCategory(nextCategory);
        setCurrentPage(1);
        setIsSearching(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const clearSearch = () => {
        setIsSearching(false);
        setSearchTerm('');
        setSearchResults([]);
        setCurrentPage(1);
    };

    const categoryName = (category) =>
        typeof category === 'string'
            ? category
            : category?.name || 'Khác';

    const socialLinks = [
        {
            label: 'Facebook',
            href: 'https://www.facebook.com/profile.php?id=61592129280513',
            Icon: FaFacebook,
        },
        {
            label: 'Instagram',
            href: 'https://www.instagram.com/takt.keii/',
            Icon: FaInstagram,
        },
        {
            label: 'Twitter',
            href: '#',
            Icon: FaTwitter,
        },
        {
            label: 'YouTube',
            href: '#',
            Icon: FaYoutube,
        },
    ];

    return (
        <main className="min-h-screen bg-[#f7f6f0] pb-14">
            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-[#10251b] py-16 text-white sm:py-20 lg:py-24">
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: 'url("/img/bg.jpg")' }}
                />

                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1d14]/95 via-[#10251b]/80 to-[#10251b]/45" />

                <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-300 sm:text-sm">
                            <FaNewspaper />
                            ROAM · TRAVEL JOURNAL
                        </p>

                        <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl">
                            Khám phá thế giới
                            <span className="mt-1 block text-orange-300">
                                qua từng câu chuyện.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                            Tin tức du lịch, kinh nghiệm hữu ích và cảm hứng
                            cho hành trình tiếp theo của bạn.
                        </p>

                        <div className="mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.08] p-2 backdrop-blur-md sm:flex-row">
                            <Input
                                placeholder="Tìm theo tiêu đề, mô tả, danh mục hoặc tác giả..."
                                size="large"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                onPressEnter={handleSearch}
                                prefix={
                                    <SearchOutlined className="text-gray-400" />
                                }
                                allowClear
                                className="min-w-0 flex-1 !rounded-xl !border-0 !bg-white"
                            />

                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                className="!h-10 !rounded-xl !border-0 !bg-orange-400 !font-bold !text-[#17271f] hover:!bg-orange-300 sm:!h-11"
                            >
                                Tìm bài viết
                            </Button>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/60 sm:text-sm">
                            <span className="inline-flex items-center gap-2">
                                <FaNewspaper className="text-orange-300" />
                                {blogs.length} bài viết
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <ClockCircleOutlined className="text-orange-300" />
                                Cập nhật nội dung du lịch
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section heading */}
            <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                            ROAM / EDITOR'S PICKS
                        </p>

                        <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                            {isSearching
                                ? 'Kết quả tìm kiếm'
                                : selectedCategory || 'Tất cả bài viết'}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {sourceBlogs.length} bài viết phù hợp
                        </p>
                    </div>

                    {isSearching && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag color="orange">
                                {searchResults.length} kết quả
                            </Tag>
                            <Button
                                type="link"
                                onClick={clearSearch}
                                className="!text-orange-700"
                            >
                                Xóa tìm kiếm
                            </Button>
                        </div>
                    )}
                </motion.div>
            </header>

            {/* Category filters */}
            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleCategoryClick(null)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                            !selectedCategory
                                ? 'border-[#173d2c] bg-[#173d2c] text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-700'
                        }`}
                    >
                        Tất cả
                    </button>

                    {availableCategories.map((category, index) => {
                        const name = categoryName(category);

                        return (
                            <button
                                type="button"
                                key={category.id ?? `${name}-${index}`}
                                onClick={() => handleCategoryClick(name)}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                                    selectedCategory === name
                                        ? 'border-[#173d2c] bg-[#173d2c] text-white shadow-sm'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-700'
                                }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Highlighted news */}
            {!isSearching && !selectedCategory && (
                <section className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-10">
                    <TopNewsSection
                        blogs={blogs}
                        loading={loading}
                        isSearching={isSearching}
                    />
                </section>
            )}

            {/* Newsletter */}
            <section className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-[#153c2a] via-[#1b4a34] to-[#285941] p-6 shadow-xl shadow-emerald-950/10 sm:p-8 lg:p-10"
                >
                    <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-orange-400/15 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                                <MailOutlined />
                                ROAM JOURNAL
                            </span>

                            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                                Một chút cảm hứng cho chuyến đi tiếp theo?
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
                                Nhận tin tức, kinh nghiệm và gợi ý du lịch
                                mới nhất qua email của bạn.
                            </p>
                        </div>

                        <div className="w-full max-w-xl lg:max-w-md">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    type="email"
                                    placeholder="Email của bạn"
                                    size="large"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    onPressEnter={handleSubscribe}
                                    prefix={
                                        <MailOutlined className="text-gray-400" />
                                    }
                                    className="min-w-0 flex-1 !rounded-xl"
                                />

                                <Button
                                    type="primary"
                                    size="large"
                                    loading={isSubscribing}
                                    onClick={handleSubscribe}
                                    className="!h-10 !rounded-xl !border-0 !bg-orange-400 !font-bold !text-[#17271f] hover:!bg-orange-300 sm:!h-11"
                                >
                                    Đăng ký nhận tin
                                </Button>
                            </div>

                            <p className="mt-2 text-xs text-white/45">
                                Bạn có thể đăng ký bằng email đang sử dụng.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Articles and sidebar */}
            <main
                id="news-list"
                className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10"
            >
                {/* Articles */}
                <section className="min-w-0">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                {isSearching ? (
                                    <SearchOutlined />
                                ) : (
                                    <FireOutlined />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-gray-900">
                                    {isSearching
                                        ? 'Kết quả tìm kiếm'
                                        : 'Bài viết dành cho bạn'}
                                </h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Sắp xếp nội dung theo nhu cầu của bạn.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-xs text-gray-500">
                                Sắp xếp:
                            </span>

                            <Button
                                size="middle"
                                type={sortType === 'newest' ? 'primary' : 'default'}
                                onClick={() => setSortType('newest')}
                                className={
                                    sortType === 'newest'
                                        ? '!rounded-full !border-0 !bg-[#173d2c]'
                                        : '!rounded-full'
                                }
                            >
                                Mới nhất
                            </Button>

                            <Button
                                size="middle"
                                type={sortType === 'popular' ? 'primary' : 'default'}
                                onClick={() => setSortType('popular')}
                                className={
                                    sortType === 'popular'
                                        ? '!rounded-full !border-0 !bg-[#173d2c]'
                                        : '!rounded-full'
                                }
                            >
                                Phổ biến
                            </Button>
                        </div>
                    </div>

                    <Divider className="!my-5 !border-gray-200" />

                    {loading ? (
                        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white">
                            <Spin size="large" tip="Đang tải bài viết..." />
                        </div>
                    ) : currentItems.length > 0 ? (
                        <motion.div
                            key={`${currentPage}-${sortType}-${selectedCategory || 'all'}-${isSearching}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-5"
                        >
                            {currentItems.map((article) => (
                                <motion.div
                                    key={article.id}
                                    variants={itemVariants}
                                >
                                    <NewsCard blog={article} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
                            <Empty
                                description={
                                    isSearching
                                        ? 'Không tìm thấy bài viết phù hợp'
                                        : 'Chưa có bài viết trong danh mục này'
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />

                            {isSearching && (
                                <Button
                                    onClick={clearSearch}
                                    className="!mt-3 !rounded-xl"
                                >
                                    Xem tất cả bài viết
                                </Button>
                            )}
                        </div>
                    )}

                    {!loading && sourceBlogs.length > ITEMS_PER_PAGE && (
                        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-white bg-white p-5">
                            <p className="text-xs text-gray-500">
                                Trang {currentPage} /{' '}
                                {Math.ceil(sourceBlogs.length / ITEMS_PER_PAGE)}
                            </p>

                            <Pagination
                                current={currentPage}
                                total={sourceBlogs.length}
                                pageSize={ITEMS_PER_PAGE}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                responsive
                                showLessItems
                            />
                        </div>
                    )}
                </section>

                {/* Sidebar */}
                <aside className="space-y-5">
                    <section className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-2">
                            <h2 className="text-base font-extrabold text-gray-900">
                                Bài viết phổ biến
                            </h2>
                            <EyeOutlined className="text-orange-500" />
                        </div>

                        <Divider className="!my-3" />

                        <div className="space-y-4">
                            {topBlogs.length > 0 ? (
                                topBlogs.slice(0, 3).map((article) => (
                                    <TopNews
                                        key={article.id}
                                        news={article}
                                    />
                                ))
                            ) : (
                                <p className="text-sm leading-6 text-gray-500">
                                    Chưa có bài viết nổi bật.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                        <h2 className="text-base font-extrabold text-gray-900">
                            Danh mục
                        </h2>

                        <Divider className="!my-3" />

                        <div className="space-y-1">
                            {categorySummaries.length > 0 ? (
                                categorySummaries.map((category) => (
                                    <button
                                        type="button"
                                        key={category.name}
                                        onClick={() =>
                                            handleCategoryClick(category.name)
                                        }
                                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                                            selectedCategory === category.name
                                                ? 'bg-emerald-50 font-semibold text-emerald-800'
                                                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
                                        }`}
                                    >
                                        <span>{category.name}</span>
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                            {category.count}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Chưa có danh mục.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                        <h2 className="text-base font-extrabold text-gray-900">
                            Kết nối với ROAM
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Theo dõi các kênh của chúng tôi để cập nhật thêm
                            cảm hứng du lịch.
                        </p>

                        <Divider className="!my-4" />

                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target={href === '#' ? undefined : '_blank'}
                                    rel={
                                        href === '#'
                                            ? undefined
                                            : 'noopener noreferrer'
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all duration-300 hover:-translate-y-1 hover:bg-[#173d2c] hover:text-white"
                                >
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl bg-[#13271d] p-5 text-white">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                            ROAM · EXPLORE MORE
                        </p>
                        <h2 className="mt-3 text-lg font-extrabold">
                            Sẵn sàng cho chuyến đi tiếp theo?
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                            Khám phá tour và lên kế hoạch cho hành trình mới.
                        </p>
                        <Button
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={() =>
                                (window.location.href =
                                    config.routes.tourTrongNuoc)
                            }
                            className="!mt-4 !h-10 !rounded-xl !border-0 !bg-orange-400 !font-bold !text-[#17271f] hover:!bg-orange-300"
                        >
                            Khám phá tour
                        </Button>
                    </section>
                </aside>
            </main>
        </main>
    );
};

export default News;
