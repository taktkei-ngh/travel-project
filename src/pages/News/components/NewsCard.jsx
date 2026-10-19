import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import config from '~/config';
import { FaEye, FaHeart, FaClock, FaShareAlt, FaBookmark, FaFacebookF, FaTwitter, FaLink } from 'react-icons/fa';
import { message, Popover } from 'antd';

export const NewsCard = ({ blog }) => {
    // Calculate estimated reading time (roughly 200 words per minute)
    const calculateReadingTime = (content) => {
        if (!content) return '1 min';
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        return `${readingTime} min`;
    };
    const shareUrl = `${window.location.origin}${config.routes.news}${blog.slug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        message.success('Sao chép thành công!');
    };

    const shareContent = (
        <div className="flex flex-col space-y-2 min-w-[120px]">
            <button
                className="flex items-center space-x-2 hover:text-blue-600"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
                <FaFacebookF /> <span>Facebook</span>
            </button>
            <button
                className="flex items-center space-x-2 hover:text-blue-400"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
                <FaTwitter /> <span>Twitter</span>
            </button>
            <button
                className="flex items-center space-x-2 hover:text-green-600"
                onClick={handleCopy}
            >
                <FaLink /> <span>Sao chép link</span>
            </button>
        </div>
    );
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mb-6 border border-gray-100">
            <Link to={`${config.routes.news}${blog.slug}`} className="block">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/3 h-48 md:h-56 overflow-hidden">
                        <img
                            src={config.imageConfig.getImage(blog.thumbnail) || config.webConfig.banner1}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div
                            className="absolute top-0 right-0 bg-orange-600 text-white text-xs px-2 py-1 rounded-bl-lg">
                            {config.webConfig.convertDateNoTime(blog.createdAt)}
                        </div>
                        {blog.category && (
                            <div
                                className="absolute bottom-0 left-0 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-xs px-3 py-1 rounded-tr-lg">
                                {blog.category.name}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-2/3 p-5 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2 mb-2 hover:text-orange-600 transition-colors duration-300">
                                {blog.title}
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base line-clamp-3 mb-4">
                                {blog.metaDescription}
                            </p>

                            {/* Tags Section (if available) */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {blog.tags.map((tag, index) => (
                                        <span key={index}
                                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-3">
                            {/* Author and Stats Row */}
                            <div className="flex flex-wrap justify-between items-center text-xs md:text-sm">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {blog.user?.avatar ? (
                                            <img
                                                src={blog.user.avatar}
                                                alt={blog.user?.firstName || blog.user?.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-500 text-xs font-bold">
                                                {(blog.user?.firstName?.[0] || blog.user?.username?.[0] || 'U').toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        {blog.user?.firstName} {blog.user?.lastName || blog.user?.username}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4 text-gray-500 mt-2 md:mt-0">
                                    <div className="flex items-center space-x-1" title="Thời gian đọc">
                                        <FaClock className="text-orange-500" />
                                        <span>{calculateReadingTime(blog.content)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1" title="Lượt xem">
                                        <FaEye className="text-orange-500" />
                                        <span>{blog.viewCount || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-1" title="Lượt thích">
                                        <FaHeart className="text-red-500" />
                                        <span>{blog.likeCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Action buttons */}
            <div className="flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-100">
                <button className="text-gray-500 hover:text-orange-600 p-1 transition-colors duration-200"
                        title="Lưu bài viết">
                    <FaBookmark />
                </button>
                <Popover content={shareContent} trigger="click" placement="topRight">
                    <button
                        className="text-gray-500 hover:text-orange-600 p-1 ml-3 transition-colors duration-200"
                        title="Chia sẻ"
                        type="button"
                    >
                        <FaShareAlt />
                    </button>
                </Popover>
            </div>
        </div>
    );
};

NewsCard.propTypes = {
    blog: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string,
        status: PropTypes.string,
        slug: PropTypes.string.isRequired,
        metaTitle: PropTypes.string,
        metaDescription: PropTypes.string,
        viewCount: PropTypes.number,
        likeCount: PropTypes.number,
        featuredImage: PropTypes.string,
        user: PropTypes.shape({
            id: PropTypes.string,
            username: PropTypes.string,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            email: PropTypes.string,
        }),
        category: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        }),
        tours: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                title: PropTypes.string,
                slug: PropTypes.string,
            }),
        ),
        active: PropTypes.bool,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    }).isRequired,
};
