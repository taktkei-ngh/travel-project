import { Collapse, Typography, Spin, Button, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import { CopyOutlined, PrinterOutlined, FullscreenOutlined } from '@ant-design/icons';
import config from '~/config';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;


const processImageURLs = (htmlString) => {
    // Hàm để lấy URL thực tế từ ID ảnh
    const getImageURL = (imageId) => {
        // Ví dụ: Google Drive URL
        // return `https://drive.google.com/uc?export=view&id=${imageId}`;
        // Hoặc sử dụng hàm từ config nếu có, ví dụ:
        return config.imageConfig.getImage(imageId);
    };

    // Nếu không có nội dung, trả về chuỗi rỗng
    if (!htmlString) return '';

    // Tạo một DOMParser để phân tích HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Tìm tất cả thẻ <img>
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
        const src = img.getAttribute('src');
        // Kiểm tra nếu src chứa biểu thức config.imageConfig.getImage
        const regex = /config\.imageConfig\.getImage\(['"]?([^'"]+)['"]?\)/;
        const match = src && src.match(regex);
        if (match && match[1]) {
            const imageId = match[1]; // Lấy ID ảnh
            img.setAttribute('src', getImageURL(imageId)); // Thay bằng URL thực tế
        }
    });

    // Chuyển lại thành chuỗi HTML, giữ nguyên cấu trúc HTML
    return doc.body.innerHTML;
};

export const BlogPreview = ({ content, form, thumbnail }) => {
    const [loading, setLoading] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    // Memoize preview content to optimize performance
    const previewContent = useMemo(() => {
        const title = form.getFieldValue('title') || 'Tiêu đề mẫu';
        const author = form.getFieldValue('author') || 'Tác giả chưa xác định';
        return {
            title,
            author,
            html: content,
        };
    }, [content, form]);

    // Handle copy to clipboard
    const handleCopyContent = async () => {
        try {
            setLoading(true);
            await navigator.clipboard.writeText(previewContent.html);
            // Use message from Ant Design if available
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
                    <title>${previewContent.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                        h1 { color: #333; }
                        .author { font-style: italic; color: #666; margin-bottom: 20px; }
                        img { max-width: 100%; height: auto; }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${previewContent.title}</h1>
                    <div class="author">Tác giả: ${previewContent.author}</div>
                    ${processImageURLs(previewContent.html)}
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
        <div className={`mt-8 transition-all duration-300 ${fullscreen ? 'fixed inset-0 z-50 bg-white overflow-auto p-6' : ''}`}>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
                    <Title level={4} className="m-0 text-gray-800">
                        Xem trước nội dung
                    </Title>
                    <div className="flex space-x-2">
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
                            <Title level={2} className="mb-2 text-gray-900">
                                {previewContent.title}
                            </Title>
                            <div
                                className="prose prose-lg max-w-none mt-4"
                                dangerouslySetInnerHTML={{ __html: processImageURLs(previewContent.html) }}
                            />
                        </article>
                    </div>
                </Spin>
            </div>
        </div>
    );
};
