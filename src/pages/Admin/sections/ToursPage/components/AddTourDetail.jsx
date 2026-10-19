import { DatePicker, Divider, Input, InputNumber, message, Modal, Select, Form, Button, Space } from 'antd';
import { useEffect, useCallback, useState } from 'react';
import HotelServices from '~/services/HotelServices';
import TransportServices from '~/services/TransportServices';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import TourDetailServices from '~/services/TourDetailServices';
import GuideServices from '~/services/GuideServices';
import config from '~/config';

const { RangePicker } = DatePicker;
dayjs.extend(isBetween);
export const AddTourDetail = ({
                                  tour,
                                  visible,
                                  setVisible,
                                  hotels,
                                  transports,
                                  guides,
                                  loading,
                                  setLoading,
                                  onSuccess,
                              }) => {
    const [form] = Form.useForm();

    // Xử lý submit form
    const handleAddTourDetail = async (values) => {
        const [startDate, endDate] = values.dateRange || [];

        if (!startDate || !endDate) {
            message.error('Vui lòng chọn đầy đủ ngày và giờ bắt đầu, kết thúc!');
            return;
        }

        // Kiểm tra duration hợp lệ
        const daysDiff = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
        if (daysDiff !== tour?.duration) {
            message.error(`Khoảng cách ngày phải đúng ${tour?.duration} ngày!`);
            return;
        }

        const data = {
            startDate: startDate,
            endDate: endDate,
            priceAdults: values.priceAdults,
            priceChildren: values.priceChildren,
            quantity: values.quantity,
            tourId: tour?.id,
            guideId: values.guideId,
            hotelId: values.hotelId,
            transportId: values.transportId,
        };

        try {
            setLoading(true);
            await TourDetailServices.addTourDetail(data);
            message.success('Thêm chi tiết tour thành công', 1);
            setVisible(false);
            form.resetFields();
            onSuccess();
        } catch (error) {
            message.error('Thêm chi tiết tour thất bại: ' + (error.message || 'Có lỗi xảy ra'), 1);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi giá người lớn để tự động tính giá trẻ em
    const handlePriceAdultsChange = (value) => {
        form.setFieldsValue({ priceChildren: value * 0.3 });
    };

    return (
        <Modal
            width={800}
            title={'Thêm chi tiết tour'}
            open={visible}
            onCancel={() => {
                form.resetFields();
                setVisible(false);
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAddTourDetail}
                initialValues={{ priceChildren: 0 }}
            >
                <div className={'p-4 space-y-2 w-full'}>
                    <div className={'flex flex-col justify-center mx-auto p-2'}>
                        <label className={'font-semibold text-black uppercase'}>Mã tour</label>
                        <Input
                            value={tour?.id}
                            disabled
                            rootClassName={'font-bold text-xl text-center w-fit-content'}
                        />
                    </div>
                    <div className={'p-2 grid grid-cols-2 gap-4'}>
                        <Form.Item
                            label={
                                <span className={'font-semibold text-black uppercase'}>
                                    Ngày bắt đầu - Ngày kết thúc
                                </span>
                            }>
                            <div className="space-y-2">
                                <span className={'text-red-500 block'}>
                                    Số ngày: {tour?.duration}
                                </span>
                                <div className={'flex flex-wrap gap-2'}>
                                    <Form.Item
                                        name={['dateRange', 0]}
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                                        className="mb-0"
                                    >
                                        <DatePicker
                                            showTime={{ format: 'HH:mm' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="Ngày bắt đầu"
                                            className="w-[220px]"
                                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                                            onChange={(date) => {
                                                if (date && tour?.duration) {
                                                    const endDate = dayjs(date)
                                                        .add(tour.duration - 1, 'day')
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
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={['dateRange', 1]}
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                                        className="mb-0"
                                    >
                                        <DatePicker
                                            showTime={{ format: 'HH:mm' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="Ngày kết thúc"
                                            className="w-[220px]"
                                            disabled={true} // Không cho phép chọn ngày kết thúc thủ công
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Form.Item>
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

                        <Form.Item
                            name="quantity"
                            label={<span className={'font-semibold text-black uppercase'}>Số lượng tour</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng tour!' }]}
                        >
                            <InputNumber
                                className={'w-full'}
                                min={0}
                                placeholder={'Số lượng tour'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="guideId"
                            label={<span className={'font-semibold text-black uppercase'}>Hướng dẫn viên</span>}
                            rules={[{ required: true, message: 'Vui lòng chọn hướng dẫn viên!' }]}
                        >
                            <Select
                                showSearch
                                options={guides.map((guide) => ({
                                    id: guide.id,
                                    name: `${guide.firstName} ${guide.lastName}`,
                                }))}
                                optionFilterProp={'name'}
                                fieldNames={{ value: 'id', label: 'name' }}
                                placeholder={'Chọn hướng dẫn viên'}
                            />
                        </Form.Item>

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

                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setVisible(false);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};