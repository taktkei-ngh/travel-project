import { useEffect, useState } from 'react';
import { BlockOutlined, CommentOutlined, DesktopOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';
import {
	Badge,
	Breadcrumb,
	Button,
	ConfigProvider, DatePicker,
	Layout,
	message,
	Modal, notification,
	Select, Space,
	Switch,
	theme,
	Tooltip,
} from 'antd';
import { AdminSidebar } from '~/pages/Admin/components/AdminHome/AdminSidebar';
import { AdminHeader } from '~/pages/Admin/components/AdminHome/AdminHeader';
import { HomePage } from '~/pages/Admin/sections/HomePage/HomePage';
import { AdminFooter } from '~/pages/Admin/components/AdminHome/AdminFooter';
import TourList from '~/pages/Admin/sections/ToursPage/TourList';
import { Link } from 'react-router-dom';
import Support from '~/pages/Admin/Support';
import { useAuth } from '~/config/AuthContext';
import { BookingStatistic } from '~/pages/Admin/sections/StatisticGeneral/Sections/BookingStatistic';
import { BiSolidCategory } from 'react-icons/bi';
import { VoucherPage } from '~/pages/Admin/sections/VoucherPage/VoucherPage';
import { FaFileExport, FaMoon, FaCheck, FaMoneyCheckAlt } from 'react-icons/fa';
import { CiLight } from 'react-icons/ci';
import { CategoryPage } from '~/pages/Admin/sections/CategoryPage/CategoryPage';
import { HotelPage } from '~/pages/Admin/sections/HotelPage/HotelPage';
import { TransportationPage } from '~/pages/Admin/sections/TransportationPage/TransportationPage';
import { ReviewPage } from '~/pages/Admin/sections/ReviewPage/ReviewPage';
import { IoIosStar } from 'react-icons/io';
import { DestinationPage } from '~/pages/Admin/sections/DestinationPage/DestinationPage';
import { MdTour } from 'react-icons/md';
import { TbMessage2Dollar } from 'react-icons/tb';
import { GuidePage } from '~/pages/Admin/sections/GuidePage/GuidePage';
import { UserPage } from '~/pages/Admin/sections/UsersPage/UserPage';
import { ItineraryPage } from '~/pages/Admin/sections/ItineraryPage/ItineraryPage';
import { WalletPage } from '~/pages/Admin/sections/WalletPage/WalletPage';
import WalletServices from '~/services/WalletServices';
import { BlogSection } from '~/pages/Admin/sections/BlogSection/BlogSection';
import dayjs from 'dayjs';
import AdminServices from '~/services/AdminServices';
import { BookingPage } from '~/pages/Admin/sections/BookingSection/BookingPage';
import { BlogCategoryPage } from '~/pages/Admin/sections/BlogCategoryPage/BlogCategoryPage';

const { Content } = Layout;

const AdminHome = () => {
	const { currentUser } = useAuth();
	const [isDarkTheme, setIsDarkTheme] = useState(() => {
		try {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    } catch (error) {
        console.warn("Dữ liệu theme trong LocalStorage bị lỗi, đang reset về mặc định.");
        
        localStorage.removeItem('theme');
        
        return false;
    }
	});
	const [buttonState, setButtonState] = useState('idle'); // idle, loading, success
	const [exportModalVisible, setExportModalVisible] = useState(false);
	const [prevPendingRequests, setPrevPendingRequests] = useState(0);
	const [exportType, setExportType] = useState('booking'); // Giá trị mặc định
	const [startDate, setStartDate] = useState(dayjs().subtract(1, 'year')); // Mặc định: 1 năm trước
	const [endDate, setEndDate] = useState(dayjs()); // Mặc định: Hôm nay
	const [progress, setProgress] = useState(0); // State để theo dõi tiến trình tải

	const fetchPendingRequests = async () => {
		try {
			const response = await WalletServices.getRequests();
			const pendingCount = response.data.filter((req) => req.status === 'ON_HOLD').length;
			if (pendingCount > prevPendingRequests) {
				notification.destroy();
				notification.info({
					message: 'Yêu cầu hoàn tiền mới',
					description: `Có ${pendingCount - prevPendingRequests} yêu cầu hoàn tiền mới đang chờ duyệt.`,
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
					duration: 5, // Hiển thị 5 giây
				});
			}
			setPrevPendingRequests(pendingCount);
		} catch (error) {
			console.error('Error fetching refund requests:', error);
		}
	};

	useEffect(() => {
		fetchPendingRequests();
	}, []);

	useEffect(() => {
		localStorage.setItem('theme', JSON.stringify(isDarkTheme));
	}, [isDarkTheme]);

	const toggleTheme = () => {
		setIsDarkTheme(!isDarkTheme);
	};

	// hàm xuất báo cáo
	const handleExportClick = async () => {
		if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
			message.error('Ngày kết thúc phải sau ngày bắt đầu.');
			return;
		}

		setButtonState('loading');
		setProgress(0); // Reset tiến trình
		try {
			const params = {
				exportType,
				limit: 99,
				startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
				endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
			};

			// Gọi API với callback tiến trình
			const response = await AdminServices.getExport(params, (progressEvent) => {
				const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				setProgress(percentCompleted);
			});

			// Lấy tên file từ header Content-Disposition
			const contentDisposition = response.headers['content-disposition'];
			let fileName = `${exportType}_report.xlsx`;
			if (contentDisposition) {
				const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
				if (fileNameMatch && fileNameMatch[1]) {
					fileName = fileNameMatch[1];
				}
			}

			// Tạo Blob và kích hoạt tải file
			const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			setButtonState('success');
			message.success('Xuất báo cáo thành công!', 1);
			setTimeout(() => {
				setButtonState('idle');
				setExportModalVisible(false);
				setProgress(0); // Reset tiến trình sau khi hoàn tất
			}, 1000);
		} catch (error) {
			console.error('Lỗi khi xuất báo cáo:', error);
			setButtonState('idle');
			setProgress(0);
			if (error.response) {
				if (error.response.status === 400) {
					const errorMessage = await error.response.data.text();
					message.error(errorMessage || 'Loại xuất không được hỗ trợ hoặc dữ liệu không hợp lệ.');
				} else {
					message.error('Xuất báo cáo thất bại. Vui lòng thử lại.');
				}
			} else {
				message.error('Không thể kết nối đến server. Vui lòng thử lại.');
			}
		}
	};

	const menuItems = [
		{ label: 'Trang chủ', key: '1', icon: <DesktopOutlined />, content: <HomePage /> },
		{
			label: 'Tài khoản',
			key: 'sub2',
			icon: <TeamOutlined />,
			children: [
				{
					label: <Tooltip placement={'right'} title={'Danh sách tài khoản'}>Danh sách tài khoản</Tooltip>,
					key: '5',
					content: <UserPage />,
				},
				{ label: 'Hướng dẫn viên', key: '6', content: <GuidePage /> },
			],
		},
		{
			label: 'Tour',
			key: 'sub3',
			icon: <MdTour color={'orange'} />,
			children: [
				{
					label: <Tooltip placement={'right'} title={'Danh sách danh mục con'}>Danh sách danh mục
						con</Tooltip>,
					key: '7',
					content: <CategoryPage />,
				},
				{ label: 'Danh sách tour', key: '8', content: <TourList /> },
				{
					label: <Tooltip placement={'right'} title={'Giao diện Lịch trình'}>Giao diện Lịch trình</Tooltip>,
					key: '9',
					content: <ItineraryPage />,
				},
			],
		},
		{
			label: 'Booking',
			key: 'sub4',
			icon: <FaMoneyCheckAlt color={'green'} />,
			children: [
				{
					label: <Tooltip placement={'right'} title={'Thống kê booking'}>Thống kê booking</Tooltip>,
					key: '10',
					content: <BookingStatistic />,
				},
				{
					label: <Tooltip placement={'right'} title={'Danh sách booking'}>Danh sách booking</Tooltip>,
					key: '11',
					content: <BookingPage />,
				},
				{
					label: <Tooltip placement={'right'} title={'Danh sách yêu cầu hoàn tiền'}>Danh sách yêu cầu hoàn
						tiền</Tooltip>,
					key: '12',
					content: <WalletPage />,
				},
			],
		},
		{
			label: 'Khuyến mãi',
			key: 'sub5',
			icon: <TbMessage2Dollar color={'yellow'} />,
			children: [
				{ label: 'Danh sách', key: '13', content: <VoucherPage /> },
			],
		},
		{
			label: 'Danh mục',
			key: 'sub6',
			icon: <BiSolidCategory color={'yellow'} />,
			children: [
				{ label: 'Khách sạn', key: '14', content: <HotelPage /> },
				{ label: 'Phương tiện', key: '15', content: <TransportationPage /> },
				{ label: 'Điểm đến', key: '16', content: <DestinationPage /> },
			],
		},
		{
			label: 'Đánh giá',
			key: 'sub7',
			icon: <IoIosStar color={'yellow'} />,
			content: <ReviewPage />,
		},
		{
			label: 'Blogs',
			key: 'sub8',
			icon: <BlockOutlined />,
			children: [
				{ label: 'Danh sách bài viết', key: '17', content: <BlogSection /> },
				{ label: 'Danh mục bài viết', key: '18', content: <BlogCategoryPage /> },
			],
		},
		{ label: 'Hỗ trợ', key: '20', icon: <CommentOutlined />, content: <Support /> },
		// {
		//     label: 'Ví tiền', key: '21', icon: <FaMoneyCheckAlt />, content: <WalletPage />,
		// },
	];

	const [selectedContent, setSelectedContent] = useState(menuItems[0].content);
	const [selectedLabel, setSelectedLabel] = useState(menuItems[0].label);

	const handleMenuSelect = (key) => {
		const selectedItem = menuItems.flatMap((item) => item.children || item).find((item) => item.key === key);
		setSelectedContent(selectedItem ? selectedItem.content : 'Content not found');
		setSelectedLabel(selectedItem ? selectedItem.label : 'Label not found');
	};

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const header = (
		<div className="w-full flex items-center justify-between gap-4">
			<div className="flex items-center gap-4">
				<h2 className={isDarkTheme ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-black'}>Admin
					Dashboard</h2>
				<Link className={isDarkTheme ? 'text-blue-300' : 'text-blue-500'} to={'/'}>HomePage</Link>
				<div className="flex items-center justify-end mx-auto gap-4">
                    <span
											className={isDarkTheme ? 'text-white' : 'text-gray-500'}>Chào mừng, {currentUser.username}</span>
					<Tooltip title={isDarkTheme ? 'Chuyển sang Light Theme' : 'Chuyển sang Dark Theme'}>
						<Switch
							checked={isDarkTheme}
							onChange={toggleTheme}
							checkedChildren={<FaMoon size={16} className="text-black items-center mt-0.5" />}
							unCheckedChildren={<CiLight size={18} className="text-white items-center mt-0.5" />}
						/>
					</Tooltip>
				</div>
			</div>
			<div className="flex items-center justify-end gap-4">
				<Button
					type={'default'}
					icon={<FaFileExport size={16} />}
					onClick={() => setExportModalVisible(true)}
				>
					Xuất báo cáo
				</Button>
			</div>
		</div>
	);

	const footer = (
		<Tooltip title={'ĐƯỢC TẠO VÀ THIẾT KẾ BỞI TUNZ - TN1608'}>
			Pacific ©2025 Created by Pacific Team
		</Tooltip>
	);

	const lightTheme = {
		algorithm: theme.defaultAlgorithm,
		token: {
			colorPrimary: '#1890ff',
			colorBgContainer: '#fff',
		},
		components: {
			Table: {
				colorBgContainer: '#fff',
				headerBg: '#fff',
			},
		},
	};

	const darkTheme = {
		algorithm: theme.darkAlgorithm,
		token: {
			colorText: '#fff',
			colorTextLabel: '#fff',
			colorBgContainer: '#838383',
		},
		components: {
			Table: {
				colorBgContainer: '#838383',
				headerBg: '#838383',
				colorText: '#fff',
			},
		},
	};

	return (
		<ConfigProvider theme={isDarkTheme ? darkTheme : lightTheme}>
			<Layout className={isDarkTheme ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-white'}>
				<AdminSidebar onSelect={handleMenuSelect} menuItems={menuItems} />
				<Layout className="site-layout">
					<AdminHeader theme={isDarkTheme ? 'gray' : 'white'} children={header} />
					<Modal
						open={exportModalVisible}
						onCancel={() => setExportModalVisible(false)}
						footer={null}
						width={400}
						centered
						className={`${
							isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'
						} rounded-lg`}>
						<div className="p-4">
							<h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
								Xuất báo cáo
							</h3>
							<Space>
								<DatePicker
									className="w-full mt-2"
									placeholder="Chọn ngày bắt đầu"
									onChange={(date) => setStartDate(date)}
									format="YYYY-MM-DD"
									style={{ width: '100%' }}
								/>
								<DatePicker
									className="w-full mt-2"
									placeholder="Chọn ngày kết thúc"
									onChange={(date) => setEndDate(date)}
									format="YYYY-MM-DD"
									style={{ width: '100%' }}
								/>
							</Space>
							<div className={'mt-4'}>
								<p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
									Chọn loại báo cáo muốn xuất:
								</p>
								{/*Giá trị xuất báo cáo ở BE (switch - case )*/}
								<Select
									className="w-full mt-2"
									value={exportType}
									onChange={(value) => setExportType(value)}
									options={[
										{ value: 'booking', label: 'Booking' },
										{ value: 'tour', label: 'Tour' },
										{ value: 'user', label: 'User' },
									]}
								/>
							</div>
							<div className="flex justify-end mt-4">
								<Button
									icon={
										buttonState === 'loading' ? (
											<span className="inline-block animate-arrow-down">↓</span>
										) : buttonState === 'success' ? (
											<FaCheck className="text-white" />
										) : (
											<FaFileExport className="text-white" />
										)
									}
									className={`
                        flex items-center
                        px-4 py-2 rounded-md text-white
                        transition-all duration-300 ease-in-out
                        ${
										buttonState === 'success'
											? 'bg-green-500 border-green-500'
											: buttonState === 'loading'
												? 'bg-gray-400 border-gray-400 cursor-wait'
												: isDarkTheme
													? 'bg-blue-600 border-blue-600 hover:bg-blue-500'
													: 'bg-blue-500 border-blue-500 hover:bg-blue-600'
									}
                    `}
									onClick={handleExportClick}
									disabled={buttonState === 'loading'}
								>
									{buttonState === 'success' ? 'Hoàn tất' : 'Xuất báo cáo'}
								</Button>
							</div>
						</div>
					</Modal>

					<Content className="p-4">
						<Breadcrumb className="mb-4">
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							<Breadcrumb.Item>{selectedLabel}</Breadcrumb.Item>
						</Breadcrumb>
						<div
							className={`p-4 ${colorBgContainer} ${borderRadiusLG}`}
							style={{
								background: isDarkTheme ? '#1f1f1f' : '#fff',
								color: isDarkTheme ? '#fff' : '#000',
							}}
						>
							{selectedContent}
						</div>
					</Content>
					<AdminFooter children={footer} />
				</Layout>
			</Layout>
		</ConfigProvider>
	);
};

export default AdminHome;