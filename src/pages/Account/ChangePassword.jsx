import Iridescence from '~/component/Animation/AnimatedUI/Background/Iridescence';
import { Divider, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '~/config/AuthContext';
import AuthServices from '~/services/AuthServices';

export const ChangePassword = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Tạo instance của Form

    const handleChangePassword = async (values) => {
        const { oldPassword, password, confirmPassword } = values;

        // Validation
        if (!oldPassword) {
            message.warning('Mật khẩu cũ không được để trống', 2);
            return;
        }
        if (password === currentUser.password) {
            message.warning('Mật khẩu mới không được giống mật khẩu cũ', 2);
            return;
        }
        if (oldPassword !== currentUser.password) {
            message.warning('Mật khẩu cũ không đúng', 2);
            return;
        }
        try {
            await AuthServices.resetPassword({
                email: currentUser.email,
                newPassword: password,
                confirmPassword: confirmPassword,
            });
            message.success('Đổi mật khẩu thành công', 1);
            navigate(config.routes.profile);
        } catch (error) {
            message.error('Đổi mật khẩu thất bại', 1);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Iridescence
                color={[1, 1, 1]}
                mouseReact={false}
                amplitude={0.1}
                speed={1.0}
                className="absolute inset-0 z-0"
            />
            <div className="bg-white relative p-8 rounded-lg shadow-lg w-full uppercase max-w-md border">
                <h2 className="text-2xl font-bold mb-2 text-center text-orange-400">Đổi mật khẩu</h2>
                <Divider />
                <Form
                    form={form}
                    onFinish={handleChangePassword}
                    className="space-y-4"
                    layout="vertical"
                >
                    <Form.Item>
                        <label className="block text-sm font-medium">Tên tài khoản</label>
                        <Input value={currentUser?.username} disabled />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium">EMAIL ĐANG SỬ DỤNG</label>
                            <a className="text-sm text-blue-500">Email không đúng?</a>
                        </div>
                        <Input value={currentUser?.email} disabled />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            {min: 6, message: 'Mật khẩu phải dài hơn 6 ký tự!'}]}>
                        <Input.Password
                            placeholder="Mật khẩu"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <div className="justify-center flex items-center gap-2">
                        <p className="text-sm font-medium">Không phải bạn? {' '}</p>
                        <Link to="#" className="text-red-500">Báo cáo!</Link>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 w-1/2 bg-black text-white rounded-md font-semibold hover:bg-gray-800"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};