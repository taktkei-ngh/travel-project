import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Switch, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import TransportServices from '~/services/TransportServices';

// TYPE TRANSPORT: 1 - TRAIN, 2 - BUS, 3 - FLIGHT
const transportTypes = {
    1: 'Tàu',
    2: 'Xe khách',
    3: 'Máy bay',
};

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

const AddTransportModal = ({ visible, setVisible, setLoading,loading, fetchTransports }) => {
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

    const handleAddTransport = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('cost', values.cost);
            formData.append('typeTransport', values.typeTransport);
            formData.append('active', values.active);
            if (values.image && values.image.length > 0) {
                formData.append('image', values.image[0].originFileObj);
            }
            await TransportServices.addTransport(formData);
            message.success('Thêm phương tiện thành công!');
            setVisible(false);
            setImage(null);
            form.resetFields();
            await fetchTransports();
        } catch (error) {
            console.error('Error adding transport:', error);
            message.error('Không thể thêm phương tiện!');
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Tải lên</div>
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
            title={<span className="text-lg font-semibold text-gray-800">Thêm phương tiện mới</span>}
            footer={null}
            width={600}
            className="rounded-lg shadow-lg"
            bodyStyle={{ padding: '24px', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAddTransport}
                initialValues={{
                    cost: 0,
                    active: true,
                    typeTransport: 1, // Default to TRAIN
                }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="name"
                        label={<span className="text-gray-700 font-medium">Tên phương tiện</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập tên phương tiện!' }]}
                        className="col-span-2"
                    >
                        <Input placeholder="Nhập tên phương tiện" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="cost"
                        label={<span className="text-gray-700 font-medium">Giá (VND)</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            min={0}
                            step={10000}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            className="w-full rounded-md"
                            placeholder="Nhập giá phương tiện"
                        />
                    </Form.Item>

                    <Form.Item
                        name="typeTransport"
                        label={<span className="text-gray-700 font-medium">Loại phương tiện</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn loại phương tiện!' }]}
                    >
                        <Select placeholder="Chọn loại phương tiện">
                            {Object.entries(transportTypes).map(([value, label]) => (
                                <Select.Option key={value} value={parseInt(value, 10)}>
                                    {label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label={<span className="text-gray-700 font-medium">Trạng thái hoạt động</span>}
                        valuePropName="checked"
                        className="col-span-2"
                    >
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label={<span className="text-gray-700 font-medium">Ảnh phương tiện</span>}
                        rules={[{ required: true, message: 'Vui lòng tải lên ảnh phương tiện!' }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                        className="col-span-2 flex justify-center"
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
                                    alt="transport"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>
                </div>

                <Form.Item className="mt-6">
                    <Space className="flex justify-end">
                        <Button
                            onClick={() => {
                                setVisible(false);
                                setImage(null);
                                form.resetFields();
                            }}
                            className="rounded-md border-gray-300"
                        >
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} className="rounded-md">
                            Thêm phương tiện
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTransportModal;