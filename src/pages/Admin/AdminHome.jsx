import { useEffect, useState } from 'react';
import {
	BlockOutlined,
	CommentOutlined,
	DesktopOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import {
	Breadcrumb,
	Button,
	ConfigProvider,
	DatePicker,
	Layout,
	message,
	Modal,
	notification,
	Select,
	Switch,
	theme,
	Tooltip,
} from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import { AdminSidebar } from '~/pages/Admin/components/AdminHome/AdminSidebar';
import { AdminHeader } from '~/pages/Admin/components/AdminHome/AdminHeader';
import { AdminFooter } from '~/pages/Admin/components/AdminHome/AdminFooter';

import { HomePage } from '~/pages/Admin/sections/HomePage/HomePage';
import Support from '~/pages/Admin/Support';
import TourList from '~/pages/Admin/sections/ToursPage/TourList';
import { BookingStatistic } from '~/pages/Admin/sections/StatisticGeneral/Sections/BookingStatistic';
import { CategoryPage } from '~/pages/Admin/sections/CategoryPage/CategoryPage';
import { HotelPage } from '~/pages/Admin/sections/HotelPage/HotelPage';
import { TransportationPage } from '~/pages/Admin/sections/TransportationPage/TransportationPage';
import { ReviewPage } from '~/pages/Admin/sections/ReviewPage/ReviewPage';
import { DestinationPage } from '~/pages/Admin/sections/DestinationPage/DestinationPage';
import { VoucherPage } from '~/pages/Admin/sections/VoucherPage/VoucherPage';
import { GuidePage } from '~/pages/Admin/sections/GuidePage/GuidePage';
import { UserPage } from '~/pages/Admin/sections/UsersPage/UserPage';
import { ItineraryPage } from '~/pages/Admin/sections/ItineraryPage/ItineraryPage';
import { WalletPage } from '~/pages/Admin/sections/WalletPage/WalletPage';
import { BlogSection } from '~/pages/Admin/sections/BlogSection/BlogSection';
import { BookingPage } from '~/pages/Admin/sections/BookingSection/BookingPage';
import { BlogCategoryPage } from '~/pages/Admin/sections/BlogCategoryPage/BlogCategoryPage';

import { useAuth } from '~/config/AuthContext';
import WalletServices from '~/services/WalletServices';
import AdminServices from '~/services/AdminServices';

import { MdTour } from 'react-icons/md';
import { BiSolidCategory } from 'react-icons/bi';
import { TbMessage2Dollar } from 'react-icons/tb';
import { IoIosStar } from 'react-icons/io';
import {
	FaFileExport,
	FaMoon,
	FaCheck,
	FaMoneyCheckAlt,
	FaUsers,
	FaTicketAlt,
	FaArrowRight,
} from 'react-icons/fa';
import { CiLight } from 'react-icons/ci';
import { HiOutlineSparkles } from 'react-icons/hi2';

const { Content } = Layout;

const AdminHome = () => {
	const { currentUser } = useAuth();

	const [isDarkTheme, setIsDarkTheme] = useState(() => {
		try {
			const savedTheme = localStorage.getItem('theme');
			return savedTheme ? JSON.parse(savedTheme) : false;
		} catch {
			localStorage.removeItem('theme');
			return false;
		}
	});

	const [selectedKey, setSelectedKey] = useState('1');
	const [selectedContent, setSelectedContent] = useState(<HomePage />);
	const [selectedLabel, setSelectedLabel] = useState('Tổng quan');

	const [buttonState, setButtonState] = useState('idle');
	const [exportModalVisible, setExportModalVisible] = useState(false);
	const [prevPendingRequests, setPrevPendingRequests] = useState(0);
	const [exportType, setExportType] = useState('booking');
	const [startDate, setStartDate] = useState(dayjs().subtract(1, 'year'));
	const [endDate, setEndDate] = useState(dayjs());
	const [progress, setProgress] = useState(0);

	const isDark = isDarkTheme;

	const colors = {
		page: isDark ? '#0b1220' : '#f5f7fb',
		panel: isDark ? '#111c2e' : '#ffffff',
		panelSoft: isDark ? '#172338' : '#f8fafc',
		border: isDark ? '#27364b' : '#e5eaf1',
		text: isDark ? '#f1f5f9' : '#142033',
		muted: isDark ? '#94a3b8' : '#64748b',
		primary: '#0284c7',
		primarySoft: isDark ? 'rgba(56,189,248,0.12)' : '#eaf6ff',
	};

	const menuItems = [
		{
			label: 'Trang chủ',
			key: '1',
			icon: <DesktopOutlined />,
			content: <HomePage />,
		},
		{
			label: 'Tài khoản',
			key: 'sub2',
			icon: <TeamOutlined />,
			children: [
				{
					label: (
						<Tooltip title="Danh sách tài khoản" placement="right">
							<span>Danh sách tài khoản</span>
						</Tooltip>
					),
					key: '5',
					content: <UserPage />,
				},
				{
					label: 'Hướng dẫn viên',
					key: '6',
					content: <GuidePage />,
				},
			],
		},
		{
			label: 'Tour',
			key: 'sub3',
			icon: <MdTour />,
			children: [
				{
					label: 'Danh sách danh mục con',
					key: '7',
					content: <CategoryPage />,
				},
				{
					label: 'Danh sách tour',
					key: '8',
					content: <TourList />,
				},
				{
					label: 'Lịch trình',
					key: '9',
					content: <ItineraryPage />,
				},
			],
		},
		{
			label: 'Booking',
			key: 'sub4',
			icon: <FaMoneyCheckAlt />,
			children: [
				{
					label: 'Thống kê booking',
					key: '10',
					content: <BookingStatistic />,
				},
				{
					label: 'Danh sách booking',
					key: '11',
					content: <BookingPage />,
				},
				{
					label: 'Yêu cầu hoàn tiền',
					key: '12',
					content: <WalletPage />,
				},
			],
		},
		{
			label: 'Khuyến mãi',
			key: 'sub5',
			icon: <TbMessage2Dollar />,
			children: [
				{
					label: 'Voucher',
					key: '13',
					content: <VoucherPage />,
				},
			],
		},
		{
			label: 'Danh mục',
			key: 'sub6',
			icon: <BiSolidCategory />,
			children: [
				{
					label: 'Khách sạn',
					key: '14',
					content: <HotelPage />,
				},
				{
					label: 'Phương tiện',
					key: '15',
					content: <TransportationPage />,
				},
				{
					label: 'Điểm đến',
					key: '16',
					content: <DestinationPage />,
				},
			],
		},
		{
			label: 'Đánh giá',
			key: 'sub7',
			icon: <IoIosStar />,
			content: <ReviewPage />,
		},
		{
			label: 'Blogs',
			key: 'sub8',
			icon: <BlockOutlined />,
			children: [
				{
					label: 'Danh sách bài viết',
					key: '17',
					content: <BlogSection />,
				},
				{
					label: 'Danh mục bài viết',
					key: '18',
					content: <BlogCategoryPage />,
				},
			],
		},
		{
			label: 'Hỗ trợ',
			key: '20',
			icon: <CommentOutlined />,
			content: <Support />,
		},
	];

	const findMenuItem = (key) =>
		menuItems
			.flatMap((item) => item.children || item)
			.find((item) => item.key === key);

	const handleMenuSelect = (key) => {
		const selectedItem = findMenuItem(key);

		if (!selectedItem || !selectedItem.content) return;

		setSelectedKey(key);
		setSelectedContent(selectedItem.content);
		setSelectedLabel(
			typeof selectedItem.label === 'string'
				? selectedItem.label
				: key === '5'
					? 'Danh sách tài khoản'
					: 'Quản lý',
		);
	};

	const fetchPendingRequests = async () => {
		try {
			const response = await WalletServices.getRequests();
			const requests = Array.isArray(response?.data)
				? response.data
				: [];

			const pendingCount = requests.filter(
				(req) => req.status === 'ON_HOLD',
			).length;

			if (pendingCount > prevPendingRequests) {
				notification.destroy();

				notification.info({
					message: 'Yêu cầu hoàn tiền mới',
					description: `Có ${pendingCount - prevPendingRequests} yêu cầu hoàn tiền đang chờ duyệt.`,
					btn: (
						<Button
							type="primary"
							size="small"
							onClick={() => {
								handleMenuSelect('12');
								notification.destroy();
							}}
						>
							Xem ngay
						</Button>
					),
					duration: 5,
				});
			}

			setPrevPendingRequests(pendingCount);
		} catch (error) {
			console.error('Error fetching refund requests:', error);
		}
	};

	useEffect(() => {
		fetchPendingRequests();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		localStorage.setItem('theme', JSON.stringify(isDarkTheme));
	}, [isDarkTheme]);

	const toggleTheme = () => {
		setIsDarkTheme((previous) => !previous);
	};

	const handleExportClick = async () => {
		if (
			startDate &&
			endDate &&
			dayjs(endDate).isBefore(dayjs(startDate), 'day')
		) {
			message.error('Ngày kết thúc phải sau ngày bắt đầu.');
			return;
		}

		setButtonState('loading');
		setProgress(0);

		try {
			const params = {
				exportType,
				limit: 99,
				startDate: startDate
					? dayjs(startDate).format('YYYY-MM-DD')
					: undefined,
				endDate: endDate
					? dayjs(endDate).format('YYYY-MM-DD')
					: undefined,
			};

			const response = await AdminServices.getExport(
				params,
				(progressEvent) => {
					if (progressEvent.total) {
						const percent = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total,
						);
						setProgress(percent);
					}
				},
			);

			const disposition =
				response.headers?.['content-disposition'];

			let fileName = `${exportType}_report.xlsx`;

			if (disposition) {
				const match = disposition.match(/filename="?([^"]+)"?/);
				if (match?.[1]) fileName = match[1];
			}

			const blob = new Blob([response.data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});

			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');

			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);

			setButtonState('success');
			message.success('Xuất báo cáo thành công!');

			setTimeout(() => {
				setButtonState('idle');
				setExportModalVisible(false);
				setProgress(0);
			}, 900);
		} catch (error) {
			console.error('Lỗi khi xuất báo cáo:', error);
			setButtonState('idle');
			setProgress(0);

			const status = error?.response?.status;

			if (status === 400) {
				const data = error.response.data;
				const errorText =
					typeof data === 'string'
						? data
						: data?.message || '';

				message.error(
					errorText || 'Dữ liệu xuất báo cáo không hợp lệ.',
				);
			} else if (error?.response) {
				message.error('Xuất báo cáo thất bại. Vui lòng thử lại.');
			} else {
				message.error('Không thể kết nối đến server.');
			}
		}
	};

	const quickLinks = [
		{
			title: 'Quản lý tour',
			description: 'Tour và lịch trình',
			icon: <MdTour size={22} />,
			color: '#0284c7',
			background: isDark ? '#132a41' : '#eaf6ff',
			key: '8',
		},
		{
			title: 'Booking',
			description: 'Đơn đặt tour',
			icon: <FaMoneyCheckAlt size={20} />,
			color: '#059669',
			background: isDark ? '#12332e' : '#e8fbf3',
			key: '11',
		},
		{
			title: 'Voucher',
			description: 'Mã ưu đãi',
			icon: <FaTicketAlt size={20} />,
			color: '#d97706',
			background: isDark ? '#382819' : '#fff5e7',
			key: '13',
		},
		{
			title: 'Tài khoản',
			description: 'Người dùng',
			icon: <FaUsers size={20} />,
			color: '#7c3aed',
			background: isDark ? '#292044' : '#f2ecff',
			key: '5',
		},
	];

	const header = (
		<div
			style={{
				width: '100%',
				minHeight: 72,
				padding: '10px 24px',
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 16,
				background: colors.panel,
				borderBottom: `1px solid ${colors.border}`,
				boxSizing: 'border-box',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
				<div
					style={{
						width: 43,
						height: 43,
						borderRadius: 13,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
						color: '#fff',
						fontWeight: 900,
						fontSize: 22,
						boxShadow: '0 5px 15px rgba(14,165,233,.2)',
					}}
				>
					K
				</div>

				<div>
					<div
						style={{
							fontSize: 10,
							fontWeight: 800,
							letterSpacing: '0.16em',
							color: colors.primary,
						}}
					>
						TRAVEL WITH KEII
					</div>

					<div
						style={{
							fontSize: 19,
							fontWeight: 800,
							lineHeight: 1.5,
							color: colors.text,
						}}
					>
						Admin Dashboard
					</div>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: 12,
				}}
			>
				<div style={{ textAlign: 'right', marginRight: 4 }}>
					<div style={{ fontSize: 12, color: colors.muted }}>
						Xin chào,
					</div>
					<div
						style={{
							fontSize: 13,
							fontWeight: 700,
							color: colors.text,
						}}
					>
						{currentUser?.username ||
							currentUser?.name ||
							'Admin'}
					</div>
				</div>

				<Tooltip
					title={
						isDark
							? 'Chuyển sang giao diện sáng'
							: 'Chuyển sang giao diện tối'
					}
				>
					<Switch
						checked={isDark}
						onChange={toggleTheme}
						checkedChildren={<FaMoon size={13} />}
						unCheckedChildren={<CiLight size={17} />}
					/>
				</Tooltip>

				<Button
					type="primary"
					icon={<FaFileExport />}
					onClick={() => setExportModalVisible(true)}
					style={{
						height: 40,
						borderRadius: 11,
						fontWeight: 600,
						background: colors.primary,
						boxShadow: '0 5px 14px rgba(2,132,199,.16)',
					}}
				>
					Xuất báo cáo
				</Button>
			</div>
		</div>
	);

	const footer = (
		<div
			style={{
				padding: '17px 26px',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: 8,
				width: '100%',
				fontSize: 11,
				color: colors.muted,
				background: colors.panel,
				borderTop: `1px solid ${colors.border}`,
				boxSizing: 'border-box',
			}}
		>
			<span>© 2026 TRAVEL WITH KEII</span>
			<span>Travel management workspace</span>
		</div>
	);

	const appTheme = {
		algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
		token: {
			colorPrimary: colors.primary,
			colorInfo: colors.primary,
			colorBgContainer: colors.panel,
			colorBgLayout: colors.page,
			colorText: colors.text,
			colorTextSecondary: colors.muted,
			borderRadius: 12,
			fontFamily: "'Inter', 'Segoe UI', sans-serif",
		},
		components: {
			Table: {
				headerBg: isDark ? '#1c2a40' : '#f1f5f9',
				headerColor: colors.text,
				rowHoverBg: isDark ? '#1b2a40' : '#f0f9ff',
			},
			Button: {
				borderRadius: 10,
				controlHeight: 38,
			},
			Input: {
				borderRadius: 10,
				controlHeight: 40,
			},
			Select: {
				borderRadius: 10,
				controlHeight: 40,
			},
			Menu: {
				darkItemSelectedBg: 'rgba(56,189,248,0.15)',
				darkItemSelectedColor: '#e0f2fe',
			},
		},
	};

	return (
		<ConfigProvider theme={appTheme}>
			<Layout
				style={{
					minHeight: '100vh',
					background: colors.page,
					fontFamily: "'Inter', 'Segoe UI', sans-serif",
				}}
			>
				<AdminSidebar
					onSelect={handleMenuSelect}
					menuItems={menuItems}
					selectedKey={selectedKey}
				/>

				<Layout
					style={{
						minWidth: 0,
						background: colors.page,
					}}
				>
					<AdminHeader
						theme={isDark ? 'gray' : 'white'}
						children={header}
					/>

					<Content
						style={{
							padding: '28px clamp(16px, 3vw, 36px)',
							background: colors.page,
							minWidth: 0,
						}}
					>
						<div
							style={{
								margin: '0 auto',
								width: '100%',
								maxWidth: 1600,
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									marginBottom: 20,
									fontSize: 12,
									color: colors.muted,
								}}
							>
								<Breadcrumb
									items={[
										{
											title: (
												<Link
													to="/"
													style={{ color: colors.muted }}
												>
													Trang chủ
												</Link>
											),
										},
										{ title: 'Admin' },
										{ title: selectedLabel },
									]}
								/>
							</div>

							<div
								style={{
									position: 'relative',
									overflow: 'hidden',
									marginBottom: 24,
									padding: '27px clamp(20px, 3vw, 34px)',
									borderRadius: 20,
									background: isDark
										? 'linear-gradient(115deg, #12283e 0%, #172338 55%, #1d2340 100%)'
										: 'linear-gradient(115deg, #e8f5ff 0%, #f3f7ff 52%, #eff0ff 100%)',
									border: `1px solid ${colors.border}`,
								}}
							>
								<div
									style={{
										position: 'absolute',
										width: 220,
										height: 220,
										borderRadius: '50%',
										right: -55,
										top: -100,
										background: 'rgba(14,165,233,.10)',
										pointerEvents: 'none',
									}}
								/>

								<div
									style={{
										position: 'relative',
										zIndex: 1,
										display: 'flex',
										flexWrap: 'wrap',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: 20,
									}}
								>
									<div>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 7,
												marginBottom: 10,
												color: colors.primary,
												fontSize: 11,
												fontWeight: 800,
												letterSpacing: '0.15em',
											}}
										>
											<HiOutlineSparkles size={16} />
											TRAVEL WITH KEII / MANAGEMENT
										</div>

										<h1
											style={{
												fontSize: 'clamp(23px, 2.2vw, 30px)',
												lineHeight: 1.25,
												fontWeight: 850,
												letterSpacing: '-0.035em',
												color: colors.text,
												margin: 0,
											}}
										>
											{selectedLabel}
										</h1>

										<p
											style={{
												margin: '9px 0 0',
												fontSize: 13,
												lineHeight: 1.7,
												color: colors.muted,
												maxWidth: 520,
											}}
										>
											Quản lý hoạt động du lịch của bạn
											trong một không gian làm việc thống nhất.
										</p>
									</div>

									<div
										style={{
											padding: '13px 17px',
											background: isDark
												? 'rgba(255,255,255,.05)'
												: 'rgba(255,255,255,.76)',
											border: `1px solid ${
												isDark
													? 'rgba(255,255,255,.08)'
													: 'rgba(255,255,255,.9)'
											}`,
											borderRadius: 15,
											minWidth: 160,
										}}
									>
										<div
											style={{
												fontSize: 10,
												fontWeight: 800,
												letterSpacing: '0.12em',
												color: colors.muted,
												marginBottom: 7,
											}}
										>
											WORKSPACE
										</div>

										<div
											style={{
												fontSize: 14,
												fontWeight: 750,
												color: colors.text,
											}}
										>
											Admin Center
										</div>

										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 6,
												marginTop: 8,
												fontSize: 11,
												color: '#059669',
											}}
										>
											<span
												style={{
													width: 7,
													height: 7,
													background: '#10b981',
													borderRadius: '50%',
												}}
											/>
											Management panel
										</div>
									</div>
								</div>
							</div>

							{selectedKey === '1' && (
								<div style={{ marginBottom: 24 }}>
									<div
										style={{
											display: 'flex',
											alignItems: 'end',
											justifyContent: 'space-between',
											gap: 12,
											flexWrap: 'wrap',
											marginBottom: 13,
										}}
									>
										<div>
											<h2
												style={{
													margin: 0,
													fontSize: 17,
													fontWeight: 800,
													color: colors.text,
												}}
											>
												Truy cập nhanh
											</h2>
											<p
												style={{
													margin: '4px 0 0',
													fontSize: 12,
													color: colors.muted,
												}}
											>
												Các chức năng quản lý thường dùng
											</p>
										</div>
									</div>

									<div
										style={{
											display: 'grid',
											gridTemplateColumns:
												'repeat(auto-fit, minmax(min(100%, 215px), 1fr))',
											gap: 14,
										}}
									>
										{quickLinks.map((item) => (
											<button
												key={item.key}
												type="button"
												onClick={() =>
													handleMenuSelect(item.key)
												}
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: 13,
													textAlign: 'left',
													padding: 17,
													borderRadius: 15,
													border: `1px solid ${colors.border}`,
													background: colors.panel,
													color: colors.text,
													cursor: 'pointer',
													transition:
														'transform .18s ease, box-shadow .18s ease',
												}}
												onMouseEnter={(event) => {
													event.currentTarget.style.transform =
														'translateY(-2px)';
													event.currentTarget.style.boxShadow =
														'0 9px 22px rgba(15,23,42,.07)';
												}}
												onMouseLeave={(event) => {
													event.currentTarget.style.transform =
														'translateY(0)';
													event.currentTarget.style.boxShadow =
														'none';
												}}
											>
												<div
													style={{
														width: 46,
														height: 46,
														flexShrink: 0,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: 13,
														color: item.color,
														background: item.background,
													}}
												>
													{item.icon}
												</div>

												<div style={{ minWidth: 0, flex: 1 }}>
													<div
														style={{
															fontSize: 13,
															fontWeight: 800,
															marginBottom: 5,
														}}
													>
														{item.title}
													</div>
													<div
														style={{
															fontSize: 11,
															color: colors.muted,
														}}
													>
														{item.description}
													</div>
												</div>

												<FaArrowRight
													size={12}
													style={{ color: colors.muted }}
												/>
											</button>
										))}
									</div>
								</div>
							)}

							<div
								style={{
									padding: 'clamp(14px, 2vw, 25px)',
									minHeight: 420,
									borderRadius: 18,
									background: colors.panel,
									border: `1px solid ${colors.border}`,
									boxShadow: isDark
										? '0 8px 26px rgba(0,0,0,.08)'
										: '0 8px 26px rgba(15,23,42,.035)',
									color: colors.text,
									overflowX: 'auto',
								}}
							>
								{selectedContent}
							</div>
						</div>
					</Content>

					<AdminFooter children={footer} />
				</Layout>

				<Modal
					open={exportModalVisible}
					onCancel={() => {
						if (buttonState !== 'loading') {
							setExportModalVisible(false);
						}
					}}
					footer={null}
					width={460}
					centered
					destroyOnClose
					title={null}
				>
					<div style={{ padding: '8px 4px' }}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								marginBottom: 22,
							}}
						>
							<div
								style={{
									width: 46,
									height: 46,
									borderRadius: 13,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#0284c7',
									background: '#eaf6ff',
								}}
							>
								<FaFileExport size={20} />
							</div>

							<div>
								<div
									style={{
										fontSize: 10,
										fontWeight: 800,
										letterSpacing: '0.13em',
										color: '#0284c7',
										marginBottom: 4,
									}}
								>
									TRAVEL WITH KEII
								</div>

								<h3
									style={{
										fontSize: 21,
										fontWeight: 800,
										margin: 0,
									}}
								>
									Xuất báo cáo
								</h3>
							</div>
						</div>

						<div style={{ marginBottom: 17 }}>
							<div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>
								Ngày bắt đầu
							</div>
							<DatePicker
								className="w-full"
								value={startDate}
								onChange={setStartDate}
								format="DD/MM/YYYY"
								placeholder="Chọn ngày bắt đầu"
								style={{ width: '100%', height: 42 }}
							/>
						</div>

						<div style={{ marginBottom: 17 }}>
							<div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>
								Ngày kết thúc
							</div>
							<DatePicker
								className="w-full"
								value={endDate}
								onChange={setEndDate}
								format="DD/MM/YYYY"
								placeholder="Chọn ngày kết thúc"
								style={{ width: '100%', height: 42 }}
							/>
						</div>

						<div style={{ marginBottom: 22 }}>
							<div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>
								Loại báo cáo
							</div>
							<Select
								value={exportType}
								onChange={setExportType}
								style={{ width: '100%', height: 42 }}
								options={[
									{ value: 'booking', label: 'Booking' },
									{ value: 'tour', label: 'Tour' },
									{ value: 'user', label: 'User' },
								]}
							/>
						</div>

						{buttonState === 'loading' && (
							<div style={{ marginBottom: 16 }}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										fontSize: 12,
										marginBottom: 7,
									}}
								>
									<span>Đang tạo báo cáo...</span>
									<span>{progress}%</span>
								</div>

								<div
									style={{
										height: 6,
										borderRadius: 99,
										overflow: 'hidden',
										background: '#e2e8f0',
									}}
								>
									<div
										style={{
											height: '100%',
											width: `${progress}%`,
											background: '#0284c7',
											transition: 'width .2s ease',
										}}
									/>
								</div>
							</div>
						)}

						<Button
							block
							type="primary"
							size="large"
							icon={
								buttonState === 'success' ? (
									<FaCheck />
								) : (
									<FaFileExport />
								)
							}
							onClick={handleExportClick}
							loading={buttonState === 'loading'}
							style={{
								height: 45,
								borderRadius: 11,
								fontWeight: 700,
								background:
									buttonState === 'success'
										? '#059669'
										: '#0284c7',
							}}
						>
							{buttonState === 'success'
								? 'Hoàn tất'
								: 'Xuất báo cáo'}
						</Button>
					</div>
				</Modal>
			</Layout>
		</ConfigProvider>
	);
};

export default AdminHome;