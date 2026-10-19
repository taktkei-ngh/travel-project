import React, { useEffect } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';

const BookingCard = ({ visible, onClose, booking }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (booking) {
            form.setFieldsValue(booking);
        } else {
            form.resetFields();
        }
    }, [booking, form]);

    return (
        <Modal
            title="Chi tiết booking"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Tên người dùng" name="name">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Booking ID" name="bookingId">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Tên Tour" name="tour">
                    <Input disabled />
                </Form.Item>

                <Form.Item label="Ngày khởi hành" name="date">
                    <Input type="date" disabled />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status">
                    <Select disabled>
                        <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
                        <Select.Option value="Chưa thanh toán">Chưa thanh toán</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookingCard;
