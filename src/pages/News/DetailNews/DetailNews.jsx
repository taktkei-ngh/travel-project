import { useCallback, useEffect, useState } from 'react';
import { Divider, message, Spin, Typography, Card, Tag, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShareAltOutlined, EyeOutlined } from '@ant-design/icons';
import BlogServices from '~/services/BlogServices';
import config from '~/config';

const { Title, Text } = Typography;

const processImageURLs = (htmlString) => {
    const getImageURL = (imageId) => {
        return config.imageConfig.getImage(imageId);
    };

    if (!htmlString) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
        const src = img.getAttribute('src');
        const regex = /config\.imageConfig\.getImage\(['"]?([^'"]+)['"]?\)/;
        const match = src && src.match(regex);
        if (match && match[1]) {
            img.setAttribute('src', getImageURL(match[1]));
        }
    });

    return doc.body.innerHTML;
};

export const DetailNews = () => {
    const location = useLocation();
    const slug = location.pathname.replace(config.routes.news, '').replace(/^\/+/, '');
    const [blog, setBlog] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [blogRes, blogsRes] = await Promise.all([
                BlogServices.getBySlug(slug),
                BlogServices.getAllBlogs(),
            ]);
            const published = blogsRes.data.filter((item) => item.status === 'PUBLISHED');
            setBlog(blogRes.data);
            setBlogs(published);
        } catch (error) {
            console.error('Error fetching blog data:', error);
            message.error('Không thể tải bài viết.');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
    }, [slug, fetchData]);

    // Bài viết liên quan
    const relatedBlogs = blogs
        .filter(
            (item) =>
                item.category?.id === blog.category?.id &&
                item.id !== blog.id,
        )
        .slice(0, 4); // Giảm xuống 4 để sidebar không quá dài

    // Bài viết nổi bật
    const topBlogs = blogs
        .filter((item) => item.viewCount > 50 || item.likeCount > 50)
        .slice(0, 3);

    // Tag phổ biến (dựa trên category)
    const popularTags = [...new Set(blogs.map((item) => item.category?.name).filter(Boolean))]
        .slice(0, 6);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <Title level={1} className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                        {blog.title}
                    </Title>
                    <Text type="secondary" className="text-sm sm:text-base">
                        Đăng ngày: {config.webConfig.convertLocalDateTime(blog.createdAt) || 'N/A'}
                    </Text>
                    <Text type="secondary" className="text-sm sm:text-base ml-4">
                        Tác giả: {blog.user?.username || 'N/A'}
                    </Text>
                    {blog.description && (
                        <Text className="block mt-2 text-gray-600 italic text-base sm:text-lg">
                            {blog.description}
                        </Text>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
                {/* Blog Content */}
                <div className="lg:w-2/3">
                    <Card className="shadow-md p-6">
                        {loading ? (
                            <Spin
                                size="large"
                                tip="Đang tải bài viết..."
                                className="flex items-center justify-center h-64"
                            />
                        ) : (
                            <>
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: processImageURLs(blog.content) }}
                                />
                                <Divider />
                                <div className="mt-6">
                                    <Title level={4} className="text-xl font-semibold text-gray-800">
                                        Chia sẻ bài viết
                                    </Title>
                                    <div className="flex gap-4 mt-2">
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}${config.routes.news}${blog.slug}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                        >
                                            <i className="fab fa-facebook-f" /> Facebook
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}${config.routes.news}${blog.slug}`)}&text=${encodeURIComponent(blog.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-600 flex items-center gap-2"
                                        >
                                            <i className="fab fa-twitter" /> Twitter
                                        </a>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}${config.routes.news}${blog.slug}`);
                                                message.success('Sao chép liên kết thành công!');
                                            }}
                                            className="text-green-600 hover:text-green-800 flex items-center gap-2"
                                        >
                                            <i className="fas fa-link" /> Sao chép liên kết
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 sticky top-4 self-start">
                    {/* Bài viết liên quan */}
                    <Card className="shadow-md p-6 mb-6">
                        <Title level={4} className="text-xl font-semibold text-gray-800 mb-4">
                            Bài viết liên quan
                        </Title>
                        <Divider className="mb-4" />
                        <div className="grid gap-4">
                            {relatedBlogs.length === 0 ? (
                                <Text type="secondary">Không có bài viết liên quan.</Text>
                            ) : (
                                relatedBlogs.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`${config.routes.news}${item.slug}`}
                                        className="group block rounded-lg overflow-hidden border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex gap-4 p-3">
                                            <div className="relative w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={config.imageConfig.getImage(item.thumbnail) || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80'}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Text
                                                    className="text-gray-800 font-semibold text-base line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                    {item.metaTitle || item.title}
                                                </Text>
                                                <Text className="text-gray-500 text-sm line-clamp-2 mt-1">
                                                    {item.metaDescription}
                                                </Text>
                                                <Text type="secondary" className="text-xs mt-1 block">
                                                    {config.webConfig.convertDateNoTime(item.createdAt)}
                                                </Text>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Bài viết nổi bật */}
                    <Card className="shadow-md p-6 mb-6">
                        <Title level={4} className="text-xl font-semibold text-gray-800 mb-4">
                            Bài viết nổi bật
                        </Title>
                        <Divider className="mb-4" />
                        <div className="space-y-4">
                            {topBlogs.length === 0 ? (
                                <Text type="secondary">Không có bài viết nổi bật.</Text>
                            ) : (
                                topBlogs.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`${config.routes.news}${item.slug}`}
                                        className="group flex gap-3 items-center border rounded-lg p-2 hover:border-orange-500 hover:bg-orange-50 transition-all"
                                    >
                                        <img
                                            src={config.imageConfig.getImage(item.thumbnail) || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80'}
                                            alt={item.title}
                                            className="w-16 h-16 rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div>
                                            <Text
                                                className="text-gray-800 font-semibold text-sm line-clamp-2 group-hover:text-orange-600">
                                                {item.metaTitle || item.title}
                                            </Text>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Text type="secondary" className="text-xs">
                                                    {config.webConfig.convertDateNoTime(item.createdAt)}
                                                </Text>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <EyeOutlined className="mr-1 text-orange-500" />
                                                    {item.viewCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Tag phổ biến */}
                    <Card className="shadow-md p-6 mb-6">
                        <Title level={4} className="text-xl font-semibold text-gray-800 mb-4">
                            Tag phổ biến
                        </Title>
                        <Divider className="mb-4" />
                        <div className="flex flex-wrap gap-2">
                            {popularTags.length === 0 ? (
                                <Text type="secondary">Không có tag nào.</Text>
                            ) : (
                                popularTags.map((tag, index) => (
                                    <Tag
                                        key={index}
                                        color="orange"
                                        className="cursor-pointer hover:bg-orange-600 hover:text-white transition-colors"
                                        onClick={() => message.info(`Tìm bài viết theo tag: ${tag}`)} // Có thể thêm logic tìm kiếm
                                    >
                                        {tag}
                                    </Tag>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Quảng cáo placeholder */}
                    <Card className="shadow-md p-6">
                        <Title level={4} className="text-xl font-semibold text-gray-800 mb-4">
                            Khám phá thêm
                        </Title>
                        <Divider className="mb-4" />
                        <div className="text-center flex flex-col items-center">
                            <Text className="text-gray-600">
                                Đặt tour du lịch hôm nay để nhận ưu đãi đặc biệt!
                            </Text>
                            <Button
                                type="primary"
                                className="mt-4 bg-orange-600 hover:bg-orange-700"
                                onClick={() => navigate(config.routes.tourTrongNuoc)}
                            >
                                Tìm hiểu thêm
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};