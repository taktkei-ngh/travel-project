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
	Pagination,
	Progress,
	QRCode,
	Rate,
	Skeleton,
	Space,
	Table,
	Tabs,
} from 'antd';
import { BookedTourCard } from '~/pages/Account/historyBooked/components/BookedTourCard';
import React, { useEffect, useState } from 'react';
import BookingServices from '~/services/BookingServices';
import config from '~/config';
import { FaTags } from 'react-icons/fa';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

export const BookedTour = () => {
	const ITEM_PER_PAGE = 3;
	const token = localStorage.getItem('accessToken');
	const location = useLocation();
	const [currentPage, setCurrentPage] = useState({
		PENDING: 1,
		PAID: 1,
		CANCELLED: 1,
		EXPIRED: 1,
		ON_GOING: 1,
		COMPLETED: 1,
		ON_HOLD: 1,
	});
	const [tourInfo, setTourInfo] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeSubTab, setActiveSubTab] = useState(location.state?.subTab || 'PENDING');
	const [bookingRedirect, setBookingRedirect] = useState(location.state?.bookingNo || null);

	useEffect(() => {
		if (location.state?.subTab) {
			setActiveSubTab(location.state.subTab);
		}
		if (location.state?.bookingNo) {
			setBookingRedirect(location.state.bookingNo);
		}
	}, [location.state]);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			const bookingRes = await BookingServices.getBookingList(token);
			setTourInfo(bookingRes.data);
			setLoading(false);
		} catch (err) {
			console.error('Error fetching bookings:', err);
			setLoading(false);
			message.error('Có lỗi xảy ra! Vui lòng báo cáo với quản trị viên.', 1);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, [token]);

	const handleUpdateBooking = (updatedBooking) => {
		setTourInfo((prev) =>
			prev.map((booking) =>
				booking.id === updatedBooking.id ? updatedBooking : booking,
			),
		);
	};

	const filterToursByStatus = (statuses) => {
		if (Array.isArray(statuses)) {
			return tourInfo.filter((booking) => statuses.includes(booking.status));
		}
		return tourInfo.filter((booking) => booking.status === statuses);
	};

	const getPageItems = (statuses) => {
		const tabKey = Array.isArray(statuses) ? statuses.join('_') : statuses;
		const current = currentPage[tabKey] || 1;
		const startIndex = (current - 1) * ITEM_PER_PAGE;
		const endIndex = startIndex + ITEM_PER_PAGE;

		const filteredItems = filterToursByStatus(statuses);
		return filteredItems.slice(startIndex, endIndex);
	};

	const onPageChange = (status, page) => {
		setLoading(true);
		setCurrentPage((prev) => ({
			...prev,
			[status]: page,
		}));
		setTimeout(() => {
			setLoading(false);
		}, 400);
	};

	const renderTabContent = (statuses) => {
		const tabKey = Array.isArray(statuses) ? statuses.join('_') : statuses;
		const pageItems = getPageItems(statuses);
		const totalItems = filterToursByStatus(statuses).length;

		return (
			<div className="space-y-4">
				<div className="flex flex-col gap-4">
					{loading ? (
						Array.from({ length: ITEM_PER_PAGE }).map((_, index) => (
							<Skeleton
								key={index}
								active
								avatar={{ shape: 'square', size: 'large' }}
								paragraph={{ rows: 4 }}
								title={false}
								className="p-4 bg-white rounded-lg shadow-lg border-2"
							/>
						))
					) : pageItems.length > 0 ? (
						pageItems.map((item, index) => (
							<BookedTourCard
								key={item.id || index}
								data={item}
								tour={item.tourDetail?.tour}
								voucher={item.voucher}
								onUpdateBooking={handleUpdateBooking}
								selectedBooking={bookingRedirect}
							/>
						))
					) : (
						<div className="text-center py-4">Không có dữ liệu</div>
					)}
				</div>
				{totalItems > 0 && (
					<Pagination
						align="center"
						onChange={(page) => onPageChange(tabKey, page)}
						pageSize={ITEM_PER_PAGE}
						current={currentPage[tabKey]}
						total={totalItems}
					/>
				)}
			</div>
		);
	};

	const tabItems = [
		{
			key: 'PENDING',
			label: 'Đang chờ',
			children: renderTabContent('PENDING'),
		},
		{
			key: 'PAID',
			label: 'Đã trả tiền',
			children: renderTabContent('PAID'),
		},
		{
			key: 'ON_GOING',
			label: 'Tour đang đi',
			children: renderTabContent('ON_GOING'),
		},
		{
			key: 'COMPLETED',
			label: 'Đã hoàn thành tour',
			children: renderTabContent('COMPLETED'),
		},
		{
			key: 'ON_HOLD',
			label: 'Chờ hoàn tiền',
			children: renderTabContent('ON_HOLD'),
		},
		{
			key: 'CANCELLED',
			label: 'Đã hủy',
			children: renderTabContent('CANCELLED'),
		},
		{
			key: 'EXPIRED',
			label: 'Hết hạn',
			children: renderTabContent('EXPIRED'),
		},
	];

	return (
		<div className="container mx-auto px-4">
			<div className="flex justify-center">
				<div className="w-full">
					<Tabs activeKey={activeSubTab}
								onChange={setActiveSubTab}
								items={tabItems} />
				</div>
			</div>
		</div>
	);
};