import React from 'react';
import { Button, Card, message, Popover, Tooltip } from 'antd';
import { ShareAltOutlined, EyeOutlined } from '@ant-design/icons';
import config from '~/config';
import { Link } from 'react-router-dom';
import { FaBookmark, FaFacebookF, FaLink, FaShareAlt, FaTwitter } from 'react-icons/fa';

export const BlogCard = ({ blog }) => {
    const shareUrl = `${window.location.origin}${config.routes.news}${blog.slug}`;

    // Hàm xử lý chia sẻ bài viết
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.metaDescription,
                url: shareUrl,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(shareUrl);
            message.success('Đã sao chép link bài viết!');
        }
    };

    // Hàm xử lý sao chép link
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        message.success('Sao chép link thành công!');
    };

    // Hàm xử lý lưu bài viết (giả lập)
    const handleSave = (e) => {
        e.stopPropagation(); // Ngăn điều hướng khi nhấn nút lưu
        message.success('Đã lưu bài viết!'); // Giả lập hành động lưu
        // TODO: Gọi API để lưu bài viết vào danh sách yêu thích
    };

    // Nội dung Popover cho chia sẻ
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
            {/* Phần hình ảnh với Link */}
            <Link to={`${config.routes.news}${blog.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={config.imageConfig.getImage(blog.thumbnail) || config.webConfig.banner1}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-orange-700 p-1 rounded-lg w-fit bg-orange-200 text-sm">
                            {config.webConfig.convertDateNoTime(blog.createdAt)}
                        </p>
                    </div>
                </div>
            </Link>

            {/* Phần nội dung */}
            <div className="p-4">
                {/* Tiêu đề và mô tả với Link */}
                <Link to={`${config.routes.news}${blog.slug}`} className="block">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2 hover:text-orange-600 transition-colors">
                        {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{blog.metaDescription}</p>
                </Link>

                {/* Phần tác giả và nút hành động */}
                <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-xs">Tác giả: {blog.user.username}</p>
                    <div className="flex justify-end space-x-3">
                        {/* Nút lưu bài viết */}
                        <Tooltip title="Lưu bài viết">
                            <button
                                className="text-gray-500 hover:text-orange-600 p-1 transition-colors duration-200"
                                onClick={handleSave}
                            >
                                <FaBookmark />
                            </button>
                        </Tooltip>

                        {/* Nút chia sẻ */}
                        <Popover content={shareContent} trigger="click" placement="topRight">
                            <Tooltip title="Chia sẻ">
                                <button
                                    className="text-gray-500 hover:text-orange-600 p-1 transition-colors duration-200"
                                    onClick={(e) => e.stopPropagation()} // Ngăn điều hướng
                                >
                                    <FaShareAlt />
                                </button>
                            </Tooltip>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    );
};