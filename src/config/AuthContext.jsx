import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthService from '~/services/AuthServices';
import AuthServices from '~/services/AuthServices';
import { Button, Form, Input, message, Modal } from 'antd';
import WishlistServices from '~/services/WishlistServices';
import PaymentServices from '~/services/PaymentServices';
import config from '~/config/index';
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';
import { GoSignOut } from 'react-icons/go';
import VoucherServices from '~/services/VoucherServices';

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [paymentHistory, setPaymentHistory] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const wishlistMap = useMemo(() => new Map(wishlist.map(item => [item.tourId, item])), [wishlist]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
	const [vouchers, setVouchers] = useState([]);

	const [role, setRole] = useState(null);
	const token = localStorage.getItem('accessToken');

	const checkVoucherStartDate = useCallback(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const hasShownNotification = localStorage.getItem('voucherNotificationShown');
		const lastShownDate = localStorage.getItem('voucherNotificationDate');
		if (hasShownNotification && lastShownDate === today.toISOString().split('T')[0]) {
			return;
		}
		const hasActiveVoucher = vouchers.some((voucher) => {
			const startDate = new Date(voucher.start_date);
			const endDate = new Date(voucher.end_date);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(0, 0, 0, 0);

			return today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime();
		});
		if (hasActiveVoucher) {
			message.info('Pacific có quà tặng bạn nhé! Hãy kiểm tra thông báo!');
			// Lưu trạng thái đã hiển thị và ngày hiển thị
			localStorage.setItem('voucherNotificationShown', 'true');
			localStorage.setItem('voucherNotificationDate', today.toISOString().split('T')[0]);
		}
	}, [vouchers]);

	const getUser = useCallback(async (token) => {
		try {
			const res = await AuthService.authToken(token);
			setCurrentUser(res?.data);
			setRole(res?.data.role);
			if (res?.data?.status === 'REQUIRE_USERNAME_PASSWORD_CHANGE') {
				setIsPasswordModalVisible(true);
			}
			setLoading(false);
		} catch (err) {
			console.error(err);
			if (err.response?.status === 401) {
				localStorage.removeItem('accessToken');
			}
			setCurrentUser(null);
			setRole(null);
			setLoading(false);
			throw err;
		}
	}, [setCurrentUser, setRole]);

	const getVouchers = useCallback(async () => {
		try {
			const res = await VoucherServices.getAllVouchers();
			const activeVouchers = res?.data?.filter((voucher) => voucher.status === 'ACTIVE');
			setVouchers(activeVouchers);
		} catch (err) {
			console.error(err);
		}
	}, []);

	const getPaymentHistory = useCallback(async () => {
		try {
			const res = await PaymentServices.getHistoryPayments(token);
			setPaymentHistory(res?.data);
		} catch (err) {
			console.error(err);
		}
	}, [token]);

	const getWishlist = useCallback(async () => {
		try {
			const res = await WishlistServices.getWishlist(token);
			setWishlist(res?.data);
		} catch (err) {
			console.error(err);
		}
	}, [token]);

	// Gọi hàm kiểm tra startDate mỗi khi vouchers thay đổi hoặc mỗi ngày
	useEffect(() => {
		checkVoucherStartDate(); // Kiểm tra ngay khi vouchers được cập nhật

		// Thiết lập interval để kiểm tra mỗi ngày (vào lúc 00:00)
		const interval = setInterval(() => {
			checkVoucherStartDate();
		}, 24 * 60 * 60 * 1000); // 24 giờ

		return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
	}, [checkVoucherStartDate]);

	useEffect(() => {
		if (token) {
			getUser(token).then(() => {
				getWishlist();
				getPaymentHistory();
				getVouchers();
			}).catch((err) => {
				console.error(err);
				setLoading(false);
			});
		} else {
			setLoading(false);
		}
	}, [token, getUser, getWishlist, getPaymentHistory, getVouchers]);

	const handleAddToWishlist = async (id) => {
		if (!token) {
			setIsModalVisible(true);
			return;
		}

		const existingItem = wishlistMap.get(id);

		if (existingItem) {
			setWishlist(prev => prev.filter(item => item.id !== existingItem.id)); // Optimistic update
			try {
				await WishlistServices.removeWishlist(existingItem.id, token);
				message.success('Đã xóa khỏi danh sách yêu thích');
			} catch (err) {
				setWishlist(prev => [...prev, existingItem]); // Rollback
				console.error('Error removing from wishlist:', err);
				message.error('Đã xảy ra lỗi khi xóa, vui lòng thử lại');
			}
		} else {
			const tempItem = { tourId: id, id: `temp-${id}` };
			setWishlist(prev => [...prev, tempItem]); // Optimistic update
			try {
				const res = await WishlistServices.AddToWishlist(id, token);
				setWishlist(prev => prev.map(item => (item.id === tempItem.id ? res.data : item)));
				message.success('Đã thêm vào danh sách yêu thích');
			} catch (err) {
				setWishlist(prev => prev.filter(item => item.id !== tempItem.id)); // Rollback
				console.error('Error adding to wishlist:', err);
				message.error('Đã xảy ra lỗi khi thêm, vui lòng thử lại');
			}
		}
	};
	const handleRemoveWishlist = async (wishlistId, onWishlistChange) => {
		if (!token) {
			message.error('Bạn cần đăng nhập để thực hiện thao tác này.');
			return;
		}

		try {
			const response = await WishlistServices.removeWishlist(wishlistId, token);
			if (response) {
				message.success('Đã xóa khỏi danh sách yêu thích');
				setWishlist(prev => prev.filter(item => item.id !== wishlistId));
				if (onWishlistChange) onWishlistChange();
			} else {
				message.error('Xóa thất bại');
			}
		} catch (err) {
			console.error('Error removing from wishlist:', err);
			message.error('Đã xảy ra lỗi, vui lòng thử lại');
		}
	};

	const handleModalOk = () => {
		setIsModalVisible(false);
		window.location.href = config.routes.login;
	};

	const handlePasswordModalCancel = () => {
		setIsPasswordModalVisible(false);
	};

	const handleModalRegister = () => {
		setIsModalVisible(false);
		window.location.href = config.routes.register;
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
	};

	const handleLogin = async (identifier, password) => {
		if (!identifier || !password) {
			message.error('Vui lòng nhập tên đăng nhập và mật khẩu!');
			return;
		}
		const body = {
			identifier: identifier,
			password: password,
		};
		try {
			const res = await AuthService.login(body);
			localStorage.setItem('accessToken', res.data.accessToken);
			setCurrentUser(res.data);
			message.success('Đăng nhập thành công!', 1);
			return res.data;
		} catch (err) {
			console.error(err);
			message.error('Tên tài khoản hoặc mật khẩu không đúng!');
		}
	};


	const handleOAuthLogin = async (provider, navigate) => {
		try {
			await AuthService.loginOAuth(provider);
			const token = localStorage.getItem('accessToken');
			await getUser(token);
			message.success('Đăng nhập thành công!', 1);
			navigate('/');
		} catch (error) {
			message.error(`Đăng nhập thất bại: ${error.message}`, 1);
		}
	};

	const handlePasswordSubmit = async (values) => {
		try {
			const { password, confirmPassword } = values;

			// Cập nhật mật khẩu
			await AuthServices.resetPassword({
				email: currentUser.email,
				newPassword: password,
				confirmPassword: confirmPassword,
			});

			message.success('Cập nhật thông tin thành công!');
			setIsPasswordModalVisible(false);
			await getUser(token); // Cập nhật lại thông tin người dùng sau khi thay đổi
		} catch (error) {
			message.error(`Cập nhật thất bại: ${error.message}`);
		}
	};

	const handleLogout = async (navigate) => {
		try {
			// Xóa trạng thái thông báo khi đăng xuất
			localStorage.removeItem('voucherNotificationShown');
			localStorage.removeItem('voucherNotificationDate');

			// Xóa token và các trạng thái khác
			localStorage.removeItem('accessToken');
			setCurrentUser(null);
			setRole(null);
			message.success('Đăng xuất thành công!', 1);
			navigate('/');
			window.location.reload();
		} catch (error) {
			message.error(`Đăng xuất thất bại: ${error.message}`, 1);
		}
	};

	const getToken = async () => {
		try {
			return localStorage.getItem('accessToken');
		} catch (error) {
			console.error('Get token failed: ', error.message);
			throw error;
		}
	};

	const value = {
		getToken,
		currentUser,
		setCurrentUser,
		getUser,
		handleLogout,
		handleOAuthLogin,
		loading,
		role,
		paymentHistory,
		setPaymentHistory,
		getPaymentHistory,
		wishlist,
		token,
		getWishlist,
		handleLogin,
		handleAddToWishlist,
		handleRemoveWishlist,
		setWishlist,
		vouchers,
		wishlistMap,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
			<Modal
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				footer={null}
				width={400}
				className="rounded-xl overflow-hidden shadow-2xl"
				closeIcon={<span className="text-white text-lg">×</span>}
			>
				<div className="p-6 text-center bg-gray-50">
					<p className="text-gray-600 text-base mb-6">
						Để trải nghiệm tốt hơn! Hãy đăng nhập để sử dụng đầy đủ tính năng của chúng tôi.
					</p>
					<div className="space-y-4">
						<Button
							type="primary"
							size="large"
							icon={<LoginOutlined />}
							onClick={handleModalOk}
							className="w-full bg-blue-500 hover:bg-blue-600 border-none rounded-md h-11 text-base font-medium transition-all duration-200"
						>
							Đi đến trang đăng nhập
						</Button>
						<Button
							size="large"
							icon={<GoSignOut />}
							onClick={handleModalRegister}
							className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-md h-11 text-base font-medium shadow-sm transition-all duration-200"
						>
							Chưa có tài khoản? Đi tới đăng ký!
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				open={isPasswordModalVisible}
				onCancel={handlePasswordModalCancel}
				footer={null}
				width={450}
				className="rounded-2xl overflow-hidden shadow-xl animate-fade-in"
				closeIcon={<span
					className="text-gray-500 text-2xl font-semibold hover:text-gray-700 transition-colors">×</span>}
				centered
			>
				<div className="p-8 bg-gradient-to-b from-white to-gray-50">
					{/* Tiêu đề */}
					<h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
						Cập nhật thông tin tài khoản
					</h2>
					<p className="text-gray-500 text-center text-sm mb-6 leading-relaxed">
						Bạn đã đăng nhập bằng Google. Để bảo mật tài khoản, vui lòng tạo mật khẩu mới.
					</p>

					{/* Form */}
					<Form
						onFinish={handlePasswordSubmit}
						className="space-y-5"
						layout="vertical"
					>
						{/* Tên người dùng (disabled) */}
						<Form.Item
							name="username"
							initialValue={currentUser?.username}
							rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
						>
							<Input
								disabled
								placeholder="Tên người dùng"
								className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200" />
						</Form.Item>

						{/* Mật khẩu mới */}
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
								{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
						>
							<Input.Password
								placeholder="Mật khẩu mới"
								iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
								className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
							/>
						</Form.Item>

						{/* Xác nhận mật khẩu */}
						<Form.Item
							name="confirmPassword"
							dependencies={['password']}
							rules={[
								{ required: true, message: 'Vui lòng xác nhận mật khẩu!' },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
									},
								}),
							]}
						>
							<Input.Password
								placeholder="Xác nhận mật khẩu"
								iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
								className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
							/>
						</Form.Item>

						{/* Nút Cập nhật */}
						<button
							type="primary"
							htmlType="submit"
							className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none rounded-lg h-12 text-white text-base font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
						>
							Cập nhật
						</button>
					</Form>
				</div>
			</Modal>
		</AuthContext.Provider>
	);
}