import { Form, Image, Input, InputNumber, message, Modal, Select, Switch, Tabs, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import TourServices from '~/services/TourServices';
import config from '~/config';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const EditTour = ({ editModalVisible, setEditModalVisible, category, destination, setLoading, tourData }) => {
    const [form] = Form.useForm();
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [thumbnail, setThumbnail] = useState([]); // State cho thumbnail (1 ảnh)
    const [images, setImages] = useState([]); // State cho images (nhiều ảnh)

    // Đặt giá trị ban đầu cho form, selectedDestination và ảnh khi modal mở
    useEffect(() => {
        if (editModalVisible && tourData) {
            form.setFieldsValue({
                title: tourData.title,
                description: tourData.description,
                duration: tourData.duration,
                categoryId: tourData.categoryId,
                destinationId: tourData.destination?.id,
            });

            // Cập nhật selectedDestination
            const initialDestination = destination.find((dest) => dest.id === tourData.destination?.id);
            setSelectedDestination(initialDestination || null);

            // Cập nhật thumbnail
            if (tourData.thumbnail) {
                setThumbnail([
                    {
                        uid: '-1',
                        name: 'thumbnail.jpg',
                        status: 'done',
                        url: config.imageConfig.getImage(tourData.thumbnail),
                    },
                ]);
            } else {
                setThumbnail([]);
            }

            // Cập nhật images
            if (tourData.images && tourData.images.length > 0) {
                setImages(
                    tourData.images.map((img, index) => ({
                        uid: `-${index + 2}`,
                        name: `image-${index + 1}.jpg`,
                        status: 'done',
                        url: config.imageConfig.getImage(img),
                    })),
                );
            } else {
                setImages([]);
            }
        }
    }, [editModalVisible, tourData, destination, form]);

    // Xử lý khi chọn destination
    const handleDestinationChange = (value) => {
        const selected = destination.find((dest) => dest.id === value);
        setSelectedDestination(selected || null);
    };

    // Xử lý upload thumbnail
    const handleThumbnailChange = ({ fileList }) => {
        if (fileList.length > 1) {
            message.error('Chỉ được chọn 1 ảnh thumbnail!');
            return;
        }
        setThumbnail(fileList);
    };

    // Xử lý upload images
    const handleImagesChange = ({ fileList }) => {
        if (fileList.length > 8) {
            message.error('Tối đa 8 ảnh!');
            return;
        }
        setImages(fileList);
    };

    // Xử lý submit form
    const handleOk = async () => {
        try {
            setSubmitting(true);
            const values = await form.validateFields();
            const formData = new FormData();

            // Thêm các trường vào FormData
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('duration', values.duration);
            formData.append('categoryId', values.categoryId);
            formData.append('destinationId', values.destinationId);

            // Thêm thumbnail nếu có
            if (thumbnail.length > 0 && thumbnail[0].originFileObj) {
                formData.append('thumbnail', thumbnail[0].originFileObj);
            }

            // Thêm images nếu có
            images.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });

            // Gọi API updateTour
            await TourServices.updateTour(tourData.id, formData);
            message.success('Cập nhật tour thành công!');
            setLoading(); // Trigger reload danh sách tour
            setEditModalVisible(false); // Đóng modal
        } catch (error) {
            console.error('Error updating tour:', error);
            message.error(`Cập nhật tour thất bại: ${error.message || 'Có lỗi xảy ra'}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Xử lý đóng modal
    const handleCancel = () => {
        setEditModalVisible(false);
        setSelectedDestination(null);
        setThumbnail([]);
        setImages([]);
        form.resetFields(); // Reset form khi đóng
    };

    // Custom render cho item trong Upload
    const uploadItemRender = (originNode, file) => (
        <div className="relative">
            <Image
                src={file.url || URL.createObjectURL(file.originFileObj)}
                alt={file.name}
                className="w-full h-auto rounded-md"
                style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
            <DeleteOutlined
                className="absolute top-0 right-0 text-red-500 cursor-pointer"
                onClick={() => {
                    if (file.uid === thumbnail[0]?.uid) {
                        setThumbnail([]);
                    } else {
                        setImages(images.filter((img) => img.uid !== file.uid));
                    }
                }}
            />
        </div>
    );

    return (
        <Modal
            title={<span className="text-xl font-bold text-gray-800">Chỉnh sửa tour</span>}
            open={editModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Lưu"
            cancelText="Đóng"
            okButtonProps={{ loading: submitting }}
            width={900}
            bodyStyle={{ padding: '24px' }}
            className="rounded-lg"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Tabs>
                    <Tabs.TabPane tab="Thông tin tour" key="1">
                        <div className="space-y-6">
                            {/* Nhóm thông tin cơ bản */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cơ bản</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item
                                        name="title"
                                        label={<span className="font-medium text-gray-700">Tên tour</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}
                                    >
                                        <Input placeholder="Nhập tên tour" className="rounded-md" />
                                    </Form.Item>

                                    <Form.Item
                                        name="duration"
                                        label={<span className="font-medium text-gray-700">Thời gian (ngày)</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập thời gian tour!' }]}
                                    >
                                        <InputNumber min={1} max={30} className="w-full rounded-md" />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="description"
                                    label={<span className="font-medium text-gray-700">Mô tả</span>}
                                    rules={[{ required: true, message: 'Vui lòng nhập mô tả tour!' }]}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Nhập mô tả tour"
                                        className="rounded-md"
                                    />
                                </Form.Item>
                            </div>

                            {/* Nhóm danh mục và điểm đến */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Danh mục & Điểm đến</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Form.Item
                                        name="categoryId"
                                        label={<span className="font-medium text-gray-700">Danh mục</span>}
                                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    >
                                        <Select
                                            placeholder="Chọn danh mục"
                                            className="rounded-md"
                                            showSearch
                                            options={category}
                                            fieldNames={{ value: 'id', label: 'title' }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                            }
                                            optionFilterProp="label"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="space-y-4">
                                    <Form.Item
                                        name="destinationId"
                                        label={<span className="font-medium text-gray-700">Điểm đến</span>}
                                        rules={[{ required: true, message: 'Vui lòng chọn điểm đến!' }]}
                                    >
                                        <Select
                                            showSearch
                                            options={destination.map((dest) => ({
                                                value: dest.id,
                                                label: `${dest.city} - ${dest.country} - ${dest.name}`,
                                            }))}
                                            placeholder="Chọn điểm đến"
                                            onChange={handleDestinationChange}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                            }
                                            notFoundContent="Không có điểm đến nào"
                                            className="rounded-md"
                                        />
                                    </Form.Item>

                                    {selectedDestination ? (
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-700">Thông tin điểm đến</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Form.Item label="Quốc gia">
                                                    <Input
                                                        disabled
                                                        value={selectedDestination.country || ''}
                                                        placeholder="Quốc gia"
                                                        className="bg-white rounded-md"
                                                    />
                                                </Form.Item>
                                                <Form.Item label="Thành phố">
                                                    <Input
                                                        disabled
                                                        value={selectedDestination.city || ''}
                                                        placeholder="Thành phố"
                                                        className="bg-white rounded-md"
                                                    />
                                                </Form.Item>
                                                <Form.Item label="Địa chỉ đầy đủ">
                                                    <Input
                                                        disabled
                                                        value={selectedDestination.fullAddress || ''}
                                                        placeholder="Địa chỉ đầy đủ"
                                                        className="bg-white rounded-md"
                                                    />
                                                </Form.Item>
                                                <Form.Item label="Khu vực">
                                                    <Input
                                                        disabled
                                                        value={selectedDestination.region ? 'Ngoài nước' : 'Trong nước'}
                                                        placeholder="Khu vực"
                                                        className="bg-white rounded-md"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-red-500">Điểm đến không hợp lệ hoặc chưa được chọn</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Hình ảnh" key="2">
                        <div className="space-y-6">
                            {/* Thumbnail */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-bold text-gray-700 mb-4">Thumbnail</h3>
                                <Form.Item
                                    name="thumbnail"
                                    label={<span className="font-medium text-gray-700">Hình ảnh thumbnail</span>}
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={thumbnail}
                                        onChange={handleThumbnailChange}
                                        beforeUpload={() => false} // Ngăn upload tự động
                                        itemRender={uploadItemRender}
                                        accept="image/*"
                                    >
                                        {thumbnail.length === 0 && (
                                            <div>
                                                <UploadOutlined />
                                                <div className="mt-2">Tải lên</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </div>

                            {/* Images */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-bold text-gray-700 mb-4">Hình ảnh chi tiết</h3>
                                <Form.Item
                                    name="images"
                                    label={<span
                                        className="font-medium text-gray-700">Hình ảnh chi tiết (tối đa 8 ảnh)</span>}
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={images}
                                        onChange={handleImagesChange}
                                        beforeUpload={() => false} // Ngăn upload tự động
                                        itemRender={uploadItemRender}
                                        accept="image/*"
                                        multiple
                                    >
                                        {images.length < 8 && (
                                            <div>
                                                <UploadOutlined />
                                                <div className="mt-2">Tải lên</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </div>
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </Modal>
    );
};