import { Typography, Spin, Button, Tooltip, Tag, Divider } from 'antd';
import { useState } from 'react';
import { CopyOutlined, PrinterOutlined, FullscreenOutlined, ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import config from '~/config';
import '../BlogStyle.css';

const { Title, Paragraph } = Typography;

const processImageURLs = (htmlString) => {
    // Function to get the actual URL from image ID
    const getImageURL = (imageId) => {
        return config.imageConfig.getImage(imageId);
    };

    // If no content, return empty string
    if (!htmlString) return '';

    // Create a DOMParser to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Find all <img> tags
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
        const src = img.getAttribute('src');
        // Check if src contains config.imageConfig.getImage expression
        const regex = /config\.imageConfig\.getImage\(['"]?([^'"]+)['"]?\)/;
        const match = src && src.match(regex);
        if (match && match[1]) {
            const imageId = match[1]; // Get image ID
            img.setAttribute('src', getImageURL(imageId)); // Replace with actual URL
        }
    });

    // Convert back to HTML string, preserving HTML structure
    return doc.body.innerHTML;
};

export const BlogDetail = ({ blog, onBack, onEdit }) => {
    const [loading, setLoading] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    // Handle copy to clipboard
    const handleCopyContent = async () => {
        try {
            setLoading(true);
            await navigator.clipboard.writeText(blog.content);
            if (window.antd && window.antd.message) {
                window.antd.message.success('Đã sao chép nội dung vào clipboard!');
            } else {
                alert('Đã sao chép nội dung vào clipboard!');
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
            if (window.antd && window.antd.message) {
                window.antd.message.error('Không thể sao chép nội dung!');
            } else {
                alert('Không thể sao chép nội dung!');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle print preview
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${blog.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                        h1 { color: #333; }
                        .author { font-style: italic; color: #666; margin-bottom: 20px; }
                        .date { color: #888; font-size: 0.9em; }
                        img { max-width: 100%; height: auto; }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${blog.title}</h1>
                    <div class="author">Tác giả: ${blog.user.username}</div>
                    <div class="date">Ngày đăng: ${blog.date}</div>
                    ${processImageURLs(blog.content)}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    // Toggle fullscreen preview
    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    return (
        <div className={`mt-4 transition-all duration-300 ${fullscreen ? 'fixed inset-0 z-50 bg-white overflow-auto p-6' : ''}`}>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
                    <div className="flex items-center">
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            type="text"
                            onClick={onBack}
                            className="mr-3"
                        />
                        <Title level={4} className="m-0 text-gray-800">
                            Chi tiết bài viết
                        </Title>
                    </div>
                    <div className="flex space-x-2">
                        <Tooltip title="Chỉnh sửa bài viết">
                            <Button 
                                icon={<EditOutlined />} 
                                type="primary"
                                onClick={() => onEdit && onEdit(blog)}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Chỉnh sửa
                            </Button>
                        </Tooltip>
                        <Tooltip title="Sao chép nội dung">
                            <Button 
                                icon={<CopyOutlined />} 
                                onClick={handleCopyContent}
                                loading={loading}
                            />
                        </Tooltip>
                        <Tooltip title="In bản xem trước">
                            <Button icon={<PrinterOutlined />} onClick={handlePrint} />
                        </Tooltip>
                        <Tooltip title={fullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}>
                            <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen} />
                        </Tooltip>
                    </div>
                </div>

                <Spin spinning={loading}>
                    <div className="p-6 bg-white rounded-b-lg">
                        <article className="preview-article">
                            <div className="flex justify-between items-center mb-4">
                                <Title level={2} className="mb-0 text-gray-900">
                                    {blog.title}
                                </Title>
                                <Tag color="blue">{blog.date}</Tag>
                            </div>

                            <Paragraph italic className="text-gray-600 mb-2">
                                Tác giả: {blog.user.username}
                            </Paragraph>

                            {blog.description && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <Paragraph className="text-gray-700 mb-0">
                                        {blog.description}
                                    </Paragraph>
                                </div>
                            )}

                            <Divider />

                            <div
                                className="prose prose-lg max-w-none mt-4"
                                dangerouslySetInnerHTML={{ __html: processImageURLs(blog.content) }}
                            />
                        </article>
                    </div>
                </Spin>
            </div>
        </div>
    );
};
