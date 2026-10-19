import { Button, Form, Input, message, Modal } from 'antd';
import React, { useEffect } from 'react';

export const EditModal = ({ visible, category, onUpdate, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (category) {
            form.setFieldsValue({ name: category.name });
        }
    }, [category, form]);

    const handleSubmit = async (values) => {
        if (!category?.id) {
            message.error('Không tìm thấy danh mục!');
            return;
        }
        await onUpdate(category.id, values);
    };

    return (
        <Modal
            title="Chỉnh sửa danh mục"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="w-full"
            >
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                    <Input placeholder="Nhập tên danh mục" />
                </Form.Item>
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};