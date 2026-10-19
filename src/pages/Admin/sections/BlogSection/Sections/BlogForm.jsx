import { Form, Typography, Button, message, Spin, Tooltip, Switch, Space, Select, Upload, Image } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    FileTextOutlined,
    SaveOutlined,
    SendOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ArrowLeftOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import '../BlogStyle.css';
import { BlogPreview } from '~/pages/Admin/sections/BlogSection/Sections/BlogPreview';
import { debounce } from 'lodash';
import ImageResize from 'quill-image-resize-module-react';
import TourServices from '~/services/TourServices';
import BlogServices from '~/services/BlogServices';
import config from '~/config';



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

// Register Quill modules
if (typeof window !== 'undefined') {
    const Quill = ReactQuill.Quill;
    Quill.register('modules/imageResize', ImageResize);

    class ImageSize {
        constructor(quill, options) {
            this.quill = quill;
            this.toolbar = quill.getModule('toolbar');
            if (typeof this.toolbar !== 'undefined') {
                this.toolbar.addHandler('image-size', this.imageSize.bind(this));
            }
        }

        imageSize(value) {
            const range = this.quill.getSelection();
            if (range) {
                const [leaf] = this.quill.getLeaf(range.index);
                if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
                    leaf.domNode.classList.remove('ql-image-size-small', 'ql-image-size-medium', 'ql-image-size-large');
                    if (value) {
                        leaf.domNode.classList.add(`ql-image-size-${value}`);
                    }
                }
            }
        }
    }

    class ImageAlign {
        constructor(quill, options) {
            this.quill = quill;
            this.toolbar = quill.getModule('toolbar');
            if (typeof this.toolbar !== 'undefined') {
                this.toolbar.addHandler('image-align', this.imageAlign.bind(this));
            }
        }

        imageAlign(value) {
            const range = this.quill.getSelection();
            if (range) {
                const [leaf] = this.quill.getLeaf(range.index);
                if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
                    leaf.domNode.classList.remove('ql-image-align-left', 'ql-image-align-center', 'ql-image-align-right');
                    if (value) {
                        leaf.domNode.classList.add(`ql-image-align-${value}`);
                    }
                }
            }
        }
    }

    Quill.register('modules/imageSize', ImageSize);
    Quill.register('modules/imageAlign', ImageAlign);
}

const { Text } = Typography;

export const BlogForm = ({ blog, isEditing = false, onBack }) => {
    const [form] = Form.useForm();
    const [tours, setTours] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [categories, setCategories] = useState([]);
    const [content, setContent] = useState(blog?.content || localStorage.getItem('blogContent') || '');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [lastSaved, setLastSaved] = useState(localStorage.getItem('lastSaved') || null);
    const quillRef = useRef(null);

    const fetchData = useCallback(async () => {
        try {
            const [tourRes, categoryRes] = await Promise.all([
                TourServices.getAllTour({}),
                BlogServices.getBlogCategories(),
            ]);
            setTours(tourRes?.data || []);
            setCategories(categoryRes?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize form with blog data when in editing mode
    useEffect(() => {
        if (isEditing && blog) {
            form.setFieldsValue({
                title: blog.title,
                status: blog.status, // Ensure status is set correctly
                thumbnail: blog.thumbnail,
                categoryId: blog.category?.id,
                tourId: Array.isArray(blog.tours) ? blog.tours.map((tour) => tour.id) : [],
            });
            setThumbnail(blog.thumbnail); // Set thumbnail state
            if (blog.content) {
                setContent(blog.content);
                const setEditorContent = () => {
                    if (quillRef.current) {
                        quillRef.current.getEditor().setContents(
                            quillRef.current.getEditor().clipboard.convert(blog.content),
                        );
                    }
                };
                setTimeout(setEditorContent, 0);
            }
        } else {
            // Default status for create mode
            form.setFieldsValue({ status: 'DRAFT' });
        }
    }, [isEditing, blog, form]);

    // Auto-save to localStorage with debounce
    const saveToLocalStorage = debounce(() => {
        if (content) {
            localStorage.setItem('blogContent', content);
            const now = new Date().toLocaleString();
            localStorage.setItem('lastSaved', now);
            setLastSaved(now);
        }
    }, 1000);

    const beforeUpload = (file) => {
        setThumbnail(file);
        return false; // Prevent automatic upload
    };

    const handleThumbnailChange = ({ fileList }) => {
        if (fileList.length > 0) {
            setThumbnail(fileList[0].originFileObj || fileList[0]);
        } else {
            setThumbnail(null);
        }
        form.setFieldsValue({ thumbnail: fileList });
    };

    useEffect(() => {
        fetchData();
        saveToLocalStorage();
    }, [fetchData, content]);

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const blogData = {
                title: values.title,
                content,
                status: values.status,
                thumbnail: values.thumbnail ? values.thumbnail[0].originFileObj : null,
                categoryId: values.categoryId,
                tourId: values.tourId,
            };

            if (isEditing) {
                await BlogServices.updateBlog(blog.id, blogData);
                message.success('Bài viết đã được cập nhật!');
            } else {
                blogData.status = 'DRAFT';
                await BlogServices.createBlog(blogData);
                message.success('Bài viết đã được tạo thành công!');
            }

            // Clear localStorage after successful save
            localStorage.removeItem('blogContent');
            localStorage.removeItem('lastSaved');
            setLastSaved(null);

            if (onBack) {
                onBack();
            }
        } catch (error) {
            message.error('Không thể lưu bài viết. Vui lòng thử lại.');
            console.error('Error submitting blog:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const saveContentToLocalStorage = () => {
        try {
            setLoading(true);
            localStorage.setItem('blogContent', content);
            const now = new Date().toLocaleString();
            localStorage.setItem('lastSaved', now);
            setLastSaved(now);
            message.success('Draft saved successfully!');
        } catch (error) {
            message.error('Failed to save draft. Please try again.');
            console.error('Error saving draft:', error);
        } finally {
            setLoading(false);
        }
    };

    const restoreDraft = () => {
        try {
            const savedContent = localStorage.getItem('blogContent');
            if (savedContent) {
                setContent(savedContent);
                if (quillRef.current) {
                    quillRef.current.getEditor().setContents(
                        quillRef.current.getEditor().clipboard.convert(savedContent),
                    );
                }
                message.success('Draft restored successfully!');
            } else {
                message.info('No saved draft found.');
            }
        } catch (error) {
            message.error('Failed to restore draft. Please try again.');
            console.error('Error restoring draft:', error);
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                [{ align: [] }],
                [{ 'image-size': ['small', 'medium', 'large'] }],
                [{ 'image-align': ['left', 'center', 'right'] }],
                ['blockquote', 'code-block'],
                ['clean'],
            ],
        },
        imageResize: {
            parchment: ReactQuill.Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize'],
        },
        imageSize: true,
        imageAlign: true,
    };

    const formats = [
        'header',
        'font',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'script',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
        'align',
        'image-size',
        'image-align',
        'blockquote',
        'code-block',
    ];

    return (
        <div className="p-6 container mx-auto justify-center items-center">
            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                    {onBack && (
                        <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack} className="mr-3" />
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                        </h2>
                        {lastSaved && (
                            <p className="text-sm text-gray-500">Lần lưu cuối: {lastSaved}</p>
                        )}
                    </div>
                </div>
                <Space>
                    <Tooltip title="Hiển thị/Ẩn xem trước">
                        <Button
                            type="default"
                            icon={showPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => setShowPreview(!showPreview)}
                        />
                    </Tooltip>
                    <Tooltip title="Lưu bản nháp">
                        <Button
                            type="default"
                            icon={<SaveOutlined />}
                            onClick={saveContentToLocalStorage}
                            loading={loading}
                        >
                            Lưu bản nháp
                        </Button>
                    </Tooltip>
                </Space>
            </div>

            <Spin spinning={loading} tip="Đang xử lý...">
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            name="title"
                            label={<Text strong>Tiêu đề</Text>}
                            rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                            className="md:col-span-2"
                        >
                            <input
                                className="border rounded p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="Nhập tiêu đề (VD: Những địa điểm cực kỳ bạn nên đi 1 lần ở Nhật Bản)"
                            />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label={<Text strong>Danh mục</Text>}
                            rules={[{ required: true, message: 'Hãy chọn danh mục!' }]}
                        >
                            <Select
                                placeholder="Chọn danh mục"
                                className="w-full"
                                options={categories.map((category) => ({
                                    value: category.id,
                                    label: category.name,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="tourId"
                            label={<Text strong>Tour liên quan</Text>}
                            rules={[{ required: true, message: 'Hãy chọn ít nhất một tour!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn tour liên quan"
                                className="w-full"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                                optionFilterProp={'label'}
                                allowClear
                                options={tours.map((tour) => ({
                                    value: tour.id,
                                    label: tour.title,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label={<Text strong>Trạng thái</Text>}
                            className="md:col-span-2"
                        >
                            <Space>
                                <Text>Trạng thái bài viết</Text>
                                <Select
                                    defaultValue={blog?.status}
                                    className="w-1/2"
                                    options={[
                                        { value: 'DRAFT', label: 'Nháp' },
                                        { value: 'PUBLISHED', label: 'Công khai' },
                                    ]}
                                    onChange={(value) => {
                                        form.setFieldsValue({ status: value });
                                    }}/>
                                <Text type="secondary">
                                    {form.getFieldValue('status') === 'PUBLISHED'
                                        ? 'Bài viết sẽ được công khai cho tất cả mọi người.'
                                        : 'Bài viết sẽ chỉ được hiển thị cho bạn.'}
                                </Text>
                            </Space>
                        </Form.Item>
                        <Form.Item
                            name="thumbnail"
                            label={<Text strong>Ảnh đại diện (thumbnail)</Text>}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                            className="md:col-span-2"
                        >
                            <Upload
                                name="thumbnail"
                                listType="picture-card"
                                className="w-full"
                                maxCount={1}
                                beforeUpload={beforeUpload}
                                onChange={handleThumbnailChange}
                                accept="image/*"
                            >
                                {thumbnail ? (
                                    <img
                                        src={config.imageConfig.getImage(thumbnail)}
                                        alt="thumbnail"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                            {blog?.thumbnail && (
                                <Image
                                    src={config.imageConfig.getImage(blog.thumbnail)}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover rounded-lg mt-2"
                                    style={{ maxHeight: '200px' }}
                                />
                            )}
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="content"
                        label={<Text strong>Nội dung</Text>}
                        rules={[{ required: true, message: 'Hãy nhập nội dung!' }]}
                        className="mt-4"
                    >
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            className="h-96 pb-12"
                            placeholder="Viết nội dung blog của bạn tại đây..."
                            value={processImageURLs(content)}
                            onChange={(value) => {
                                setContent(value);
                            }}
                        />
                    </Form.Item>

                    <div className="flex justify-between mt-6">
                        <Button
                            type="default"
                            icon={<FileTextOutlined />}
                            onClick={restoreDraft}
                            className="mr-2"
                            disabled={loading}
                        >
                            Khôi phục bản nháp
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 hover:bg-blue-600"
                            icon={<SendOutlined />}
                            loading={submitting}
                        >
                            {isEditing ? 'Cập nhật' : 'Đăng bài'}
                        </Button>
                    </div>
                </Form>
            </Spin>

            {content && showPreview && (
                <div className="mt-8 transition-all duration-300">
                    <BlogPreview content={content} form={form} thumbnail={thumbnail} />
                </div>
            )}
        </div>
    );
};