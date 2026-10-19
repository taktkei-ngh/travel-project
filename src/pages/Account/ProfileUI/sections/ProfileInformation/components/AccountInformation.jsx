import { DatePicker, Form, Input, message, Radio, Select, Spin, Upload, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import config from '~/config';
import WebServices from '~/services/WebServices';
import moment from 'moment';
import UserServices from '~/services/UserServices';

const { Option } = Select;
const { confirm } = Modal;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        return false; // Sửa lại để ngăn upload file không hợp lệ
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return false;
    }
    return true;
};

export const AccountInformation = ({ data, onUserUpdate, switchTab, setParentLoading }) => {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState(data?.avatar || null);
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [imageLoading, setImageLoading] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await WebServices.getProvinces();
                setProvinces(response);
            } catch (error) {
                message.error('Không thể tải danh sách tỉnh/thành phố!');
                console.error(error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            username: data?.username || '',
            fullName: data?.firstName && data?.lastName ? `${data.firstName} ${data.lastName}` : '',
            gender: data?.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
            birthday: data?.birthday ? moment(data.birthday) : null,
            email: data?.email || '',
            phone: data?.phone || '',
            city: data?.address ? data.address.split(', ')[4] : '',
            district: data?.address ? data.address.split(', ')[3] : '',
            ward: data?.address ? data.address.split(', ')[2] : '',
            address: data?.address ? data.address.split(', ').slice(0, 2).join(', ') : '',
        });
        if (data?.avatar) {
            setAvatar(data.avatar);
            setFileList([{ uid: '-1', url: data.avatar, status: 'done' }]);
        } else {
            setFileList([]);
        }
    }, [data, form]);

    const handleValuesChange = () => {
        setFormChanged(true);
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (formChanged) {
                e.preventDefault();
                e.returnValue = 'Bạn có thay đổi chưa lưu, bạn có chắc muốn rời khỏi trang?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formChanged]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setImageLoading(true); // Bật loading khi chọn file
        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            getBase64(newFileList[0].originFileObj, (url) => {
                setImageLoading(false); // Tắt loading sau khi có base64
                setAvatar(url);
                setFormChanged(true);
            });
        } else if (newFileList.length === 0) {
            setAvatar(data?.avatar || null);
            setImageLoading(false);
            setFormChanged(true);
        }
    };

    const handleProvinceChange = (value) => {
        const selected = provinces.find((province) => province.name === value);
        setSelectedProvince(selected);
        setDistricts(selected?.districts || []);
        setWards([]);
        setSelectedDistrict(null);
        form.setFieldsValue({ district: null, ward: null });
    };

    const handleDistrictChange = (value) => {
        const selected = districts.find((district) => district.name === value);
        setSelectedDistrict(selected);
        setWards(selected?.wards || []);
        form.setFieldsValue({ ward: null });
    };

    const handleSave = async (values) => {
        try {
            setLoading(true);
            setParentLoading(true);
            const formData = new FormData();

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('avatar', fileList[0].originFileObj);
            }

            const fullName = values.fullName || '';
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';
            const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : '';

            const fullAddress = values.city && values.district && values.ward
                ? `${values.address}, ${values.ward}, ${values.district}, ${values.city}`
                : values.address || '';

            formData.append('username', values.username);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', values.email);
            formData.append('phone', values.phone || '');
            formData.append('address', fullAddress);
            formData.append('gender', values.gender);
            formData.append('birthday', values.birthday ? values.birthday.format('YYYY-MM-DD') : '');

            const response = await UserServices.updateUser(formData);

            const updatedUser = {
                ...data,
                username: values.username,
                firstName: firstName,
                lastName: lastName,
                email: values.email,
                phone: values.phone || '',
                address: fullAddress,
                gender: values.gender,
                birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
                avatar: response.avatar || avatar,
            };

            onUserUpdate(updatedUser);
            message.success('Lưu thay đổi thành công!', 1.5);
            setFormChanged(false);
            switchTab('1');
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Lưu thay đổi thất bại!', 1.5);
        } finally {
            setLoading(false);
            setParentLoading(false);
        }
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            // Kiểm tra nếu username thay đổi
            if (values.username !== data?.username) {
                confirm({
                    centered: true,
                    title: 'Xác nhận thay đổi username',
                    content: 'Bạn sẽ chỉ có thể thay đổi username sau 7 ngày kể từ lần thay đổi này. Bạn có chắc chắn muốn tiếp tục?',
                    okText: 'Xác nhận',
                    cancelText: 'Hủy',
                    onOk() {
                        handleSave(values); // Gọi handleSave nếu xác nhận
                    },
                    onCancel() {
                        message.info('Thay đổi username đã bị hủy.');
                    },
                });
            } else {
                handleSave(values); // Nếu không thay đổi username, lưu luôn
            }
        }).catch((error) => {
            console.error('Validation failed:', error);
        });
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500">
            {imageLoading ? <LoadingOutlined className="text-xl" /> : <PlusOutlined className="text-xl" />}
            <div className="mt-2 text-sm">Tải ảnh lên</div>
        </div>
    );

    return (
        <div className="p-2 sm:p-4">
            <div className="bg-white max-w-full sm:max-w-3xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Thông tin tài khoản</h2>
                <Form form={form} onValuesChange={handleValuesChange} onFinish={handleSubmit} layout="vertical">
                    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            maxCount={1}
                        >
                            {fileList.length === 0 && (
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    {imageLoading ? <LoadingOutlined className="text-lg sm:text-xl" /> :
                                        <PlusOutlined className="text-lg sm:text-xl" />}
                                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm">Tải ảnh lên</div>
                                </div>
                            )}
                        </Upload>
                        <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Form.Item
                                    name="username"
                                    label={<span
                                        className="text-xs sm:text-sm font-medium text-gray-700">Tên người dùng</span>}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                                >
                                    <Input
                                        placeholder="Nhập tên người dùng"
                                        className="w-full rounded-lg border-gray-300 text-sm sm:text-base"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="fullName"
                                    label={<span
                                        className="text-xs sm:text-sm font-medium text-gray-700">Họ và tên</span>}
                                >
                                    <Input
                                        placeholder="Nhập họ và tên"
                                        className="w-full rounded-lg border-gray-300 text-sm sm:text-base"
                                    />
                                </Form.Item>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Form.Item
                                    name="birthday"
                                    label={<span
                                        className="text-xs sm:text-sm font-medium text-gray-700">Ngày sinh</span>}
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng chọn ngày sinh!',
                                    } /* validator giữ nguyên */]}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        className="w-full rounded-lg border-gray-300 text-sm sm:text-base"
                                        placeholder="Chọn ngày sinh"
                                        disabledDate={(current) => current && current > moment().endOf('day')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="gender"
                                    label={<span
                                        className="text-xs sm:text-sm font-medium text-gray-700">Giới tính</span>}
                                >
                                    <Radio.Group className="flex gap-2">
                                        <Radio value="MALE">Nam</Radio>
                                        <Radio value="FEMALE">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
                        <div className="flex flex-col">
                            <Form.Item
                                name="email"
                                label={<span
                                    className="text-xs sm:text-sm font-medium text-gray-700">Tài khoản Email</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }, {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                }]}
                            >
                                <Input
                                    disabled={data?.emailVerified}
                                    placeholder="Nhập email"
                                    className="w-full rounded-lg border-gray-300 text-sm sm:text-base"
                                />
                            </Form.Item>
                            {/* Trạng thái xác thực giữ nguyên */}
                            {data?.emailVerified && (
                                <div className="text-green-500 w-fit p-2 -mt-4 bg-green-50 rounded-lg text-sm">
                                    <p className={'font-medium text-green-600'}>Email đã được xác thực</p>
                                </div>
                            )}
                            {!data?.emailVerified && (
                                <button
                                    onClick={() => {
                                        switchTab('2')
                                        setParentLoading(false)
                                    }}
                                    className={'w-fit p-2 -mt-4 bg-red-200 transition-all text-red-600 hover:text-white hover:bg-red-600 rounded-lg text-sm'}
                                >
                                    <p className={'font-medium'}>Xác thực ngay!</p>
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <Form.Item
                                name="phone"
                                label={<span
                                    className="text-xs sm:text-sm font-medium text-gray-700">Số điện thoại</span>}
                                rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }]}
                            >
                                <Input
                                    disabled={data?.phoneVerified}
                                    placeholder="Nhập số điện thoại"
                                    className="w-full rounded-lg border-gray-300 text-sm sm:text-base"
                                />
                            </Form.Item>
                            {data?.phoneVerified && (
                                <div className="text-green-500 w-fit p-2 -mt-4 bg-green-50 rounded-lg text-sm">
                                    <p className={'font-medium text-green-600'}>Số điện thoại đã được xác thực</p>
                                </div>
                            )}
                            {!data?.phoneVerified && (
                                <button
                                    onClick={() => switchTab('2')}
                                    className={'w-fit p-2 -mt-4 bg-red-200 transition-all text-red-600 hover:text-white hover:bg-red-600 rounded-lg text-sm'}
                                >
                                    <p className={'font-medium'}>Xác thực ngay!</p>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Vị trí</label>
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
                            <Form.Item name="city">
                                <Select
                                    className="w-full text-sm sm:text-base"
                                    placeholder="Chọn tỉnh/thành phố"
                                    dropdownClassName="rounded-lg"
                                    onChange={handleProvinceChange}
                                    loading={!provinces || provinces.length === 0}
                                >
                                    {provinces && provinces.map((province) => (
                                        <Option key={province.code} value={province.name}>
                                            {province.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="district">
                                <Select
                                    className="w-full text-sm sm:text-base"
                                    placeholder="Chọn quận/huyện"
                                    dropdownClassName="rounded-lg"
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                >
                                    {districts && districts.map((district) => (
                                        <Option key={district.code} value={district.name}>
                                            {district.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="ward">
                                <Select
                                    className="w-full text-sm sm:text-base"
                                    placeholder="Chọn phường/xã"
                                    dropdownClassName="rounded-lg"
                                    disabled={!selectedDistrict}
                                >
                                    {wards && wards.map((ward) => (
                                        <Option key={ward.code} value={ward.name}>
                                            {ward.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input
                                    placeholder="Nhập địa chỉ cụ thể"
                                    className="w-full rounded-lg border-gray-300 text-sm sm:text-base"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Spin spinning={loading}>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-green-600 transition-all duration-300"
                                disabled={loading}
                            >
                                Lưu thay đổi
                            </button>
                        </Spin>
                    </div>
                </Form>
            </div>
        </div>);
};