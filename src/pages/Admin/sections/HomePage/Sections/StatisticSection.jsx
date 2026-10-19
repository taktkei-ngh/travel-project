import React, { useCallback, useEffect, useState } from 'react';
import { Card, DatePicker, Spin, Table, Tabs } from 'antd';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminServices from '~/services/AdminServices';
import moment from 'moment';
import config from '~/config';
import { CalendarOutlined, BarChartOutlined, DollarOutlined, TeamOutlined, InboxOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export const StatisticSection = () => {
    const [activeChartTab, setActiveChartTab] = useState('year');
    const [activeTableTab, setActiveTableTab] = useState('revenue');
    const [salesRanking, setSalesRanking] = useState([]);
    const [topBooked, setTopBooked] = useState([]);
    const [dataByYears, setDataByYears] = useState([]);
    const [dataMonths, setDataMonths] = useState([]);
    const [years, setYears] = useState({ years: new Date().getFullYear() });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm gọi API với useCallback
    const fetchBookingRevenue = useCallback(async () => {
        try {
            const res = await AdminServices.getBookingRevenue({
                tourId: null,
                startDate: startDate || `${years.years}-01-01`,
                endDate: endDate || `${years.years}-12-31`,
            });
            const ranking = res
                .reduce((acc, item) => {
                    const existing = acc.find((x) => x.tourId === item.tourId);
                    if (existing) {
                        existing.tourRevenue = Number(existing.tourRevenue) + Number(item.tourRevenue);
                    } else {
                        acc.push({
                            tourId: item.tourId,
                            tourTitle: item.tourTitle,
                            tourRevenue: Number(item.tourRevenue),
                        });
                    }
                    return acc;
                }, [])
                .sort((a, b) => b.tourRevenue - a.tourRevenue)
                .map((item, index) => ({
                    key: item.tourId,
                    rank: index + 1,
                    name: item.tourTitle,
                    value: config.webConfig.getCurrency(item.tourRevenue),
                }));
            setSalesRanking(ranking);
        } catch (error) {
            console.error('Error fetching booking revenue:', error);
            setSalesRanking([]);
        }
    }, [startDate, endDate, years.years]);

    const fetchTopBookedTours = useCallback(async () => {
        try {
            const res = await AdminServices.getTopBookedTours({
                limit: 5,
                startDate: startDate || `${years.years}-01-01`,
                endDate: endDate || `${years.years}-12-31`,
            });
            const booked = res.data.map((item, index) => ({
                key: item.tourId,
                rank: index + 1,
                name: item.tourTitle,
                value: item.bookingCount,
            }));
            setTopBooked(booked);
        } catch (error) {
            console.error('Error fetching top booked tours:', error);
            setTopBooked([]);
        }
    }, [startDate, endDate, years.years]);

    const fetchYearlyRevenues = useCallback(async () => {
        try {
            const res = await AdminServices.getBookingRevenuesByYear();
            setDataByYears(
                res.map((item) => ({
                    bookingDate: item.bookingYear || item.bookingDate,
                    totalRevenue: Number(item.totalRevenue) || 0,
                })),
            );
        } catch (error) {
            console.error('Error fetching yearly revenues:', error);
            setDataByYears([]);
        }
    }, []);

    const fetchMonthlyRevenues = useCallback(async () => {
        try {
            const res = await AdminServices.getBookingRevenueMonthByYear(years);
            const allMonths = Array.from({ length: 12 }, (_, index) => ({
                bookingDate: `${index + 1}`,
                totalRevenue: 0,
            }));
            res.forEach((item) => {
                const monthIndex = parseInt(item.bookingDate, 10) - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    allMonths[monthIndex].totalRevenue = Number(item.totalRevenue) || 0;
                }
            });
            setDataMonths(allMonths);
        } catch (error) {
            console.error('Error fetching monthly revenues:', error);
            setDataMonths(
                Array.from({ length: 12 }, (_, index) => ({
                    bookingDate: `${index + 1}`,
                    totalRevenue: 0,
                })),
            );
        }
    }, [years]);

    // Gộp các API vào một useEffect với Promise.all
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchBookingRevenue(),
                    fetchTopBookedTours(),
                    fetchYearlyRevenues(),
                    fetchMonthlyRevenues(),
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchBookingRevenue, fetchTopBookedTours, fetchYearlyRevenues, fetchMonthlyRevenues]);

    // Cột cho bảng
    const salesColumns = [
        { title: 'Số thứ tự', dataIndex: 'rank', key: 'rank', width: 100 },
        { title: 'Tên tour', dataIndex: 'name', key: 'name' },
        { title: 'Doanh thu', dataIndex: 'value', key: 'value', width: 150 },
    ];

    const bookedColumns = [
        { title: 'Số thứ tự', dataIndex: 'rank', key: 'rank', width: 100 },
        { title: 'Tên tour', dataIndex: 'name', key: 'name' },
        { title: 'Số lượng đặt', dataIndex: 'value', key: 'value', width: 150 },
    ];

    // Hàm định dạng tiền tệ ngắn gọn cho trục Y
    const formatCurrency = (value) => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(0)} tỷ`;
        }
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(0)} triệu`;
        }
        return `${config.webConfig.getCurrency(value)}`;
    };

    return (
        <Card
            className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden dashboard-card"
            style={{ background: '#fff' }}
            bodyStyle={{ padding: '0' }}
        >
            {/* Header with controls */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Tabs
                            defaultActiveKey="year"
                            onChange={setActiveChartTab}
                            tabBarStyle={{ 
                                color: '#1F2937', 
                                fontWeight: 600, 
                                marginBottom: 0,
                                borderBottom: 'none'
                            }}
                            className="font-medium custom-tabs"
                        >
                            <Tabs.TabPane 
                                tab={
                                    <span className="flex items-center">
                                        <CalendarOutlined className="h-4 w-4 mr-1" />
                                        Theo năm
                                    </span>
                                } 
                                key="year" 
                            />
                            <Tabs.TabPane 
                                tab={
                                    <span className="flex items-center">
                                        <CalendarOutlined className="h-4 w-4 mr-1" />
                                        Theo tháng
                                    </span>
                                } 
                                key="month" 
                            />
                        </Tabs>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                        {activeChartTab === 'month' && (
                            <div className="flex gap-2">
                                {[2023, 2024, 2025].map((year) => (
                                    <button
                                        key={year}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                            years.years === year
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white text-gray-600 hover:bg-indigo-100 border border-gray-200'
                                        }`}
                                        onClick={() => setYears({ years: year })}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                        <RangePicker
                            format="DD-MM-YYYY"
                            onChange={(date, dateString) => {
                                if (!dateString[0] || !dateString[1]) {
                                    setStartDate(null);
                                    setEndDate(null);
                                } else {
                                    const formattedStartDate = moment(dateString[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
                                    const formattedEndDate = moment(dateString[1], 'DD-MM-YYYY').format('YYYY-MM-DD');
                                    setStartDate(formattedStartDate);
                                    setEndDate(formattedEndDate);
                                }
                            }}
                            className="border-gray-300 rounded-md w-full sm:w-auto shadow-sm"
                            placeholder={['Từ ngày', 'Đến ngày']}
                            style={{ background: 'white' }}
                        />
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="p-5 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                        <Spin tip="Đang tải dữ liệu..." />
                    </div>
                )}

                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 p-1 rounded-md mr-2">
                        <BarChartOutlined className="h-5 w-5" style={{ fontSize: '20px' }} />
                    </span>
                    {activeChartTab === 'year' ? 'Doanh thu theo năm' : `Doanh thu tháng - ${years.years}`}
                </h3>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={activeChartTab === 'year' ? dataByYears : dataMonths}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="bookingDate"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: '#D1D5DB' }}
                                tickFormatter={(value) =>
                                    activeChartTab === 'month' ? `Tháng ${value}` : value
                                }
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: '#D1D5DB' }}
                                domain={[0, 'auto']}
                                tickFormatter={formatCurrency}
                            />
                            <Tooltip
                                formatter={(value) => [config.webConfig.getCurrency(value), 'Doanh thu']}
                                contentStyle={{
                                    background: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: 'none',
                                    padding: '10px'
                                }}
                                labelFormatter={(label) =>
                                    activeChartTab === 'month' ? `Tháng ${label}` : `Năm ${label}`
                                }
                                cursor={{ fill: 'rgba(236, 253, 245, 0.4)' }}
                            />
                            <Bar
                                dataKey="totalRevenue"
                                fill={activeChartTab === 'year' ? '#6366F1' : '#F97316'}
                                radius={[6, 6, 0, 0]}
                                barSize={activeChartTab === 'year' ? 40 : 30}
                                animationDuration={1000}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-5 pt-0">
                <div className="mt-6 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                        <Tabs
                            defaultActiveKey="revenue"
                            onChange={setActiveTableTab}
                            tabBarStyle={{ 
                                color: '#1F2937', 
                                fontWeight: 600, 
                                marginBottom: 0,
                                padding: '0 16px'
                            }}
                            className="custom-tabs"
                        >
                            <Tabs.TabPane 
                                tab={
                                    <span className="flex items-center py-3">
                                        <DollarOutlined className="h-4 w-4 mr-1" />
                                        Top doanh thu
                                    </span>
                                } 
                                key="revenue" 
                            />
                            <Tabs.TabPane 
                                tab={
                                    <span className="flex items-center py-3">
                                        <TeamOutlined className="h-4 w-4 mr-1" />
                                        Top lượt đặt
                                    </span>
                                } 
                                key="booked" 
                            />
                        </Tabs>
                    </div>

                    <Table
                        columns={activeTableTab === 'revenue' ? salesColumns : bookedColumns}
                        dataSource={activeTableTab === 'revenue' ? salesRanking : topBooked}
                        pagination={{ pageSize: 5, hideOnSinglePage: true }}
                        rowKey="key"
                        scroll={{ x: 'max-content' }}
                        loading={isLoading}
                        className="custom-table"
                        locale={{ 
                            emptyText: (
                                <div className="py-6 flex flex-col items-center">
                                    <InboxOutlined className="h-12 w-12 text-gray-300 mb-2" style={{ fontSize: '48px' }} />
                                    <p className="text-gray-500">Không có dữ liệu</p>
                                </div>
                            ) 
                        }}
                    />
                </div>
            </div>
        </Card>
    );
};
