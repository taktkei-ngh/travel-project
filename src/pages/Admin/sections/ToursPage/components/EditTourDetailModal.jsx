import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Switch, message, Select } from 'antd';
import TourDetailServices from '~/services/TourDetailServices';
import dayjs from 'dayjs';
import config from '~/config';

export const EditTourDetail = ({ visible, hotels, guides, transports, setVisible, tourDetail, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handlePriceAdultsChange = (value) => {
        form.setFieldsValue({ priceChildren: value * 0.3 });
    };

    useEffect(() => {
        if (tourDetail && tourDetail.id) {
            form.setFieldsValue({
                ...tourDetail,
                startDate: tourDetail.startDate ? dayjs(tourDetail.startDate) : null,
                endDate: tourDetail.endDate ? dayjs(tourDetail.endDate) : null,
                hotelId: tourDetail.hotelId || '',
                transportId: tourDetail.transportId || '',
                quantity: tourDetail.quantity || 0,
                priceAdults: tourDetail.priceAdults || 0,
                priceChildren: tourDetail.priceChildren || 0,
                guideId: tourDetail.guide?.id || 'Chưa có hướng dẫn viên',
                active: tourDetail.active,
            });
        } else {
            form.resetFields(); // Đặt lại form nếu tourDetail không hợp lệ
        }
    }, [tourDetail, form]);

    const handleSubmit = async (values) => {
        if (!tourDetail || !tourDetail.id) {
            message.error('Không tìm thấy thông tin chi tiết tour!');
            return;
        }

        try {
            const { startDate, endDate } = values;

            if (!startDate || !endDate) {
                message.error('Vui lòng chọn đầy đủ ngày và giờ bắt đầu, kết thúc!');
                return;
            }

            // Kiểm tra duration hợp lệ
            const daysDiff = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
            if (daysDiff !== tourDetail.duration) {
                message.error(`Khoảng cách ngày phải đúng ${tourDetail.duration} ngày!`);
                return;
            }

            setLoading(true);
            const body = {
                ...values,
                startDate: startDate,
                endDate: endDate,
            };

            await TourDetailServices.updateTourDetail(tourDetail.id, body);
            message.success('Cập nhật chi tiết tour thành công!');
            setVisible(false);
            onSuccess();
        } catch (error) {
            console.error('Error updating tour detail:', error);
            message.error('Cập nhật chi tiết tour thất bại!');
        } finally {
            setLoading(false);
        }
    };
    const handleStartDateChange = (date) => {
        if (date && tourDetail?.tour?.duration) {
            const endDate = dayjs(date)
                .add(tourDetail.tour.duration - 1, 'day')
                .hour(20)
                .minute(0)
                .second(0);

            form.setFieldsValue({
                dateRange: [
                    date.hour(8).minute(0).second(0),
                    endDate,
                ],
            });
        }
    };

    // Nếu tourDetail không hợp lệ, không hiển thị modal
    if (!tourDetail || !tourDetail.id) {
        return null;
    }

    return (
        <Modal
            title="Chỉnh sửa chi tiết tour"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    label={
                        <span className={'font-semibold text-black uppercase'}>
                            Giá người lớn - Giá trẻ em (30% giá người lớn)
                        </span>
                    }
                >
                    <div className={'grid grid-cols-2 gap-2 w-full'}>
                        <Form.Item
                            name="priceAdults"
                            rules={[{ required: true, message: 'Vui lòng nhập giá người lớn!' }]}
                            noStyle
                        >
                            <InputNumber
                                placeholder={'Giá người lớn'}
                                allowClear
                                formatter={(e) => `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className={'w-full'}
                                suffix={'VND'}
                                min={0}
                                onChange={handlePriceAdultsChange}
                            />
                        </Form.Item>
                        <Form.Item name="priceChildren" noStyle>
                            <InputNumber
                                placeholder={'Giá trẻ em'}
                                allowClear
                                formatter={(e) => `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className={'w-full'}
                                suffix={'VND'}
                                min={0}
                                disabled
                            />
                        </Form.Item>
                    </div>
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="hotelId"
                        label={<span className={'font-semibold text-black uppercase'}>Khách sạn</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn khách sạn!' }]}
                    >
                        <Select
                            showSearch
                            options={hotels.map((hotel) => ({
                                id: hotel.id,
                                name: `${hotel.name} - ${config.webConfig.getCurrency(hotel.cost)}`,
                            }))}
                            optionFilterProp={'name'}
                            fieldNames={{ value: 'id', label: 'name' }}
                            placeholder={'Chọn khách sạn'}
                        />
                    </Form.Item>

                    <Form.Item
                        name="transportId"
                        label={<span className={'font-semibold text-black uppercase'}>Phương tiện</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn phương tiện!' }]}
                    >
                        <Select
                            showSearch
                            options={transports.map((transport) => ({
                                id: transport.id,
                                name: `${transport.name} - ${config.webConfig.getCurrency(transport.cost)}`,
                            }))}
                            optionFilterProp={'name'}
                            fieldNames={{ value: 'id', label: 'name' }}
                            placeholder={'Chọn phương tiện'}
                        />
                    </Form.Item>
                </div>

                <p className={'font-semibold text-black uppercase'}>
                    Thời gian tour ({tourDetail.duration} ngày)
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Ngày bắt đầu"
                            className="w-full"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            onChange={(date) => {
                                if (date && tourDetail.duration) {
                                    const endDate = dayjs(date)
                                        .add(tourDetail.duration - 1, 'day')
                                        .hour(20)
                                        .minute(0)
                                        .second(0);
                                    form.setFieldsValue({
                                        startDate: date.hour(8).minute(0).second(0),
                                        endDate,
                                    });
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="Ngày kết thúc"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Ngày kết thúc"
                            className="w-full"
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                    >
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="active"
                    label="Trạng thái">
                    <Select
                        showSearch
                        options={[
                            { id: true, name: 'Đang hoạt động' },
                            { id: false, name: 'Ngừng hoạt động' },
                        ]}
                        optionFilterProp={'name'}
                        fieldNames={{ value: 'id', label: 'name' }}
                        placeholder={'Chọn trạng thái'} />
                </Form.Item>

                <Form.Item
                    name="guideId"
                    label={<span className={'font-semibold text-black uppercase'}>Hướng dẫn viên</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn hướng dẫn viên!' }]}
                >
                    <Select
                        showSearch
                        allowClear
                        options={guides.map((guide) => ({
                            id: guide.id,
                            name: `${guide.firstName} ${guide.lastName} - ${guide.phone}`,
                        }))}
                        optionFilterProp={'name'}
                        fieldNames={{ value: 'id', label: 'name' }}
                        placeholder={'Chọn hướng dẫn viên'}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={() => setVisible(false)}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};