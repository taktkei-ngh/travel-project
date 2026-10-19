import { Button, Form, Input, InputNumber, Modal, Select, Switch, DatePicker, Space, message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';

const { Option } = Select;

export const AddEditVoucherModal = ({
                                 open,
                                 onCancel,
                                 onSubmit,
                                 loading,
                                 categories,
                                 tours,
                                 initialValues,
                                 isEditMode,
                             }) => {
    const [form] = Form.useForm();

    // Điền dữ liệu ban đầu khi chỉnh sửa
    useEffect(() => {
        if (initialValues && isEditMode) {
            form.setFieldsValue({
                title: initialValues.title || '',
                codeVoucher: initialValues.codeVoucher || '',
                discountValue: initialValues.discountValue || 0,
                quantity: initialValues.quantity || 0,
                userLimit: initialValues.userLimit || 0,
                minOrderValue: initialValues.minOrderValue || 0,
                maxDiscountAmount: initialValues.maxDiscountAmount || 0,
                firstTimeUserOnly: initialValues.firstTimeUserOnly || false,
                status: initialValues.status || 'ACTIVE',
                startDate: initialValues.startDate ? moment(initialValues.startDate) : null,
                endDate: initialValues.endDate ? moment(initialValues.endDate) : null,
                applyTo: initialValues.applyTo || 'ALL',
                tourId: initialValues.tourId || null,
                categoryId: initialValues.categoryId || null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, isEditMode, form]);

    const handleSubmit = async (values) => {
        // Kiểm tra startDate và endDate
        if (values.startDate && values.endDate && values.startDate.isAfter(values.endDate)) {
            message.error('Thời gian bắt đầu không thể lớn hơn thời gian kết thúc!');
            return;
        }

        try {
            await onSubmit({
                title: values.title || '',
                codeVoucher: values.codeVoucher || '',
                discountValue: values.discountValue || 0,
                quantity: values.quantity || 0,
                userLimit: values.userLimit || 0,
                minOrderValue: values.minOrderValue || 0,
                maxDiscountAmount: values.maxDiscountAmount || 0,
                firstTimeUserOnly: values.firstTimeUserOnly || false,
                status: values.status || 'ACTIVE',
                startDate: values.startDate ? values.startDate.format('YYYY-MM-DDTHH:mm:ss') : null,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DDTHH:mm:ss') : null,
                applyTo: values.applyTo || 'ALL',
                tourId: values.tourId || null,
                categoryId: values.categoryId || null,
            });
            form.resetFields();
        } catch (error) {
            message.error(`Có lỗi xảy ra khi ${isEditMode ? 'cập nhật' : 'thêm'} voucher!`);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title={
                <span className="text-lg font-semibold text-gray-800">
          {isEditMode ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
        </span>
            }
            footer={null}
            width={900}
            className="rounded-lg shadow-lg"
            bodyStyle={{ padding: '24px', background: '#ffffff' }}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Tên voucher</span>}
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}
                    >
                        <Input placeholder="Nhập tên voucher" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Mã voucher</span>}
                        name="codeVoucher"
                        rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
                    >
                        <Input placeholder="Nhập mã voucher" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Giá trị giảm giá (%)</span>}
                        name="discountValue"
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}
                    >
                        <InputNumber min={0} max={100} className="w-full rounded-md" placeholder="0-100" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Số lượng</span>}
                        name="quantity"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                    >
                        <InputNumber min={0} className="w-full rounded-md" placeholder="Nhập số lượng" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Giới hạn sử dụng mỗi người</span>}
                        name="userLimit"
                        rules={[{ required: true, message: 'Vui lòng nhập giới hạn sử dụng!' }]}
                    >
                        <InputNumber min={0} className="w-full rounded-md" placeholder="Nhập giới hạn sử dụng" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Giá trị đơn hàng tối thiểu (VNĐ)</span>}
                        name="minOrderValue"
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu!' }]}
                    >
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                            className="w-full rounded-md"
                            placeholder="Nhập giá trị tối thiểu"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Số tiền giảm tối đa (VNĐ)</span>}
                        name="maxDiscountAmount"
                        rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm tối đa!' }]}
                    >
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                            className="w-full rounded-md"
                            placeholder="Nhập số tiền giảm tối đa"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Thời gian bắt đầu</span>}
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full rounded-md" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Thời gian kết thúc</span>}
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full rounded-md" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Chỉ áp dụng cho người dùng lần đầu</span>}
                        name="firstTimeUserOnly"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Trạng thái</span>}
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái" className="rounded-md">
                            <Option value="ACTIVE">Hoạt động</Option>
                            <Option value="INACTIVE">Không hoạt động</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-700 font-medium">Áp dụng cho</span>}
                        name="applyTo"
                        rules={[{ required: true, message: 'Vui lòng chọn đối tượng áp dụng!' }]}
                    >
                        <Select placeholder="Chọn đối tượng áp dụng" className="rounded-md">
                            <Option value="ALL">Tất cả</Option>
                            <Option value="TOUR">Tour cụ thể</Option>
                            <Option value="CATEGORY">Danh mục cụ thể</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.applyTo !== currentValues.applyTo}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('applyTo') === 'TOUR' ? (
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">ID Tour</span>}
                                    name="tourId"
                                    rules={[{ required: true, message: 'Vui lòng chọn ID tour!' }]}
                                    className="col-span-2"
                                >
                                    <Select
                                        placeholder="Chọn ID tour"
                                        loading={tours.length === 0}
                                        className="rounded-md"
                                        options={tours.map((tour) => ({
                                            value: tour.id,
                                            label: tour.title,
                                        }))}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            ) : getFieldValue('applyTo') === 'CATEGORY' ? (
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Danh mục</span>}
                                    name="categoryId"
                                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    className="col-span-2"
                                >
                                    <Select
                                        placeholder="Chọn danh mục"
                                        loading={categories.length === 0}
                                        className="rounded-md"
                                        options={categories.map((category) => ({
                                            value: category.id,
                                            label: category.title,
                                        }))}
                                    />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </div>

                <Form.Item className="mt-8">
                    <Space className="flex justify-end">
                        <Button onClick={onCancel} className="rounded-md border-gray-300">
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} className="rounded-md">
                            {isEditMode ? 'Cập nhật voucher' : 'Thêm voucher'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};