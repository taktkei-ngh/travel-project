import { Button, Form, Input, message, Modal } from 'antd';
import React from 'react';

export const CreateModal = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        await onCreate(values);
        form.resetFields();
    };

    return (
        <Modal
            title="Tạo danh mục mới"
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
                            Tạo
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};