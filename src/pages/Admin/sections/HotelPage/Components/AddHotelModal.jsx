import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Rate, Space, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import HotelServices from '~/services/HotelServices';

// Utility function to convert image to base64 for preview
const getBase64 = (img, callback) => {
    if (!img || !(img instanceof Blob)) {
        console.error('Invalid file object:', img);
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

// Validation function for uploaded file
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!');
        return Upload.LIST_IGNORE;
    }
    return false;
};

const AddHotelModal = ({ visible, setVisible, loading, setLoading, fetchHotels }) => {
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const handleImageChange = ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            if (file) {
                setImageLoading(true);
                getBase64(file, (url) => {
                    setImageLoading(false);
                    setImage(url);
                });
            }
        } else {
            setImage(null);
            setImageLoading(false);
        }
    };

    const handleAddHotel = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('rating', values.rating);
            formData.append('cost', values.cost);
            formData.append('typeHotel', values.typeHotel);
            if (values.image && values.image.length > 0) {
                formData.append('image', values.image[0].originFileObj);
            }
            await HotelServices.createHotel(formData);
            message.success('Thêm khách sạn thành công!');
            setVisible(false);
            setImage(null);
            form.resetFields();
            fetchHotels();
        } catch (error) {
            console.error('Error adding hotel:', error);
            message.error('Không thể thêm khách sạn!');
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Modal
            open={visible}
            onCancel={() => {
                setVisible(false);
                setImage(null);
                form.resetFields();
            }}
            title="Thêm khách sạn"
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAddHotel}
                initialValues={{
                    rating: 0,
                    cost: 0,
                }}
            >
                <Form.Item
                    name="name"
                    label="Tên khách sạn"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
                >
                    <Input placeholder="Nhập tên khách sạn" />
                </Form.Item>

                <Form.Item
                    name="rating"
                    label="Đánh giá (sao)"
                    rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
                >
                    <Rate allowHalf />
                </Form.Item>

                <Form.Item
                    name="cost"
                    label="Giá (VND)"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber
                        min={0}
                        step={100000}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                        placeholder="Nhập giá khách sạn"
                    />
                </Form.Item>

                <Form.Item
                    name="typeHotel"
                    label="Loại khách sạn"
                    rules={[{ required: true, message: 'Vui lòng nhập loại khách sạn!' }]}
                >
                    <Input placeholder="Nhập loại khách sạn (VD: Resort, Hotel)" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Ảnh khách sạn"
                    rules={[{ required: true, message: 'Vui lòng tải lên ảnh khách sạn!' }]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                >
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleImageChange}
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="hotel"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Thêm khách sạn
                        </Button>
                        <Button
                            onClick={() => {
                                setVisible(false);
                                setImage(null);
                                form.resetFields();
                            }}
                        >
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddHotelModal;