import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, Radio } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

export const BookingInfo2 = ({setStep}) => {
    const [form] = Form.useForm();
    const [discountCode, setDiscountCode] = useState("");
    const [totalPrice, setTotalPrice] = useState(11500000);
    const discount = discountCode === "XUAN2022" ? 0.5 : 0;

    const handleDiscountChange = (e) => {
        setDiscountCode(e.target.value);
    };

    const applyDiscount = () => {
        setTotalPrice(11500000 * (1 - discount));
    };

    const onFinish = (values) => {
        console.log("Form Data:", values);
        setStep(3);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin đặt vé</h2>

            <div className="mb-4">
                <p><strong>Tour:</strong> Hồ Chí Minh → Vịnh Hạ Long</p>
                <p><strong>Phương tiện di chuyển:</strong> Máy bay, xe du lịch</p>
                <p><strong>Thời gian:</strong> 2 ngày 3 đêm</p>
                <p><strong>Ngày khởi hành:</strong> 01-05-2022</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin người lớn 1</h3>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Họ và tên" name="adultName" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Ngày sinh" name="adultDob">
                    <DatePicker className="w-full" defaultValue={dayjs("2003-01-01")} />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                    <Input  />
                </Form.Item>

                <Form.Item label="Chứng minh nhân dân (Passport)" name="passport">
                    <Input  />
                </Form.Item>

                <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Thông tin trẻ em 1</h3>
                <Form.Item label="Họ và tên" name="childName">
                    <Input defaultValue="Quang Đạt" />
                </Form.Item>



                <Form.Item label="Ngày sinh" name="childDob">
                    <DatePicker className="w-full" defaultValue={dayjs("2010-02-03")} />
                </Form.Item>

                <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Xác nhận thanh toán</h3>
                <p><strong>Số người lớn:</strong> 1</p>
                <p><strong>Số trẻ em:</strong> 1</p>
                <p><strong>Tạm tính:</strong> 11.500.000 đ</p>

                <Form.Item label="Mã giảm giá" name="discount">
                    <Input
                        value={discountCode}
                        onChange={handleDiscountChange}
                        suffix={<Button onClick={applyDiscount}>✓</Button>}
                    />
                </Form.Item>

                <p className="text-green-600">
                    {discount > 0 ? `Giảm ${discount * 100}%: ${11500000 * discount} đ` : "Mã giảm giá không hợp lệ"}
                </p>
                <p className="text-xl font-semibold text-red-500">Tổng tiền phải thanh toán: {totalPrice.toLocaleString()} đ</p>

                <Form.Item label="Phương thức thanh toán" name="paymentMethod">
                    <Radio.Group>
                        <Radio value="online">Thanh toán trực tuyến</Radio>
                        <Radio value="counter">Thanh toán tại quầy</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className="bg-orange-500 w-full" htmlType="submit">
                        Đặt ngay
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};