import {
	Avatar,
	Button,
	Card,
	Divider,
	Form,
	Image,
	Input,
	message,
	Modal,
	Progress,
	QRCode,
	Rate,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '~/config/AuthContext';
import RatingServices from '~/services/RatingServices';
import BookingServices from '~/services/BookingServices';
import { FaTags } from 'react-icons/fa';
import WalletServices from '~/services/WalletServices';
import clsx from 'clsx';

const { Text, Title } = Typography;
const { TextArea } = Input;

export const BookedTourCard = React.memo(({ data, tour, onUpdateBooking, voucher, selectedBooking }) => {
	const { currentUser } = useAuth();
	const [timeLeft, setTimeLeft] = useState('');
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const [reviewed, setReviewed] = useState(!!data.review);
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
	const [showReview, setShowReview] = useState(false);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [showModalCancel, setShowModalCancel] = useState(false);
	const [isRefund, setIsRefund] = useState(false);
	const isSelected = data.bookingNo === selectedBooking;
	const showModal = () => setIsModalOpen(true);
	const handleCancel = () => setIsModalOpen(false);

	const handelCancelBooking = async (values) => {
		try {
			const cancelData = {
				reason: values.reason,
				refundRequested: isRefund,
				additionalNotes: values.additionalNotes,
			};
			const response = await BookingServices.cancelBooking(data.id, cancelData);
			message.success('Yêu cầu hoàn tiền đã được gửi thành công!', 1);
			setShowModalCancel(false);
			const updateData = {
				...data,
				status: response.status || (isRefund ? 'ON_HOLD' : 'CANCELLED'),
			};
			if (onUpdateBooking) {
				onUpdateBooking(updateData);
			}
		} catch (error) {
			console.error('Error cancelling booking:', error);
			const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi hủy bookng. Vui lòng thử lại!';
			message.error(errorMessage);
		}
	};

	const columns = [
		{ title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
		{ title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{
			title: 'Ngày sinh',
			dataIndex: 'birthday',
			key: 'birthday',
			render: (text) => (text ? config.webConfig.convertDateNoTime(text) : 'N/A'),
		},
		{
			title: 'Nhóm tuổi',
			dataIndex: 'ageGroup',
			key: 'ageGroup',
			render: (text) => (text === 'ADULT' ? 'Người lớn' : 'Trẻ em'),
		},
		{
			title: 'Giá/Người',
			dataIndex: 'price',
			key: 'price',
			render: (text) => config.webConfig.getCurrency(text),
		},
	];

	useEffect(() => {
		if (data.status === 'PENDING' && data.createdAt) {
			const calculateTimeLeft = () => {
				const createdTime = new Date(data.createdAt);
				const expiryTime = new Date(createdTime.getTime() + 24 * 60 * 60 * 1000);
				const now = new Date();
				const difference = expiryTime - now;

				if (difference > 0) {
					const hours = Math.floor(difference / (1000 * 60 * 60));
					const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((difference % (1000 * 60)) / 1000);
					setTimeLeft(`${hours} giờ ${minutes} phút ${seconds} giây`);
				} else {
					setTimeLeft('Hết hạn');
				}
			};
			calculateTimeLeft();
			const timer = setInterval(calculateTimeLeft, 1000);
			return () => clearInterval(timer);
		}
	}, [data.status, data.createdAt]);
	if (!tour) {
		return (
			<Card className="w-private full rounded-lg shadow-lg border-2 p-3 sm:p-4">
				<p className="text-base sm:text-lg font-bold text-gray-500">Không tìm thấy thông tin tour</p>
			</Card>
		);
	}

	const calculateOverallRating = () => {
		const values = form.getFieldsValue(['price', 'transportation', 'service', 'food', 'accommodation']);
		const ratings = Object.values(values).filter(val => val !== undefined && val !== 0);
		const average = ratings.length > 0 ? ratings.reduce((sum, val) => sum + val, 0) / ratings.length : 0;
		form.setFieldsValue({ overallRating: average });
	};

	const handleReviewSubmit = async (values) => {
		setLoading(true);
		try {
			const ratingData = {
				comment: values.comment || '',
				priceRating: values.price || 0,
				serviceRating: values.service || 0,
				facilityRating: values.transportation || 0,
				foodRating: values.food || 0,
				accommodationRating: values.accommodation || 0,
				bookingId: data.id,
				tourId: tour.id,
			};

			const response = await RatingServices.addRating(ratingData);
			setReviewed(true);
			setIsReviewModalOpen(false);
			message.success('Đánh giá của bạn đã được gửi thành công!');

			const updatedData = {
				...data,
				review: {
					id: response.id,
					comment: ratingData.comment,
					priceRating: ratingData.priceRating,
					serviceRating: ratingData.serviceRating,
					facilityRating: ratingData.facilityRating,
					foodRating: ratingData.foodRating,
					accommodationRating: ratingData.accommodationRating,
					rating: response.rating || values.overallRating,
					createdAt: response.createdAt || new Date().toISOString(),
				},
			};

			if (onUpdateBooking) {
				onUpdateBooking(updatedData);
			}
		} catch (error) {
			console.error('Error submitting review:', error);
			const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!';
			message.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const showReviewModal = () => setIsReviewModalOpen(true);
	const handleReviewCancel = () => setIsReviewModalOpen(false);

	const handleCheckout = async () => {
		try {
			if (data.status !== 'PENDING') {
				message.error('Chỉ có thể thanh toán cho các booking đang chờ!');
				return;
			}

			const amount = data.totalAmount || 0;
			const orderInfo = data.bookingNo || 'N/A';

			await BookingServices.checkOut({ amount: amount, orderInfo: orderInfo }).then((res) => {
				window.location.href = res;
			}).catch((err) => {
				console.error('Error during checkout:', err);
				message.error('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
			});
		} catch (error) {
			console.error('Error during checkout:', error);
			const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!';
			message.error(errorMessage);
		}
	};

	const handleRefund = async (values) => {
		try {
			const refundData = {
				bookingId: data?.id,
				reasons: values.reasons,
			};
			const response = await WalletServices.refund(refundData);
			message.success('Yêu cầu hoàn tiền đã được gửi thành công!', 1);
			console.log('Refund response:', response);
			setVisible(false);
			setIsRefund(false);
			if (onUpdateBooking) {
				onUpdateBooking({ ...data, status: response?.data?.status, notes: response?.data?.notes });
			}
		} catch (error) {
			console.error('Error requesting refund:', error);
			const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi yêu cầu hoàn tiền. Vui lòng thử lại!';
			message.error(errorMessage);
		}
	};

	const statusColors = {
		PENDING: 'text-blue-500',
		PAID: 'text-green-600',
		CANCELLED: 'text-red-600',
		COMPLETED: 'text-purple-600',
		ON_GOING: 'text-orange-500',
		EXPIRED: 'text-gray-500',
		ON_HOLD: 'śli text-yellow-500',
	};

	const CancellationInfo = ({ data }) => {
		if (!['CANCELLED', 'ON_HOLD'].includes(data.status)) return null;

		let reason = 'Không cung cấp';
		let cancelledBy = 'Không xác định';
		let role = 'Không xác định';
		if (data.notes) {
			const reasonMatch = data.notes.match(/Reason: (.*?)\|/);
			const cancelledByMatch = data.notes.match(/CancelledBy: (.*?)\|/);
			reason = reasonMatch ? reasonMatch[1] : 'Không cung cấp';
			cancelledBy = cancelledByMatch ? cancelledByMatch[1] : 'Không xác định';
			role = cancelledBy.includes('User') ? 'Bạn' : cancelledBy.includes('Admin') ? 'Admin' : 'Không xác định';
		}

		console.log({
			reason,
			cancelledBy: `${role} (${cancelledBy})`,
		});

		return (
			<div style={{ marginTop: 8 }}>
				<Text
					className="italic text-gray-600"
					style={{
						display: 'block',
					}}
				>
					{reason.length > 10 ? (
						<Tooltip title={reason}>
							<strong>Lý do:</strong> {`${reason.slice(0, 10)} ...`}
						</Tooltip>
					) : (
						<>
							<strong>Lý do:</strong> {reason}
						</>
					)}
				</Text>
				<Text className="text-gray-600" style={{ display: 'block' }}>
					<strong>Hủy bởi:</strong>{' '}
					<Tag color={role === 'Bạn' ? 'blue' : 'purple'}>
						{role} {cancelledBy !== 'Không xác định'}
					</Tag>
				</Text>
			</div>
		);
	};

	return (
		<>
			<Card
				className={clsx(
					'w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200',
					{ 'border-2 border-orange-600 bg-orange-50': isSelected },
				)}
				style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' }}
				bodyStyle={{ padding: '12px sm:p-4 md:p-5' }}
			>
				<div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
					<div className="flex-1 w-full">
						<div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
							<div className="w-full sm:w-auto">
								<h3
									className="text-lg sm:text-xl font-bold text-orange-500 hover:underline hover:text-orange-600 cursor-pointer transition-colors duration-200"
									className="text-lg sm:text-xl font-bold text-orange-500 hover:underline hover:text-orange-600 cursor-pointer transition-colors duration-200"
									onClick={() => navigate(config.routes.tourDetail + tour.id)}
								>
									{tour.title || 'N/A'}
								</h3>
								<p className="text-xs sm:text-sm text-gray-600 mt-1">
									Ngày đi:{' '}
									<span className="font-semibold">
                                        {data.tourDetail?.startDate && data.tourDetail?.endDate
																					? `${Math.ceil(
																						(new Date(data.tourDetail.endDate) - new Date(data.tourDetail.startDate)) /
																						(1000 * 60 * 60 * 24),
																					)}N${Math.ceil(
																						(new Date(data.tourDetail.endDate) - new Date(data.tourDetail.startDate)) /
																						(1000 * 60 * 60 * 24),
																					) - 1}Đ`
																					: 'N/A'}
                                    </span>
								</p>
								<p className="text-xs sm:text-sm text-gray-600 mt-1">
									Số người: <span className="font-semibold">{data.totalNumber || 0}</span>
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Ngày đặt: <span
									className="font-semibold">{config.webConfig.convertDateNoTime(data.createdAt)}</span>
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Ngày khởi hành: <span
									className="font-semibold">{config.webConfig.convertDateNoTime(data.startDate)}</span>
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									Mã đặt tour: <span className="font-semibold">{data.bookingNo}</span>
								</p>
								{data.voucher && (
									<div
										className="flex items-center gap-2 bg-green-50 px-2 sm:px-3 py-1 rounded-full w-fit shadow-sm mt-2">
										<FaTags className="text-green-500 text-sm" />
										<span className="text-xs sm:text-sm text-green-600 font-semibold">
                                            Voucher: {voucher.codeVoucher || 'N/A'} (-{voucher.discountValue || 0}%)
                                        </span>
									</div>
								)}
								<p className="text-base sm:text-lg font-semibold text-orange-600">
									{config.webConfig.getCurrency(data.totalAmount || 0)}{' '}
									{voucher && (
										<sup
											className="text-xs sm:text-sm text-green-500">(-{voucher.discountValue || 0}%)</sup>
									)}
								</p>
								<Divider className="my-2 sm:my-3" />
								{reviewed ? (
									<div className="flex items-center gap-2">
										<Rate allowHalf defaultValue={data.review?.rating || 0} disabled
													className="text-sm sm:text-base" />
										<Button
											type="link"
											className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
											onClick={() => setShowReview(!showReview)}
										>
											Xem đánh giá
										</Button>
									</div>
								) : (
									data.status === 'COMPLETED' && (
										<Button
											type="primary"
											className="bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
											onClick={showReviewModal}
										>
											Đánh giá tour
										</Button>
									)
								)}
								{!reviewed && data.status !== 'COMPLETED' && (
									<p className="text-xs sm:text-sm text-red-500">Chỉ có thể đánh giá sau khi tour hoàn
										thành</p>
								)}
							</div>

							<div
								className={`text-left sm:text-right ${statusColors[data.status] || 'text-gray-600'} w-full sm:w-auto`}>
								<p className="text-xs sm:text-sm font-semibold">
									Trạng thái:{' '}
									{data.status === 'PAID' ? 'Thành công' :
										data.status === 'PENDING' ? 'Đang chờ thanh toán' :
											data.status === 'CANCELLED' ? 'Đã hủy' :
												data.status === 'COMPLETED' ? 'Hoàn thành' :
													data.status === 'ON_GOING' ? 'Đang đi' :
														data.status === 'EXPIRED' ? 'Đã hết hạn' :
															data.status === 'ON_HOLD' ? 'Đang chờ duyệt hoàn tiền' :
																data.status || 'N/A'}
								</p>
								{data.status === 'PENDING' && (
									<div className="flex flex-col items-start sm:items-end gap-2 w-full">
										<p className="text-xs sm:text-sm text-red-500 font-medium">
											{timeLeft ? `Hạn thanh toán: ${timeLeft}` : 'Đang tính toán...'}
										</p>
										<div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
											<Button
												color="danger"
												variant="solid"
												onClick={() => setShowModalCancel(!showModalCancel)}
												className="w-full sm:w-1/2 rounded-full text-white font-semibold py-1 sm:py-2 text-xs sm:text-sm mr-1"
											>
												Hủy thanh toán
											</Button>
											<button
												onClick={handleCheckout}
												className="w-full sm:w-1/2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full text-white font-semibold py-1 px-1 sm:py-2 text-xs sm:text-sm"
											>
												Thanh toán ngay
											</button>
										</div>
									</div>
								)}
								{data.status === 'PAID' && (
									<button
										type="primary"
										onClick={() => {
											setIsRefund(true);
											setVisible(!visible);
										}}
										className="w-full sm:w-36 mt-2 p-1 sm:p-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full text-white font-semibold text-xs sm:text-sm border-none"
									>
										Yêu cầu hoàn tiền
									</button>
								)}
								{data.status === 'ON_HOLD' && (
									<div>
										<CancellationInfo data={data} />
									</div>
								)}
								{data.status === 'CANCELLED' && (
									<div>
										<CancellationInfo data={data} />
									</div>
								)}
								<p className="text-xs sm:text-sm text-gray-600 mt-1">
									Thanh toán: <span className="font-semibold">{data.paymentMethod || 'N/A'}</span>
								</p>
								<Button
									type="primary"
									onClick={showModal}
									className="w-full sm:w-32 mt-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-xs sm:text-sm py-1 sm:py-2"
								>
									Chi tiết
								</Button>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto">
						<div className="bg-white p-2 sm:p-3 rounded-lg shadow-md">
							<QRCode
								value={config.webConfig.getTourDetailQrUrl(tour.id)}
								size={140}
								level="H"
								includeMargin={true}
								className="w-24 sm:w-32 md:w-36"
							/>
						</div>
						<p className="text-xs sm:text-sm font-medium text-gray-700 text-center">
							Quét để xem thông tin tour
						</p>
					</div>
				</div>
			</Card>

			<Modal
				title={<span className="text-lg sm:text-2xl font-bold text-gray-800">Chi tiết tour</span>}
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
				width="90%"
				style={{ maxWidth: 900 }}
				bodyStyle={{ padding: '16px sm:p-6' }}
				className="rounded-lg"
			>
				<div className="flex flex-col gap-4 sm:gap-6">
					<div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
						<div className="flex-shrink-0 w-full sm:w-48">
							<Image
								src={config.imageConfig.getImage(tour.thumbnail) || config.webConfig.defaultTour}
								alt={tour.title || 'Tour'}
								width="100%"
								height={160}
								className="rounded-lg object-cover shadow-md"
							/>
						</div>
						<div className="flex-1 flex flex-col justify-center">
							<h2
								onClick={() => navigate(config.routes.tourDetail + tour.id)}
								className="text-lg sm:text-2xl font-bold text-gray-800 cursor-pointer hover:text-orange-500 hover:underline transition-colors duration-200"
							>
								{tour.title || 'N/A'}
							</h2>
							<p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-2">
								{tour.description || 'Không có mô tả'}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
						<div>
							<p className="text-xs sm:text-sm text-gray-500">Số lượng người lớn</p>
							<p className="text-base sm:text-lg font-semibold text-gray-800">{data.adultNum || 0}</p>
						</div>
						<div>
							<p className="text-xs sm:text-sm text-gray-500">Số lượng trẻ em</p>
							<p className="text-base sm:text-lg font-semibold text-gray-800">{data.childrenNum || 0}</p>
						</div>
						<div>
							<p className="text-xs sm:text-sm text-gray-500">Tổng tiền</p>
							<p className="text-base sm:text-lg font-semibold text-orange-600">
								{config.webConfig.getCurrency(data.totalAmount || 0)}
							</p>
						</div>
					</div>
					<div>
						<h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Thông tin hành
							khách</h3>
						<Table
							columns={columns}
							dataSource={data.details || []}
							pagination={false}
							size="small"
							rowKey="id"
							bordered
							className="rounded-lg"
							scroll={{ x: 600 }}
						/>
					</div>
				</div>
			</Modal>

			<Modal
				title={<span className="text-lg sm:text-2xl font-bold text-gray-800">Đánh giá của bạn</span>}
				open={showReview}
				onCancel={() => setShowReview(false)}
				footer={null}
				width="90%"
				style={{ maxWidth: 700 }}
				bodyStyle={{ padding: '16px sm:p-6', background: '#f9fafb' }}
				className="rounded-lg shadow-xl"
			>
				<div className="flex flex-col gap-4 sm:gap-6">
					<div
						className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
						<Avatar
							size={{ xs: 48, sm: 64 }}
							src={currentUser.avatar}
							icon={!currentUser.avatar && <UserOutlined />}
							className="border-2 border-blue-200"
						/>
						<div className="text-center sm:text-left">
							<Text strong className="text-base sm:text-lg text-gray-800">
								{currentUser.firstName} {currentUser.lastName}
							</Text>
							<div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
								<Rate allowHalf value={data.review?.rating || 0} disabled
											className="text-sm sm:text-base" />
								<Text className="text-gray-600 text-xs sm:text-sm">({data.review?.rating || 0}/5)</Text>
							</div>
							<Text className="text-xs sm:text-sm text-gray-500">
								Đánh giá
								vào: {data.review?.createdAt ? config.webConfig.convertDateNoTime(data.review.createdAt) : 'N/A'}
							</Text>
						</div>
					</div>
					<div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
						<Text className="text-sm sm:text-base text-gray-700">
							{data.review?.comment || 'Chưa có nhận xét'}
						</Text>
					</div>
					<div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
						<Title level={4} className="text-gray-800 mb-3 sm:mb-4 font-semibold text-base sm:text-lg">Chi
							tiết đánh giá</Title>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							{[
								{ key: 'priceRating', label: 'Giá cả' },
								{ key: 'facilityRating', label: 'Phương tiện' },
								{ key: 'serviceRating', label: 'Dịch vụ' },
								{ key: 'foodRating', label: 'Ẩm thực' },
								{ key: 'accommodationRating', label: 'Lưu trú' },
							].map(({ key, label }) => (
								<div key={key} className="flex items-center gap-2">
									<Text
										className="text-gray-600 w-24 sm:w-32 font-medium text-xs sm:text-sm">{label}</Text>
									<Progress
										percent={(data.review?.[key] || 0) * 20}
										size="small"
										strokeColor="#1890ff"
										showInfo={false}
										className="flex-1"
									/>
									<Text className="text-gray-700 w-12 text-right text-xs sm:text-sm">
										{data.review?.[key] || 0}/5
									</Text>
								</div>
							))}
						</div>
					</div>
					<div className="flex justify-end gap-2 sm:gap-3">
						<Button
							type="primary"
							onClick={() => setShowReview(false)}
							className="rounded-full px-4 sm:px-6 py-1 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm"
						>
							Đóng
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				title={<span className="text-lg sm:text-2xl font-bold text-gray-800">Đánh giá Tour</span>}
				open={isReviewModalOpen}
				onCancel={handleReviewCancel}
				footer={null}
				width="90%"
				style={{ maxWidth: 900 }}
				bodyStyle={{ padding: '16px sm:p-6', background: '#f9fafb' }}
				className="rounded-lg shadow-xl"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleReviewSubmit}
					initialValues={{
						overallRating: 0,
						comment: '',
						price: 0,
						transportation: 0,
						service: 0,
						food: 0,
						accommodation: 0,
					}}
				>
					<div className="flex flex-col gap-4 sm:gap-6">
						<div
							className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
							<Avatar
								size={{ xs: 48, sm: 64 }}
								src={config.imageConfig.getAvatar(currentUser.avatarUrl)}
								icon={!currentUser.avatarUrl && <UserOutlined />}
								className="border-2 border-blue-200"
							/>
							<div className="text-center sm:text-left">
								<Text strong className="text-base sm:text-lg text-gray-800">
									{currentUser.firstName} {currentUser.lastName}
								</Text>
								<Text className="block text-xs sm:text-sm text-gray-500">
									Đánh giá tour: <span className="font-bold">{tour.title || 'N/A'}</span>
								</Text>
							</div>
						</div>
						<div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
							<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
								<Form.Item
									name="overallRating"
									label={<span className="text-sm sm:text-base font-medium text-gray-700">Đánh giá tổng thể</span>}
									className="mb-0"
								>
									<Rate allowHalf disabled className="text-sm sm:text-xl" />
								</Form.Item>
								<Text className="text-gray-600 text-xs sm:text-sm">
									(Tự động tính từ các hạng mục bên dưới)
								</Text>
							</div>
							<Form.Item
								name="comment"
								label={<span
									className="text-sm sm:text-base font-medium text-gray-700">Nhận xét của bạn</span>}
								rules={[
									({ getFieldValue }) => ({
										validator(_, value) {
											const overallRating = getFieldValue('overallRating');
											if (overallRating <= 3 && !value) {
												return Promise.reject(new Error('Vui lòng nhập nhận xét khi đánh giá!'));
											}
											return Promise.resolve();
										},
									}),
								]}
							>
								<TextArea
									rows={4}
									placeholder="Chia sẻ trải nghiệm của bạn về tour..."
									className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
								/>
							</Form.Item>
						</div>
						<div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-100">
							<Title level={4} className="text-gray-800 mb-3 sm:mb-4 font-semibold text-base sm:text-lg">
								Chi tiết đánh giá
							</Title>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
								{[
									{ name: 'price', label: 'Giá cả' },
									{ name: 'transportation', label: 'Phương tiện' },
									{ name: 'service', label: 'Dịch vụ' },
									{ name: 'food', label: 'Ẩm thực' },
									{ name: 'accommodation', label: 'Khách sạn' },
								].map((item) => (
									<Form.Item
										key={item.name}
										name={item.name}
										label={<span
											className="text-gray-700 font-medium text-sm sm:text-base">{item.label}</span>}
										className="mb-2"
									>
										<Rate
											allowHalf
											onChange={calculateOverallRating}
											className="text-yellow-500 text-lg sm:text-2xl"
										/>
									</Form.Item>
								))}
							</div>
						</div>
						<div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
							<Button
								type="default"
								onClick={handleReviewCancel}
								className="rounded-full px-4 sm:px-6 py-1 sm:py-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium text-xs sm:text-sm"
								disabled={loading}
							>
								Hủy
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								className="rounded-full px-4 sm:px-6 py-1 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm"
								loading={loading}
							>
								Gửi đánh giá
							</Button>
						</div>
					</div>
				</Form>
			</Modal>

			<Modal
				open={showModalCancel}
				onCancel={() => setShowModalCancel(!showModalCancel)}
				footer={null}
				width="90%"
				style={{ maxWidth: 600 }}
				className="rounded-xl overflow-hidden shadow-2xl"
				closeIcon={<span className="text-gray-500 text-lg sm:text-xl hover:text-gray-700">×</span>}
				centered
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handelCancelBooking}
					initialValues={{
						reason: '',
						additionalNotes: null,
					}}
				>
					<div className="p-4 sm:p-6 bg-white">
						<div className="flex items-center justify-center mb-4 sm:mb-6">
							<ExclamationCircleOutlined style={{ fontSize: '24px sm:32px', color: '#faad14' }} />
							<Title level={3} className="ml-2 sm:ml-3 mb-0 uppercase text-red-800 text-lg sm:text-xl">
								Xác nhận yêu cầu hủy đơn hàng
							</Title>
						</div>
						<Text className="block text-center text-gray-600 text-sm sm:text-lg mb-6 sm:mb-8">
							Bạn có chắc chắn muốn gửi yêu cầu hủy giao dịch này không? Hành động này không thể hoàn tác.
						</Text>
						<Form.Item
							name="reason"
							label={<span className="text-gray-600 text-sm sm:text-lg">Lý do hủy:</span>}
							rules={[{ required: true, message: 'Vui lòng nhập lý do hủy!' }]}
						>
							<Input.TextArea
								className="max-h-80 text-sm sm:text-base"
								rows={4}
								placeholder="Nhập lý do..."
							/>
						</Form.Item>
						<Space direction="horizontal" size="middle" className="flex justify-center">
							<Button
								type="primary"
								size="large"
								htmlType="submit"
								className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm"
								style={{ minWidth: '100px sm:120px' }}
							>
								Gửi yêu cầu
							</Button>
							<Button
								type="default"
								size="large"
								onClick={() => setShowModalCancel(!showModalCancel)}
								className="rounded-lg border-gray-300 hover:border-gray-400 transition-colors duration-300 px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm"
								style={{ minWidth: '100px sm:120px' }}
							>
								Hủy
							</Button>
						</Space>
					</div>
				</Form>
			</Modal>

			<Modal
				title={
					<div className="flex items-center space-x-2">
						<ExclamationCircleOutlined className="text-yellow-500 text-xl" />
						<span className="text-xl sm:text-2xl font-semibold text-gray-800">Yêu cầu hoàn tiền</span>
					</div>
				}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={null}
				width="90%"
				style={{ maxWidth: 600 }}
				bodyStyle={{ padding: '24px' }}
				className="rounded-xl shadow-lg"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleRefund}
					initialValues={{
						reasons: '',
					}}
				>
					<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
						<Title level={4} className="text-gray-800 mb-2">
							Xác nhận yêu cầu hoàn tiền
						</Title>
						<Text className="text-gray-600 text-sm sm:text-base mb-4 block">
							Bạn đang yêu cầu hoàn tiền cho booking: <strong>{data.bookingNo}</strong>
						</Text>
						<Text className="text-gray-500 text-sm sm:text-base mb-6 block">
							Vui lòng cung cấp lý do để chúng tôi xử lý yêu cầu nhanh chóng hơn.
						</Text>

						<Form.Item
							name="reasons"
							label={<span
								className="text-gray-700 font-medium text-sm sm:text-base">Lý do hoàn tiền</span>}
							rules={[{ required: true, message: 'Vui lòng nhập lý do hoàn tiền!' }]}
						>
							<Input.TextArea
								rows={4}
								placeholder="Ví dụ: Thay đổi kế hoạch, không thể tham gia tour..."
								className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
							/>
						</Form.Item>

						<div
							className="flex items-start space-x-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
							<ExclamationCircleOutlined className="text-yellow-500 text-lg mt-1" />
							<Text className="text-yellow-700 text-sm sm:text-base">
								<strong>Lưu ý:</strong> Số tiền hoàn lại phụ thuộc vào thời điểm bạn yêu cầu hủy và ngày khởi hành tour.
								<br />
								- <strong>Hoàn 100%</strong> nếu hủy trong vòng 12 giờ sau thanh toán, hoặc trước 30 ngày khởi hành.
								<br />
								- Tỷ lệ hoàn giảm dần nếu gần ngày tour (từ 90% đến 60%).
								<br />
								Vui lòng kiểm tra kỹ trước khi gửi yêu cầu hủy!
							</Text>
						</div>

						<Space className="flex justify-end">
							<Button
								type="default"
								size="large"
								onClick={() => setVisible(false)}
								className="rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 px-4 sm:px-6 py-1 sm:py-2 text-sm"
							>
								Hủy
							</Button>
							<Button
								type="primary"
								size="large"
								htmlType="submit"
								className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 px-4 sm:px-6 py-1 sm:py-2 text-sm"
							>
								Gửi yêu cầu
							</Button>
						</Space>
					</div>
				</Form>
			</Modal>
		</>
	);
});