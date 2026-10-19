import { useCallback, useEffect, useState } from 'react';
import {
	Table,
	Button,
	Modal,
	Tabs,
	Tag,
	Spin,
	Typography,
	Card,
	message,
	Input,
	Select,
	Tooltip,
	Rate,
	Progress, Space, Popconfirm,
} from 'antd';
import {
	CoffeeOutlined,
	DollarOutlined,
	EyeOutlined, HddOutlined, HomeOutlined,
	SearchOutlined,
	SmileOutlined,
	StarOutlined,
} from '@ant-design/icons';
import BookingServices from '~/services/BookingServices';
import config from '~/config';
import moment from 'moment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export const BookingPage = () => {
	const [bookings, setBookings] = useState([]);
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [cancelReason, setCancelReason] = useState('');
	const tourList = [...new Set(filteredBookings.map(item => item.tourDetail?.tour?.title).filter(Boolean))];

	const fetchBookings = useCallback(async () => {
		try {
			setLoading(true);
			const response = await BookingServices.getAll();
			setBookings(response.data);
			setFilteredBookings(response.data);
		} catch (error) {
			console.error('Error fetching bookings:', error);
			message.error('Không thể tải danh sách đặt chỗ.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBookings().then(r => r);
	}, [fetchBookings]);

	const handleViewDetails = (booking) => {
		setSelectedBooking(booking);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedBooking(null);
	};

	const handleCancelBooking = async () => {
		if (!cancelReason.trim()) {
			message.error('Vui lòng nhập lý do hủy.');
			return;
		}
		try {
			const cancelData = {
				reason: cancelReason,
				refundRequested: true,
				additionalNotes: null,
			};
			await BookingServices.cancelBookingAd(selectedBooking.id, cancelData).then((res) => {
				// Update bookings state
				setBookings((prevBookings) =>
					prevBookings.map((booking) =>
						booking.id === selectedBooking.id ?
							{
								...booking,
								status: 'CANCELLED',
								notes: res.data.notes,
							} : booking,
					),
				);
				// Update filteredBookings state
				setFilteredBookings((prevFiltered) =>
					prevFiltered.map((booking) =>
						booking.id === selectedBooking.id ? {
							...booking,
							status: 'CANCELLED',
							notes: res.data.notes,
						} : booking,
					),
				);
				message.success('Hủy booking thành công.');
				setCancelReason('');
				handleCloseModal();
			});
		} catch (error) {
			console.error('Error cancelling booking:', error);
			const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi hủy booking. Vui lòng thử lại!';
			message.error(errorMessage);
		}
	};
	// Ánh xạ trạng thái
	const statusMap = {
		PENDING: { text: 'Chờ thanh toán', color: 'gold' },
		PAID: { text: 'Đã thanh toán', color: 'green' },
		EXPIRED: { text: 'Hết hạn', color: 'red' },
		ON_GOING: { text: 'Đang diễn ra', color: 'blue' },
		COMPLETED: { text: 'Đã hoàn thành', color: 'cyan' },
		ON_HOLD: { text: 'Đang giữ', color: 'orange' },
		CANCELLED: { text: 'Đã hủy', color: 'default' },
		CONFIRMED: { text: 'Đã xác nhận', color: 'purple' },
	};

	// Columns cho table chính
	const columns = [
		{
			title: 'Mã đặt chỗ',
			dataIndex: 'bookingNo',
			key: 'bookingNo',
			render: (text) => <Text strong>{text}</Text>,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Tìm mã đặt chỗ"
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => confirm()}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					/>
					<Button
						type="primary"
						onClick={() => confirm()}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Tìm
					</Button>
					<Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
						Xóa
					</Button>
				</div>
			),
			onFilter: (value, record) => record.bookingNo.toLowerCase().includes(value.toLowerCase()),
		},
		{
			title: 'Tên',
			dataIndex: 'bookerFullName',
			key: 'bookerFullName',
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder=" Tìm tên người đặt"
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => confirm()}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					/>
					<Button
						type="primary"
						onClick={() => confirm()}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Tìm
					</Button>
					<Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
						Xóa
					</Button>
				</div>
			),
			onFilter: (value, record) => record.bookerFullName.toLowerCase().includes(value.toLowerCase()),
		},
		{
			title: 'Tour',
			width: '200px',
			dataIndex: ['tourDetail', 'tour', 'title'],
			key: 'tourTitle',
			render: (text) => <Tooltip title={text}><Text className="line-clamp-1">{text}</Text></Tooltip>,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Select
						placeholder="Chọn tour"
						value={selectedKeys[0]}
						onChange={(value) => setSelectedKeys(value ? [value] : [])}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
						allowClear
					>
						{tourList.map((tour) => (
							<Select.Option key={tour} value={tour}>
								{tour}
							</Select.Option>
						))}
					</Select>
					<Button
						type="primary"
						onClick={() => confirm()}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Lọc
					</Button>
					<Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
						Xóa
					</Button>
				</div>
			),
			onFilter: (value, record) =>
				record.tourDetail?.tour?.title.toLowerCase().includes(value.toLowerCase()),
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			sorter: (a, b) => a.totalAmount - b.totalAmount,
			filters: [
				{ text: 'Dưới 1 triệu', value: 'under1M' },
				{ text: '1 triệu - 5 triệu', value: '1M-5M' },
				{ text: 'Trên 5 triệu', value: 'over5M' },
			],
			onFilter: (value, record) => {
				if (value === 'under1M') {
					return record.totalAmount < 1000000;
				} else if (value === '1M-5M') {
					return record.totalAmount >= 1000000 && record.totalAmount <= 5000000;
				} else if (value === 'over5M') {
					return record.totalAmount > 5000000;
				}
				return false;
			},
			render: (text) => `${config.webConfig.getCurrency(text)}`,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (text) => (
				<Tag color={statusMap[text]?.color || 'default'}>
					{statusMap[text]?.text || text}
				</Tag>
			),
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Select
						mode="multiple"
						placeholder="Chọn trạng thái"
						value={selectedKeys}
						onChange={setSelectedKeys}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					>
						{Object.entries(statusMap).map(([key, value]) => (
							<Option key={key} value={key}>
								{value.text}
							</Option>
						))}
					</Select>
					<Button onClick={() => confirm()} type="primary" size="small" style={{ width: 90, marginRight: 8 }}>
						Lọc
					</Button>
					<Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
						Xóa
					</Button>
				</div>
			),
			onFilter: (value, record) => record.status === value,
		},
		{
			title: 'Ngày đặt',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (text) => moment(text).format('DD/MM/YYYY'),
			sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Tooltip title="Xem chi tiết">
					<Button
						icon={<EyeOutlined />}
						onClick={() => handleViewDetails(record)}
					/>
				</Tooltip>
			),
		},
	];

	// Columns cho table chi tiết hành khách trong modal
	const detailColumns = [
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'birthday',
			key: 'birthday',
			render: (text) => `${config.webConfig.convertLocalDateTime(text)}`,
		},
		{
			title: 'Nhóm tuổi',
			dataIndex: 'ageGroup',
			key: 'ageGroup',
			render: (text) => (
				<Tag color={text === 'ADULT' ? 'blue' : 'purple'}>
					{text === 'ADULT' ? 'Người lớn' : 'Trẻ em'}
				</Tag>
			),
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			render: (text) => `${config.webConfig.getCurrency(text)}`,
		},
	];

	return (
		<div className="bg-gray-50 min-h-screen p-6">
			<Card className="shadow-md">
				<Title level={2} className="mb-6 text-gray-800">
					Danh sách đặt chỗ
				</Title>
				<Table
					columns={columns}
					dataSource={filteredBookings}
					rowKey="id"
					loading={loading}
					pagination={{ pageSize: 10 }}
					scroll={{ x: 'max-content' }}
					className="rounded-lg"
				/>

				{/* Modal chi tiết */}
				<Modal
					title={
						<div className="flex items-center gap-2">
							<Text strong>Chi tiết đặt chỗ:</Text>
							<Text>{selectedBooking?.bookingNo}</Text>
						</div>
					}
					visible={isModalVisible}
					onCancel={handleCloseModal}
					footer={[
						<Button
							key="close"
							type="primary"
							onClick={handleCloseModal}
							className="bg-orange-600 hover:bg-orange-700"
						>
							Đóng
						</Button>,
					]}
					width={900}
					className="rounded-lg"
					bodyStyle={{ padding: '24px', background: '#f9fafb' }}
				>
					{console.log(selectedBooking)}
					{selectedBooking && (
						<Tabs
							defaultActiveKey="1"
							tabBarStyle={{ borderBottom: '2px solid #f97316' }}
						>
							{/* Tab: Thông tin chung */}
							<TabPane tab="Thông tin chung" key="1">
								<div
									className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
									<div>
										<Text strong className="block text-gray-700">Mã đặt chỗ:</Text>
										<Text>{selectedBooking.bookingNo}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Người đặt:</Text>
										<Text>{selectedBooking.bookerFullName}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Email:</Text>
										<Text>{selectedBooking.bookerEmail}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Số điện thoại:</Text>
										<Text>{selectedBooking.bookerPhoneNumber}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Địa chỉ:</Text>
										<Text>{selectedBooking.bookerAddress || 'N/A'}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Tour:</Text>
										<Text>{selectedBooking.tourDetail?.tour?.title}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Ngày bắt đầu:</Text>
										<Text>{config.webConfig.convertLocalDateTime(selectedBooking.tourDetail?.startDate)}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Ngày kết thúc:</Text>
										<Text>{config.webConfig.convertLocalDateTime(selectedBooking.tourDetail?.endDate)}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Số người:</Text>
										<Text>
											{selectedBooking.adultNum} người lớn, {selectedBooking.childrenNum} trẻ em
										</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Tổng tiền:</Text>
										<Text>{config.webConfig.getCurrency(selectedBooking.totalAmount || 0)}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Yêu cầu đặc biệt:</Text>
										<Text>{selectedBooking.specialRequests || 'N/A'}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Trạng thái:</Text>
										<Tag color={statusMap[selectedBooking.status]?.color || 'default'}>
											{statusMap[selectedBooking.status]?.text || selectedBooking.status}
										</Tag>
									</div>
								</div>
							</TabPane>

							{/* Tab: Thông tin hành khách */}
							<TabPane tab="Thông tin hành khách" key="2">
								<Table
									columns={detailColumns}
									dataSource={selectedBooking.details || []}
									rowKey="id"
									pagination={false}
									scroll={{ x: 'max-content' }}
									className="bg-white rounded-lg shadow-sm"
								/>
							</TabPane>

							{/* Tab: Thanh toán */}
							<TabPane tab="Thanh toán" key="3">
								<div
									className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
									<div>
										<Text strong className="block text-gray-700">Phương thức thanh toán:</Text>
										<Text>{selectedBooking.paymentMethod || 'N/A'}</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Tổng tiền:</Text>
										<Text>{selectedBooking.totalAmount.toLocaleString()} VNĐ</Text>
									</div>
									<div>
										<Text strong className="block text-gray-700">Trạng thái thanh toán:</Text>
										<Text>{selectedBooking.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
									</div>
								</div>
							</TabPane>

							{/* Tab: Voucher */}
							{selectedBooking.voucher && (
								<TabPane tab="Voucher" key="4">
									{selectedBooking.voucher ? (
										<div
											className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
											<div>
												<Text strong className="block text-gray-700">Tiêu đề:</Text>
												<Text>{selectedBooking.voucher.title}</Text>
											</div>
											<div>
												<Text strong className="block text-gray-717">Mã voucher:</Text>
												<Text>{selectedBooking.voucher.codeVoucher}</Text>
											</div>
											<div>
												<Text strong className="block text-gray-700">Giảm giá:</Text>
												<Text>{selectedBooking.voucher.discountValue}%</Text>
											</div>
										</div>
									) : (
										<div className="bg-white p-6 rounded-lg shadow-sm">
											<Text>Không sử dụng voucher.</Text>
										</div>
									)}
								</TabPane>
							)}

							{/* Tab: Review */}
							{selectedBooking.review && (
								<TabPane tab="Review" key="5">
									{selectedBooking.review ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
											<div>
												<Text strong className="block text-gray-700">Mã đánh giá:</Text>
												<Text>{selectedBooking.review.id}</Text>
											</div>
											<div>
												<Text strong className="block text-gray-700">Ngày tạo:</Text>
												<Text>{moment(selectedBooking.review.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
											</div>
											<div className="sm:col-span-2">
												<Text strong className="block text-gray-700">Nhận xét:</Text>
												<Text>{selectedBooking.review.comment || 'Không có nhận xét.'}</Text>
											</div>
											<div className="sm:col-span-2">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<Card
														className="shadow-md hover:shadow-lg transition-shadow duration-300"
														title={
															<Space>
																<StarOutlined className="text-yellow-500" />
																<Text strong>Điểm trung bình</Text>
															</Space>
														}
													>
														<Progress
															percent={(selectedBooking.review.rating * 20).toFixed(0)}
															status="active"
															strokeColor="#fadb14"
															format={(percent) => `${(percent / 20).toFixed(1)}/5.0`}
														/>
													</Card>
													<Card
														className="shadow-md hover:shadow-lg transition-shadow duration-300"
														title={
															<Space>
																<DollarOutlined className="text-green-500" />
																<Text strong>Đánh giá giá cả</Text>
															</Space>
														}
													>
														<Progress
															percent={(selectedBooking.review.priceRating * 20).toFixed(0)}
															status="active"
															strokeColor="#52c41a"
															format={(percent) => `${(percent / 20).toFixed(1)}/5.0`}
														/>
													</Card>
													<Card
														className="shadow-md hover:shadow-lg transition-shadow duration-300"
														title={
															<Space>
																<SmileOutlined className="text-blue-500" />
																<Text strong>Đánh giá dịch vụ</Text>
															</Space>
														}
													>
														<Progress
															percent={(selectedBooking.review.serviceRating * 20).toFixed(0)}
															status="active"
															strokeColor="#1890ff"
															format={(percent) => `${(percent / 20).toFixed(1)}/5.0`}
														/>
													</Card>
													<Card
														className="shadow-md hover:shadow-lg transition-shadow duration-300"
														title={
															<Space>
																<HomeOutlined className="text-purple-500" />
																<Text strong>Đánh giá cơ sở vật chất</Text>
															</Space>
														}
													>
														<Progress
															percent={(selectedBooking.review.facilityRating * 20).toFixed(0)}
															status="active"
															strokeColor="#722ed1"
															format={(percent) => `${(percent / 20).toFixed(1)}/5.0`}
														/>
													</Card>
													<Card
														className="shadow-md hover:shadow-lg transition-shadow duration-300"
														title={
															<Space>
																<CoffeeOutlined className="text-orange-500" />
																<Text strong>Đánh giá đồ ăn</Text>
															</Space>
														}
													>
														<Progress
															percent={(selectedBooking.review.foodRating * 20).toFixed(0)}
															status="active"
															strokeColor="#fa8c16"
															format={(percent) => `${(percent / 20).toFixed(1)}/5.0`}
														/>
													</Card>
													<Card
														className="shadow-md hover:shadow-lg transition-shadow duration-300"
														title={
															<Space>
																<HddOutlined className="text-red-500" />
																<Text strong>Đánh giá chỗ ở</Text>
															</Space>
														}
													>
														<Progress
															percent={(selectedBooking.review.accommodationRating * 20).toFixed(0)}
															status="active"
															strokeColor="#ff4d4f"
															format={(percent) => `${(percent / 20).toFixed(1)}/5.0`}
														/>
													</Card>
												</div>
											</div>
										</div>
									) : (
										<div className="bg-white p-6 rounded-lg shadow-sm">
											<Text>Chưa có review.</Text>
										</div>
									)}
								</TabPane>
							)}

							{/* Cancellation Tab */}
							{selectedBooking.status &&
								!['EXPIRED', 'CANCELLED', 'COMPLETED'].includes(selectedBooking.status) && (
									<TabPane tab="Hủy Booking" key="6">
										<div className="bg-white p-6 rounded-lg shadow-sm">
											<Title level={4} className="text-gray-700 mb-4">
												Chính sách hủy
											</Title>
											<Text className="block text-gray-600 mb-4">
												Nếu bạn hủy booking này thì sẽ hoàn tiền 100% đối với những đơn đã thanh toán.
											</Text>
											<Text strong className="block text-gray-700 mb-2">
												Lý do hủy:
											</Text>
											<Input.TextArea
												rows={4}
												value={cancelReason}
												onChange={(e) => setCancelReason(e.target.value)}
												placeholder="Vui lòng nhập lý do hủy booking"
												className="mb-4"
											/>
											<Popconfirm
												title="Xác nhận hủy booking"
												description="Bạn có chắc chắn muốn hủy booking này? Hành động này không thể hoàn tác."
												onConfirm={handleCancelBooking}
												okText="Hủy Booking"
												cancelText="Quay lại"
												okButtonProps={{ danger: true }}
											>
												<Button type="primary" danger>
													Hủy Booking
												</Button>
											</Popconfirm>
										</div>
									</TabPane>
								)}
						</Tabs>
					)}
				</Modal>
			</Card>
		</div>
	);
};