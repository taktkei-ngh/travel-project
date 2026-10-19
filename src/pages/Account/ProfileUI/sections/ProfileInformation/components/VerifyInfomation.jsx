import { Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaLock } from 'react-icons/fa';
import AuthServices from '~/services/AuthServices';

export const VerifyInformation = ({ data, onUserUpdate }) => {
    const [form] = Form.useForm();
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [emailOtpCooldown, setEmailOtpCooldown] = useState(0);
    const [phoneOtp, setPhoneOtp] = useState('');
    const [userData, setUserData] = useState(data); // State để lưu userData và cập nhật sau khi xác minh

    // Cập nhật userData khi data thay đổi
    useEffect(() => {
        setUserData(data);
        form.setFieldsValue({
            email: data?.email || '',
            phone: data?.phone || '',
        });
    }, [data, form]);

    // Giả lập API gửi mã OTP
    const sendOtp = async (type) => {
        try {
            console.log(data.email);

            if (type === 'email') {
                await AuthServices.sendMailVerify(data.email);
                message.success(`Mã OTP đã được gửi đến ${type === 'email' ? 'email' : 'số điện thoại'} của bạn!`, 1.5);
                setIsEmailOtpSent(true);
                setEmailOtpCooldown(60);
            } else {
                setIsPhoneOtpSent(true);
            }
        } catch (error) {
            message.error('Gửi mã OTP thất bại!', 1.5);
        }
    };

    useEffect(() => {
        if (emailOtpCooldown > 0) {
            const timer = setTimeout(() => setEmailOtpCooldown(emailOtpCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [emailOtpCooldown]);
    // Giả lập API xác minh OTP
    const verifyOtp = async (type, otp) => {

        try {
            // Reset trạng thái OTP
            if (type === 'email') {
                await AuthServices.verifyEmail({
                    email: data.email,
                    otp: otp,
                });
                message.success(`${type === 'email' ? 'Email' : 'Số điện thoại'} đã được xác minh thành công!`, 1.5);
                setIsEmailOtpSent(false);
                setEmailOtp('');
            } else {
                setIsPhoneOtpSent(false);
                setPhoneOtp('');
            }
        } catch (error) {
            message.error('Xác minh OTP thất bại!', 1.5);
        }
    };

    // Xử lý gửi mã OTP
    const handleSendOtp = (type) => {
        sendOtp(type);
    };

    // Xử lý xác minh OTP
    const handleVerifyOtp = (type) => {
        const otp = type === 'email' ? emailOtp : phoneOtp;
        if (!otp) {
            message.error('Vui lòng nhập mã OTP!', 1.5);
            return;
        }
        verifyOtp(type, otp);
    };

    // Xử lý lưu thay đổi (nếu cần)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // Gọi API thực tế để lưu thay đổi (nếu cần)
            message.success('Lưu thay đổi thành công!', 1.5);
        } catch (error) {
            message.error('Lưu thay đổi thất bại!', 1.5);
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white max-w-3xl p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Xác thực thông tin</h2>

                <Form form={form} onFinish={handleSave} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Trường Email */}
                        <div>
                            <Form.Item
                                name="email"
                                label={<span className="text-sm font-medium text-gray-700">Tài khoản Email</span>}
                            >
                                <Input
                                    placeholder="Nhập email"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                    disabled
                                />
                            </Form.Item>
                            {userData?.emailVerified ? (
                                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                                    <FaCheckCircle className="text-xl" />
                                    <span>Đã xác minh</span>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    {isEmailOtpSent ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                prefix={<FaLock className="text-gray-400" />}
                                                placeholder="Nhập mã OTP"
                                                value={emailOtp}
                                                onChange={(e) => setEmailOtp(e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                            />
                                            <button
                                                onClick={() => handleVerifyOtp('email')}
                                                className="bg-orange-500 text-white hover:bg-orange-600 border-none rounded-lg px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Xác nhận OTP
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSendOtp('email')}
                                            disabled={emailOtpCooldown > 0}
                                            className="bg-orange-500 text-white hover:bg-orange-600 border-none rounded-lg px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            {emailOtpCooldown > 0 ? `Gửi lại sau ${emailOtpCooldown}s` : 'Xác minh'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Trường Số điện thoại */}
                        <div>
                            <Form.Item
                                name="phone"
                                label={<span className="text-sm font-medium text-gray-700">Số điện thoại</span>}
                            >
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                    disabled
                                />
                            </Form.Item>
                            {userData?.phoneVerified ? (
                                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                                    <FaCheckCircle className="text-xl" />
                                    <span>Đã xác minh</span>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    {isPhoneOtpSent ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Nhập mã OTP"
                                                value={phoneOtp}
                                                onChange={(e) => setPhoneOtp(e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                            />
                                            <button
                                                onClick={() => handleVerifyOtp('phone')}
                                                className="bg-orange-500 text-white hover:bg-orange-600 border-none rounded-lg px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Xác nhận OTP
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSendOtp('phone')}
                                            className="bg-orange-500 text-white hover:bg-orange-600 border-none rounded-lg px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Xác minh
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};