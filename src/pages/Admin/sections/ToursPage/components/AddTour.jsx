import { Button, Divider, Form, Image, Input, InputNumber, message, Modal, Select, Space, Upload } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import TourServices from '~/services/TourServices';

const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const AddTour = ({ modalVisible, setModalVisible, category, destination, setLoading }) => {
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [thumbnail, setThumbnail] = useState([]);
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);

    // Xử lý preview ảnh
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    // Xử lý thay đổi file upload
    const handleChangeThumbnail = ({ fileList }) => setThumbnail(fileList);
    const handleChangeImages = ({ fileList }) => setImages(fileList);

    // Nút upload
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    // Xử lý submit form
    const handleAdd = async () => {
        try {
            // Validate form trước khi submit
            const values = await form.validateFields();
            setSubmitting(true);

            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('duration', values.duration);
            formData.append('destinationId', values.destinationId);
            formData.append('categoryId', values.categoryId);

            if (thumbnail.length > 0) {
                formData.append('thumbnail', thumbnail[0].originFileObj);
            } else {
                message.error('Vui lòng chọn ảnh thumbnail!');
                setSubmitting(false);
                return;
            }

            images.forEach((file) => {
                formData.append('images', file.originFileObj);
            });

            await TourServices.AddTour(formData);
            message.success('Thêm tour thành công', 1);
            setLoading();
            form.resetFields();
            setThumbnail([]);
            setImages([]);
            setSelectedDestination(null);
            setModalVisible(false);
        } catch (err) {
            message.error('Thêm tour thất bại: ' + (err.message || 'Có lỗi xảy ra'), 1);
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Xử lý hủy
    const handleCancel = () => {
        form.resetFields();
        setThumbnail([]);
        setImages([]);
        setSelectedDestination(null);
        setModalVisible(false);
    };

    // Xử lý khi chọn destination
    const handleDestinationChange = (value) => {
        const selected = destination.find((dest) => dest.id === value);
        setSelectedDestination(selected || null);
    };

    return (
        <Modal
            title="Thêm tour"
            width={800}
            open={modalVisible}
            onCancel={handleCancel}
            footer={null} // Loại bỏ footer mặc định
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAdd} // Gọi handleAdd khi submit form
            >
                <div className="p-4 space-y-2 w-full">
                    <Form.Item label="Ảnh tour thumbnail" required>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnail}
                            onPreview={handlePreview}
                            onChange={handleChangeThumbnail}
                            beforeUpload={() => false}
                        >
                            {thumbnail.length >= 1 ? null : uploadButton}
                        </Upload>
                        {thumbnail.length === 0 && (
                            <div className="text-red-500">Vui lòng chọn ảnh thumbnail</div>
                        )}
                    </Form.Item>

                    <Form.Item label="Ảnh phụ (Tối đa 8 ảnh)">
                        <Upload
                            listType="picture-card"
                            fileList={images}
                            onPreview={handlePreview}
                            onChange={handleChangeImages}
                            beforeUpload={() => false}
                        >
                            {images.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Divider />

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="title"
                            label="Tên tour"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}
                        >
                            <Input placeholder="Tên tour" allowClear />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả tour"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả tour!' }]}
                        >
                            <TextArea className="max-h-24" allowClear placeholder="Mô tả tour" />
                        </Form.Item>

                        <Form.Item
                            name="duration"
                            label="Thời gian"
                            rules={[
                                { required: true, message: 'Vui lòng nhập thời gian!' },
                                { type: 'number', min: 1, message: 'Thời gian phải lớn hơn 0!' },
                            ]}
                        >
                            <InputNumber className="w-full" placeholder="Thời gian" />
                        </Form.Item>

                        <Form.Item
                            name="categoryId"
                            label="Loại tour"
                            rules={[{ required: true, message: 'Vui lòng chọn loại tour!' }]}
                        >
                            <Select
                                showSearch
                                options={category}
                                fieldNames={{ value: 'id', label: 'title' }}
                                placeholder="Chọn loại tour"
                            />
                        </Form.Item>

                        <div className="space-y-4 w-full">
                            <Form.Item
                                name="destinationId"
                                label="Điểm đến"
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
                                />
                            </Form.Item>

                            {selectedDestination && (
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Thông tin điểm đến</h3>
                                    <Form.Item label="Quốc gia">
                                        <Input
                                            disabled
                                            value={selectedDestination.country || ''}
                                            placeholder="Quốc gia"
                                            className="bg-white"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Thành phố">
                                        <Input
                                            disabled
                                            value={selectedDestination.city || ''}
                                            placeholder="Thành phố"
                                            className="bg-white"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Địa chỉ đầy đủ">
                                        <Input
                                            disabled
                                            value={selectedDestination.fullAddress || ''}
                                            placeholder="Địa chỉ đầy đủ"
                                            className="bg-white"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Khu vực">
                                        <Input
                                            disabled
                                            value={selectedDestination.region ? 'Ngoài nước' : 'Trong nước'}
                                            placeholder="Khu vực"
                                            className="bg-white"
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút Add và Hủy */}
                    <div className="flex justify-end gap-2">
                        <Button onClick={handleCancel} disabled={submitting}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => form.submit()} // Gọi submit form
                            loading={submitting}
                        >
                            Thêm
                        </Button>
                    </div>
                </div>
            </Form>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Modal>
    );
};