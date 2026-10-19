import React, { useState } from 'react';
import { Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import anhBien from '~/pages/Account/imgAC/anh-bien.jpg';
import logo from '~/pages/Account/imgAC/logo.jpg';
import AuthServices from '~/services/AuthServices';

export const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            message.error('Vui lòng nhập email đã đăng ký', 1);
            return;
        }

        setLoading(true);
        try {
            await AuthServices.sendVerifyEmailPass(email);
            notification.success({
                message: 'Gửi mã xác nhận thành công',
                description: `Mã xác nhận đã được gửi đến email của bạn: ${email}`,
                placement: 'top',
            });
            setShowResetForm(true);
        } catch (err) {
            notification.error({
                message: 'Email không tồn tại hoặc không đúng',
                description: err.message,
                placement: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp', 1);
            return;
        }
        const verify = await AuthServices.verifyEmailPass(email, verificationCode);
        if (!verify) {
            message.error('Mã xác nhận không chính xác', 1);
            return;
        }
        await AuthServices.resetPassword(email,newPassword, confirmPassword);
        message.success('Đổi mật khẩu thành công!', 1);
        navigate(config.routes.login);
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${anhBien})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-5"></div>

            <div
                className="relative z-10 container mx-auto flex items-center justify-center min-h-screen px-8 md:px-16 space-x-6">
                <div
                    className="w-full max-w-md bg-black bg-opacity-50 p-20 rounded-lg text-white translate-x-6 flex flex-col justify-center h-full">
                    <h1 className="text-3xl text-orange-500 font-bold mb-4">Về chúng tôi</h1>
                    <p className="text-lg mb-6">Hãy làm cho chuyến đi của bạn trở nên đáng nhớ và an toàn cùng chúng
                        tôi.</p>
                    <div className="border-t border-white w-16 mt-4"></div>
                </div>

                <div
                    className="w-full max-w-md bg-white p-12 rounded-lg shadow-lg text-center h-full flex flex-col justify-center">
                    <img src={logo} alt="Logo" className="mx-auto mb-4" />
                    {showResetForm ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">Đổi mật khẩu mới</h2>
                            <p className="text-orange-500 mb-4">Điền mã vừa mới gửi tới email của bạn</p>
                            <Form layout="vertical">
                                <Form.Item>
                                    <Input placeholder="Mã Xác Thực"
                                           onChange={(e) => setVerificationCode(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <Input type="password" placeholder="Mật Khẩu Mới"
                                           onChange={(e) => setNewPassword(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <Input type="password" placeholder="Xác Nhận Mật Khẩu Mới"
                                           onChange={(e) => setConfirmPassword(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <button onClick={handleResetPassword}
                                            className="px-6 py-2 w-full bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition duration-200">
                                        Xác Nhận
                                    </button>
                                </Form.Item>
                            </Form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">Quên mật khẩu</h2>
                            <Form layout="vertical">
                                <Form.Item>
                                    <Input placeholder="Nhập email" onChange={(e) => setEmail(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <button onClick={handleSubmit}
                                            className="px-6 py-2 w-full bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition duration-200">
                                        {loading ? 'Đang gửi...' : 'Nhận Mã Xác Nhận'}
                                    </button>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                    <div className="text-center mt-4">
                        <Link to={config.routes.login} className="text-black-500 hover:text-orange-400 font-semibold">
                            Quay Lại ? <span className="underline">Đăng nhập</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
