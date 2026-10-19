import React, { useEffect, useState } from 'react';
import { Button, Calendar, Card, Divider, Image, Menu, Rate, Skeleton } from 'antd';
import dayjs from 'dayjs';
import BookingServices from '~/services/BookingServices';
import config from '~/config';
import TourDetailServices from '~/services/TourDetailServices';
import HotelServices from '~/services/HotelServices';
import TransportServices from '~/services/TransportServices';
import { FaBus, FaCalendarAlt, FaChild, FaHotel, FaMoneyBill, FaUser } from 'react-icons/fa';
import { PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const CalendarSection = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [month, setMonth] = useState([]);
	const [days, setDays] = useState([]);
	const [tourDetail, setTourDetail] = useState(data.detail[0]);
	const [transport, setTransport] = useState({});
	const [hotel, setHotel] = useState({});
	const [selectedMonth, setSelectedMonth] = useState();
	const [selectedDay, setSelectedDay] = useState();
	const [toggle, setToggle] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		BookingServices.getInfoMonth(data.id)
			.then((res) => setMonth(res.data))
			.catch((err) => console.error(err));
	}, []);

	const handleSelectedMonth = async (month) => {
		setSelectedMonth(month);
		setToggle(true);
		await BookingServices.getInfoDay({ tourId: data.id, months: month })
			.then((res) => setDays(res.data))
			.catch((err) => console.error(err));
	};

	const selectTourDetail = async (id) => {
		setToggle(false);
		setLoading(true);
		await TourDetailServices.getTourDetailById(id)
			.then((res) => setTourDetail(res.data))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (month.length > 0) {
			setSelectedMonth(month[0]?.getDate);
			handleSelectedMonth(month[0]?.getDate);
		}
	}, [month]);

	useEffect(() => {
		if (tourDetail?.hotelId) {
			HotelServices.getHotelById(tourDetail.hotelId)
				.then((res) => setHotel(res))
				.catch((err) => console.error(err));
		}
		if (tourDetail?.transportId) {
			TransportServices.getTransportById(tourDetail.transportId)
				.then((res) => setTransport(res))
				.catch((err) => console.error(err));
		}
	}, [tourDetail]);

	return (
		<>
			{/* Hình ảnh và Booking Info */}
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
				<div className="w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
						<Image
							src={config.imageConfig.getImage(data.thumbnail)}
							alt="Main Tour"
							height={{ xs: 'auto', sm: 'auto', lg: 650 }}
							rootClassName="col-span-1 sm:col-span-1 lg:col-span-3 rounded-xl w-full object-cover shadow-lg aspect-[3/2] sm:aspect-auto"
						/>
						<div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
							{data.images.map((img, index) => (
								<img
									key={index}
									src={config.imageConfig.getImage(img)}
									alt="subImage"
									className="rounded-xl w-full h-full object-cover shadow-lg"
								/>
							))}
						</div>
					</div>
				</div>
				<Card
					className="w-full sm:max-w-md lg:max-w-sm p-4 h-fit shadow-xl rounded-2xl lg:ms-10 lg:sticky lg:top-20"
				>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4 text-red-600">
						Giá: {config.webConfig.getCurrency(tourDetail?.priceAdults)} / Người
					</h2>
					<div className="space-y-2 text-sm sm:text-base">
						<p><strong>Mã tour:</strong> {data.id}</p>
						<p><strong>Điểm đến:</strong> {data.destination.city}</p>
						<p>
							<strong>Ngày khởi hành:</strong>{' '}
							{tourDetail.startDate
								? config.webConfig.convertDateNoTime(tourDetail.startDate)
								: 'Chưa có thông tin'}
						</p>
						<p>
							<strong>Thời gian:</strong> {data.duration} ngày {data.duration - 1} đêm
						</p>
						<p>
							<strong>Số lượng: </strong> {tourDetail.quantity} chỗ trống
						</p>
						<p>
							<strong>Trung bình đánh giá:</strong> <Rate allowHalf defaultValue={data.ratingAvg} disabled />
						</p>
					</div>
					<div className="flex space-x-4 mt-4">
						<Button
							disabled={
								tourDetail?.priceAdults === null ||
								!days.some((day) => day.status === 'OPEN')
							}
							onClick={() => navigate(config.routes.booking + `${tourDetail.id}`)}
							type="primary"
							className="bg-red-500 w-full"
						>
							Đặt tour
						</Button>
					</div>
					<div className="mt-4">
						<Button
							icon={<PhoneOutlined />}
							className="w-full bg-gray-100 text-sm sm:text-base"
						>
							Gọi miễn phí qua internet
						</Button>
					</div>
				</Card>
			</div>

			<Divider className="my-6 sm:my-8">
				<p className="font-bold uppercase text-orange-400 text-xl sm:text-2xl lg:text-3xl text-center">
					Lịch trình khởi hành
				</p>
			</Divider>

			{/* Menu Tháng và Calendar */}
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
				<Card className="xl:w-1/4 md:w-full sm:w-full lg:w-1/4 h-fit p-3 sm:p-4 shadow-lg">
					<h2 className="font-bold mb-2 text-base sm:text-lg">Chọn tháng</h2>
					<Menu
						defaultSelectedKeys={selectedMonth}
						mode="vertical"
						className="text-sm sm:text-base"
					>
						{month.map((m) => (
							<Menu.Item
								onClick={() => handleSelectedMonth(m.getDate)}
								className="text-blue-500 font-bold"
								key={m.getDate}
							>
								{config.webConfig.convertMonthYear(m.getDate)}
							</Menu.Item>
						))}
					</Menu>
				</Card>

				<div className="w-full">
					{toggle ? (
						<Card className="w-full h-[435px] sm:h-fit shadow-lg">
							<Calendar
								value={selectedMonth ? dayjs(selectedMonth, 'YYYY-MM') : dayjs()}
								fullscreen={false}
								onPanelChange={(date) => handleSelectedMonth(date.format('YYYY-MM'))}
								headerRender={() => null}
								fullCellRender={(date) => {
									const day = date.date();
									const monthYear = date.format('YYYY-MM');
									const currentMonth = selectedMonth || dayjs().format('YYYY-MM');
									const validDay = days.find(
										(d) => Number(d.getDate) === day && monthYear === currentMonth,
									);

									return (
										<div
											onClick={() => {
												if (
													validDay &&
													validDay.status !== 'IN_PROGRESS' &&
													validDay.status !== 'CLOSED'
												) {
													setSelectedDay(validDay.getDate);
													selectTourDetail(validDay.getId).then((r) => r);
												}
											}}
											className={`text-center p-1 sm:p-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm
                                            ${
												monthYear !== currentMonth
													? 'text-gray-300'
													: validDay
														? validDay.status === 'OPEN'
															? 'border border-red-500 text-red-500 hover:bg-red-100 cursor-pointer'
															: validDay.status === 'IN_PROGRESS'
																? 'border border-orange-500 text-orange-500 cursor-not-allowed'
																: validDay.status === 'CLOSED'
																	? 'border border-gray-500 text-gray-500 cursor-not-allowed'
																	: 'border border-red-500 text-red-500 hover:bg-red-100 cursor-pointer'
														: 'text-gray-700'
											}`}
										>
											{day}
											{validDay && (
												<div className="text-[10px] sm:text-xs font-bold">
													{validDay.status === 'OPEN'
														? 'Tour đang mở!'
														: validDay.status === 'IN_PROGRESS'
															? 'Tour đang diễn ra!'
															: validDay.status === 'CLOSED'
																? 'Tour đã đóng!'
																: 'Tour đang bán!'}
												</div>
											)}
										</div>
									);
								}}
							/>
						</Card>
					) : (
						<Card className="w-full lg:w-[960px] p-4 sm:p-6 shadow-lg rounded-xl">
							{loading ? (
								<Skeleton active paragraph={{ rows: 10 }} style={{ padding: '20px' }} />
							) : (
								<>
									<h2 className="font-bold text-red-500 text-xl sm:text-2xl lg:text-3xl text-center">
										{selectedDay}/{config.webConfig.convertMonthYear(selectedMonth)}
									</h2>
									<div className="mt-4">
										<h2 className="text-orange-500 text-center text-base sm:text-lg lg:text-xl font-bold uppercase">
											Thông tin khởi hành
										</h2>
										<div
											className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 text-gray-700 text-sm sm:text-base">
											<p className="flex flex-col gap-2 font-semibold">
												<div className="flex flex-wrap gap-2 items-center">
													<FaHotel className="text-orange-500" /> Khách sạn:{' '}
													<span className="text-gray-500">{hotel.name || 'Đang tải...'}</span>
												</div>
												<div className="flex flex-wrap gap-2 items-center">
													<FaMoneyBill className="text-orange-500" /> Giá:{' '}
													<span className="text-gray-500">
                                                        {config.webConfig.getCurrency(hotel.cost) || 'Đang tải...'}
                                                    </span>
												</div>
											</p>
											<p className="flex flex-col gap-2 font-semibold">
												<div className="flex flex-wrap gap-2 items-center">
													<FaBus className="text-orange-500" /> Phương tiện:{' '}
													<span
														className="text-gray-500">{transport.name || 'Đang tải...'}</span>
												</div>
												<div className="flex flex-wrap gap-2 items-center">
													<FaMoneyBill className="text-orange-500" /> Giá:{' '}
													<span className="text-gray-500">
                                                        {config.webConfig.getCurrency(transport.cost) || 'Đang tải...'}
                                                    </span>
												</div>
											</p>
											<p className="flex flex-col gap-2 font-semibold">
												<div className="flex flex-wrap gap-2 items-center">
													<FaCalendarAlt className="text-orange-500" /> Ngày khởi hành:{' '}
													<span className="text-gray-500">
                                                        {selectedDay}/{config.webConfig.convertMonthYear(selectedMonth)}
                                                    </span>
												</div>
												<div className="flex flex-wrap gap-2 items-center">
													<FaCalendarAlt className="text-orange-500" /> Ngày về:{' '}
													<span className="text-gray-500">
                                                        {tourDetail.endDate
																													? config.webConfig.convertDateNoTime(tourDetail.endDate)
																													: `${selectedDay}/${config.webConfig.convertMonthYear(
																														selectedMonth,
																													)}`}
                                                    </span>
												</div>
											</p>
										</div>
									</div>
									<Divider />
									<h2 className="text-center text-orange-500 text-base sm:text-lg lg:text-xl font-bold uppercase">
										Giá tour
									</h2>
									<div
										className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 p-3 sm:p-4 text-sm sm:text-base">
										<div className="space-y-3">
											<p className="font-semibold flex items-center gap-2">
												<FaUser className="text-red-500" /> Người lớn:{' '}
												<span className="text-red-500">
                                                    {config.webConfig.getCurrency(tourDetail.priceAdults)}
                                                </span>
											</p>
											<p className="font-semibold flex items-center gap-2">
												<FaChild className="text-red-500" /> Trẻ em:{' '}
												<span className="text-red-500">
                                                    {config.webConfig.getCurrency(tourDetail.priceChildren)}
                                                </span>
											</p>
										</div>
										<div className="space-y-3">
											<p className="font-semibold flex items-center gap-2">
												<FaHotel className="text-red-500" /> Giá khách sạn:{' '}
												<span className="text-red-500">
                                                    {config.webConfig.getCurrency(hotel.cost)}
                                                </span>
											</p>
											<p className="font-semibold flex items-center gap-2">
												<FaBus className="text-red-500" /> Giá phương tiện:{' '}
												<span className="text-red-500">
                                                    {config.webConfig.getCurrency(transport.cost)}
                                                </span>
											</p>
										</div>
									</div>
									<Divider />
									<p
										className="text-red-500 text-center font-bold italic p-3 sm:p-4 rounded-lg bg-blue-50 mx-auto text-sm sm:text-base">
										Giá tour mỗi người chưa bao gồm khách sạn, dịch vụ, phương tiện - Chúc bạn có
										chuyến đi vui vẻ!
									</p>
								</>
							)}
						</Card>
					)}
				</div>
			</div>
		</>
	);
};