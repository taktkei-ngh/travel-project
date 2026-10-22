
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Button,
    Card,
    Divider,
    Empty,
    message,
    Spin,
    Tag,
    Typography,
} from 'antd';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    EyeOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import {
    FaFacebookF,
    FaTwitter,
    FaLink,
    FaArrowRight,
    FaFire,
    FaCompass,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import BlogServices from '~/services/BlogServices';
import config from '~/config';

const { Title, Text } = Typography;

const processImageURLs = (htmlString) => {
    if (!htmlString) return '';

    const getImageURL = (imageId) =>
        config.imageConfig.getImage(imageId);

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const images = doc.querySelectorAll('img');

    images.forEach((img) => {
        const src = img.getAttribute('src');

        const regex =
            /config\.imageConfig\.getImage\(['"]?([^'"]+)['"]?\)/;

        const match = src && src.match(regex);

        if (match?.[1]) {
            img.setAttribute('src', getImageURL(match[1]));
        }

        img.setAttribute('loading', 'lazy');
        img.setAttribute('style', 'max-width:100%;height:auto;');
    });

    return doc.body.innerHTML;
};

const resolveThumbnail = (thumbnail) => {
    if (!thumbnail) return '/img/bg.jpg';

    try {
        return config.imageConfig.getImage(thumbnail) || '/img/bg.jpg';
    } catch (error) {
        return '/img/bg.jpg';
    }
};

export const DetailNews = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const slug = location.pathname
        .replace(config.routes.news, '')
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');

    const [blog, setBlog] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        let isMounted = true;

        setLoading(true);

        try {
            const [blogResponse, blogsResponse] = await Promise.all([
                BlogServices.getBySlug(slug),
                BlogServices.getAllBlogs(),
            ]);

            const blogData = blogResponse?.data || {};
            const allBlogs = Array.isArray(blogsResponse?.data)
                ? blogsResponse.data
                : [];

            const publishedBlogs = allBlogs.filter(
                (item) => item.status === 'PUBLISHED'
            );

            if (isMounted) {
                setBlog(blogData);
                setBlogs(publishedBlogs);
            }
        } catch (error) {
            console.error('Error fetching blog data:', error);

            if (isMounted) {
                setBlog({});
                setBlogs([]);
                message.error('Không thể tải bài viết.');
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [slug]);

    useEffect(() => {
        let cancelled = false;

        const loadArticle = async () => {
            setLoading(true);

            try {
                const [blogResponse, blogsResponse] = await Promise.all([
                    BlogServices.getBySlug(slug),
                    BlogServices.getAllBlogs(),
                ]);

                if (cancelled) return;

                const blogData = blogResponse?.data || {};
                const allBlogs = Array.isArray(blogsResponse?.data)
                    ? blogsResponse.data
                    : [];

                setBlog(blogData);
                setBlogs(
                    allBlogs.filter(
                        (item) => item.status === 'PUBLISHED'
                    )
                );
            } catch (error) {
                if (!cancelled) {
                    console.error('Error fetching blog data:', error);
                    setBlog({});
                    setBlogs([]);
                    message.error('Không thể tải bài viết.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (slug) {
            loadArticle();
        } else {
            setLoading(false);
            setBlog({});
        }

        return () => {
            cancelled = true;
        };
    }, [slug]);

    const relatedBlogs = useMemo(() => {
        return blogs
            .filter(
                (item) =>
                    item.category?.id === blog.category?.id &&
                    item.id !== blog.id
            )
            .slice(0, 4);
    }, [blogs, blog.category?.id, blog.id]);

    const topBlogs = useMemo(() => {
        return [...blogs]
            .filter(
                (item) =>
                    (item.viewCount || 0) > 50 ||
                    (item.likeCount || 0) > 50
            )
            .sort(
                (a, b) =>
                    (b.viewCount || 0) - (a.viewCount || 0)
            )
            .slice(0, 3);
    }, [blogs]);

    const popularTags = useMemo(() => {
        return [
            ...new Set(
                blogs
                    .map((item) => item.category?.name)
                    .filter(Boolean)
            ),
        ].slice(0, 6);
    }, [blogs]);

    const articleUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}${config.routes.news}${blog.slug || slug}`
            : '';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(articleUrl);
            message.success('Sao chép liên kết thành công!');
        } catch (error) {
            message.error(
                'Không thể sao chép liên kết. Hãy thử sao chép từ thanh địa chỉ.'
            );
        }
    };

    const revealVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    useEffect(() => {
        if (blog.title) {
            document.title = `${blog.metaTitle || blog.title} | ROAM`;
        } else {
            document.title = 'Tin tức du lịch | ROAM';
        }
    }, [blog.title, blog.metaTitle]);

    return (
        <main className="min-h-screen bg-[#f7f6f0] pb-14">
            {/* Article hero */}
            <section className="relative isolate overflow-hidden bg-[#10251b] text-white">
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center opacity-25"
                    style={{
                        backgroundImage: `url("${resolveThumbnail(blog.thumbnail)}")`,
                    }}
                />

                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1d14]/95 via-[#10251b]/85 to-[#10251b]/60" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={revealVariants}
                    className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-18"
                >
                    <button
                        type="button"
                        onClick={() => navigate(config.routes.news)}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-orange-300/50 hover:bg-white/10 hover:text-orange-200"
                    >
                        <ArrowLeftOutlined />
                        Quay lại tin tức
                    </button>

                    {loading ? (
                        <div className="flex min-h-48 items-center justify-center">
                            <Spin
                                size="large"
                                tip="Đang tải bài viết..."
                                className="text-white"
                            />
                        </div>
                    ) : blog.id ? (
                        <div className="max-w-4xl">
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-orange-200">
                                    <FaCompass />
                                    ROAM JOURNAL
                                </span>

                                {blog.category?.name && (
                                    <Tag className="!m-0 !rounded-full !border-white/20 !bg-white/10 !px-3 !py-1 !text-white">
                                        {blog.category.name}
                                    </Tag>
                                )}
                            </div>

                            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                {blog.metaTitle || blog.title}
                            </h1>

                            {blog.description && (
                                <p className="mt-5 max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                                    {blog.description}
                                </p>
                            )}

                            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/65 sm:text-sm">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarOutlined className="text-orange-300" />
                                    {config.webConfig.convertLocalDateTime(
                                        blog.createdAt
                                    ) || 'N/A'}
                                </span>

                                <span>
                                    Tác giả:{' '}
                                    <strong className="font-semibold text-white">
                                        {blog.user?.username || 'ROAM'}
                                    </strong>
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <EyeOutlined className="text-orange-300" />
                                    {blog.viewCount || 0} lượt xem
                                </span>
                            </div>
                        </div>
                    ) : (
                        <Empty
                            description={
                                <span className="text-white/75">
                                    Không tìm thấy bài viết này.
                                </span>
                            }
                        />
                    )}
                </motion.div>
            </section>

            {/* Article content and sidebar */}
            {!loading && blog.id && (
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
                    {/* Main article */}
                    <motion.article
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.08 }}
                        variants={revealVariants}
                        className="min-w-0"
                    >
                        {blog.thumbnail && (
                            <div className="mb-6 overflow-hidden rounded-3xl border border-white bg-white p-2 shadow-sm">
                                <img
                                    src={resolveThumbnail(blog.thumbnail)}
                                    alt={blog.title || 'Ảnh bài viết ROAM'}
                                    className="max-h-[520px] w-full rounded-2xl object-cover"
                                />
                            </div>
                        )}

                        <Card
                            bordered={false}
                            className="!rounded-3xl !shadow-sm"
                            styles={{
                                body: {
                                    padding: 'clamp(20px, 4vw, 42px)',
                                },
                            }}
                        >
                            {blog.metaDescription && (
                                <p className="mb-8 border-l-4 border-orange-400 bg-orange-50/70 px-5 py-4 text-base font-medium leading-8 text-gray-700">
                                    {blog.metaDescription}
                                </p>
                            )}

                            <div
                                className="roam-article-content prose prose-lg max-w-none break-words text-gray-700"
                                dangerouslySetInnerHTML={{
                                    __html: processImageURLs(blog.content),
                                }}
                            />

                            <Divider className="!my-8" />

                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                        <ShareAltOutlined />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-extrabold text-gray-900">
                                            Chia sẻ bài viết
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Gửi câu chuyện du lịch này đến bạn bè.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        <FaFacebookF />
                                        Facebook
                                    </a>

                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(blog.title || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                                    >
                                        <FaTwitter />
                                        Twitter
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        <FaLink />
                                        Sao chép liên kết
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.article>

                    {/* Sidebar */}
                    <aside className="space-y-5 lg:sticky lg:top-24">
                        {/* Related articles */}
                        <Card
                            bordered={false}
                            className="!rounded-2xl !shadow-sm"
                            title={
                                <div className="flex items-center gap-2 py-1">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                        <FaCompass />
                                    </span>
                                    <span className="font-extrabold text-gray-900">
                                        Bài viết liên quan
                                    </span>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                {relatedBlogs.length === 0 ? (
                                    <Text type="secondary">
                                        Không có bài viết liên quan.
                                    </Text>
                                ) : (
                                    relatedBlogs.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`${config.routes.news}${item.slug}`}
                                            className="group flex gap-3 rounded-xl border border-gray-100 p-2 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50/50"
                                        >
                                            <img
                                                src={resolveThumbnail(item.thumbnail)}
                                                alt={item.title}
                                                loading="lazy"
                                                className="h-20 w-20 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-800 transition-colors group-hover:text-orange-700">
                                                    {item.metaTitle || item.title}
                                                </p>

                                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                                                    {item.metaDescription ||
                                                        item.description}
                                                </p>

                                                <p className="mt-2 text-[10px] text-gray-400">
                                                    {config.webConfig.convertDateNoTime(
                                                        item.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </Card>

                        {/* Popular articles */}
                        <Card
                            bordered={false}
                            className="!rounded-2xl !shadow-sm"
                            title={
                                <div className="flex items-center gap-2 py-1">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                        <FaFire />
                                    </span>
                                    <span className="font-extrabold text-gray-900">
                                        Bài viết nổi bật
                                    </span>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                {topBlogs.length === 0 ? (
                                    <Text type="secondary">
                                        Chưa có bài viết nổi bật.
                                    </Text>
                                ) : (
                                    topBlogs.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`${config.routes.news}${item.slug}`}
                                            className="group flex gap-3"
                                        >
                                            <img
                                                src={resolveThumbnail(item.thumbnail)}
                                                alt={item.title}
                                                loading="lazy"
                                                className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-800 transition-colors group-hover:text-orange-700">
                                                    {item.metaTitle || item.title}
                                                </p>

                                                <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                                                    <EyeOutlined />
                                                    {item.viewCount || 0} lượt xem
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </Card>

                        {/* Categories */}
                        <Card
                            bordered={false}
                            className="!rounded-2xl !shadow-sm"
                            title={
                                <span className="font-extrabold text-gray-900">
                                    Chủ đề khám phá
                                </span>
                            }
                        >
                            <div className="flex flex-wrap gap-2">
                                {popularTags.length === 0 ? (
                                    <Text type="secondary">
                                        Chưa có chủ đề.
                                    </Text>
                                ) : (
                                    popularTags.map((tag) => (
                                        <Tag
                                            key={tag}
                                            color="orange"
                                            className="!rounded-full !px-3 !py-1"
                                            onClick={() =>
                                                message.info(
                                                    `Chủ đề: ${tag}`
                                                )
                                            }
                                        >
                                            {tag}
                                        </Tag>
                                    ))
                                )}
                            </div>
                        </Card>

                        {/* Tour CTA */}
                        <div className="relative isolate overflow-hidden rounded-2xl bg-[#13271d] p-5 text-white shadow-sm">
                            <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full bg-orange-400/15 blur-2xl" />

                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                                ROAM · YOUR NEXT TRIP
                            </p>

                            <h2 className="mt-3 text-lg font-extrabold leading-6">
                                Lên kế hoạch cho hành trình tiếp theo
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/65">
                                Khám phá các tour và tìm chuyến đi phù hợp.
                            </p>

                            <Button
                                type="primary"
                                icon={<FaArrowRight />}
                                onClick={() =>
                                    navigate(config.routes.tourTrongNuoc)
                                }
                                className="!mt-4 !h-10 !rounded-xl !border-0 !bg-orange-400 !font-bold !text-[#17271f] hover:!bg-orange-300"
                            >
                                Khám phá tour
                            </Button>
                        </div>
                    </aside>
                </div>
            )}

            {!loading && !blog.id && (
                <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                    <Empty description="Không tìm thấy bài viết này." />
                    <Button
                        type="primary"
                        onClick={() => navigate(config.routes.news)}
                        className="!mt-4 !rounded-xl !border-0 !bg-[#174333]"
                    >
                        Quay lại tin tức
                    </Button>
                </div>
            )}

            <style>{`
                .roam-article-content {
                    overflow-wrap: anywhere;
                }

                .roam-article-content h1,
                .roam-article-content h2,
                .roam-article-content h3,
                .roam-article-content h4 {
                    color: #17271f;
                    font-weight: 800;
                    line-height: 1.35;
                    margin-top: 1.8em;
                    margin-bottom: 0.7em;
                }

                .roam-article-content p {
                    margin: 0 0 1.25em;
                    line-height: 1.9;
                }

                .roam-article-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 1rem;
                    margin: 1.5rem auto;
                }

                .roam-article-content ul,
                .roam-article-content ol {
                    padding-left: 1.5rem;
                    margin: 1rem 0 1.5rem;
                }

                .roam-article-content li {
                    margin-bottom: 0.5rem;
                    line-height: 1.8;
                }

                .roam-article-content a {
                    color: #b45309;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                .roam-article-content blockquote {
                    border-left: 4px solid #f59e0b;
                    margin: 1.5rem 0;
                    padding: 0.75rem 1.25rem;
                    background: #fff7ed;
                    border-radius: 0 0.75rem 0.75rem 0;
                }

                .roam-article-content iframe,
                .roam-article-content video {
                    max-width: 100%;
                }
            `}</style>
        </main>
    );
};

export default DetailNews;
