import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Modal, Select, Space, Spin, Table, Tooltip } from 'antd';
import config from '~/config';
import { PlusOutlined, FileTextOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import AdminServices from '~/services/AdminServices';
import TourServices from '~/services/TourServices';

export const StatisticTourSection = () => {
    const [open, setOpen] = useState(false);
    const [tours, setTours] = useState([]);
    const [bookingCount, setBookingCount] = useState([]); // Dữ liệu cho Table
    const [selectData, setSelectData] = useState([]); // Dữ liệu cho Select
    const [selectedTourId, setSelectedTourId] = useState(''); // Lưu tourId được chọn
    const [modalData, setModalData] = useState({ tourId: '', tourDetailId: '' }); // Lưu dữ liệu cho Modal
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Lấy danh sách tour để điền vào Select
    useEffect(() => {
        const fetchTours = async () => {
            setIsLoading(true);
            try {
                const response = await TourServices.getAllTour({});
                setTours(response.data);
                const tourOptions = response.data.map((tour) => ({
                    value: tour.id,
                    label: tour.title,
                }));
                setSelectData(tourOptions);
            } catch (error) {
                console.error('Error fetching tours:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTours();
    }, []);

    // Gọi API bookingCountData khi selectedTourId thay đổi
    useEffect(() => {
        if (selectedTourId) {
            const fetchBookingCount = async () => {
                setIsLoading(true);
                try {
                    const response = await AdminServices.getBookingCount({ tourId: selectedTourId });
                    // Thêm key cho mỗi item để Table hoạt động đúng
                    const dataWithKey = response.data.map((item, index) => ({
                        ...item,
                        key: index.toString(),
                    }));
                    setBookingCount(dataWithKey);
                } catch (error) {
                    console.error('Error fetching booking count:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBookingCount();
        }
    }, [selectedTourId]);

    // Xử lý khi người dùng chọn tour từ Select
    const handleSelectChange = (value) => {
        setSelectedTourId(value);
        setBookingCount([]);
    };
    const handleOpenModal = (record) => {
        setModalData({
            tourId: record.tourID, // Lấy tourID từ row
            tourDetailId: record.tourDetailId, // Lấy tourDetailId từ row
        });
        setOpen(true); // Mở Modal
    };
    // Cấu hình columns cho Table
    const columns = [
        {
            title: 'Tên tour',
            dataIndex: 'tourTitle',
            showSorterTooltip: { target: 'full-header' },
            onFilter: (value, record) => record.tourTitle.toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.tourTitle.localeCompare(b.tourTitle),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Số lượng đặt tour',
            dataIndex: 'bookingCount',
            defaultSortOrder: 'descend',
            showSorterTooltip: { target: 'full-header' },
            onFilter: (value, record) => record.bookingCount.toString().includes(value),
            sorter: (a, b) => a.bookingCount - b.bookingCount,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Ngày bắt đầu tour',
            dataIndex: 'startDate',
            render: (text) => `${text}`,
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Ngày kết thúc tour',
            dataIndex: 'endDate',
            render: (text) =>  `${text}`,
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Tổng tiền tour',
            dataIndex: 'totalAmount',
            render: (text) => `${config.webConfig.getCurrency(text)}`,
            showSorterTooltip: { target: 'full-header' },
            onFilter: (value, record) => record.totalAmount.toString().includes(value),
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Mã booking',
            dataIndex: 'bookingNo', // Sửa từ totalAmount thành bookingNo
        },
        {
            title: 'Chi tiết',
            render: (_, record) => (
                <Space>
                    <Tooltip placement="top" title={'Xem chi tiết tour'}>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => handleOpenModal(record)} // Gọi hàm với dữ liệu row
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Card 
            className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden dashboard-card"
            style={{ background: '#fff' }}
            bodyStyle={{ padding: '0' }}
        >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-600 p-1 rounded-md mr-2">
                        <FileTextOutlined className="h-5 w-5" style={{ fontSize: '20px' }} />
                    </span>
                    Danh sách tour bán chạy
                </h3>

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <label className="text-md font-medium text-gray-700 flex items-center">
                            <SearchOutlined className="h-4 w-4 mr-1 text-gray-500" />
                            Chọn tour để xem chi tiết
                        </label>
                        <Select
                            className="w-full"
                            placeholder="Chọn tour từ danh sách"
                            showSearch
                            allowClear
                            loading={isLoading && !selectedTourId}
                            filterSort={(optionA, optionB) =>
                                optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                            }
                            options={selectData}
                            onChange={handleSelectChange}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ borderRadius: '8px' }}
                            notFoundContent={
                                <div className="py-2 text-center text-gray-500">
                                    Không tìm thấy tour phù hợp
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-5 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                        <Spin tip="Đang tải dữ liệu..." />
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={bookingCount}
                        onChange={onChange}
                        showSorterTooltip={{ target: 'sorter-icon' }}
                        pagination={{ 
                            pageSize: 10, 
                            hideOnSinglePage: true,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total) => `Tổng cộng ${total} bản ghi`
                        }}
                        loading={isLoading && selectedTourId}
                        className="custom-table"
                        locale={{ 
                            emptyText: (
                                <div className="py-8 flex flex-col items-center">
                                    <FileTextOutlined className="h-16 w-16 text-gray-300 mb-2" style={{ fontSize: '64px' }} />
                                    {selectedTourId ? (
                                        <p className="text-gray-500">Không có dữ liệu cho tour này</p>
                                    ) : (
                                        <p className="text-gray-500">Vui lòng chọn tour để xem dữ liệu</p>
                                    )}
                                </div>
                            ) 
                        }}
                    />
                </div>
            </div>

            {/* Modal */}
            <Modal
                footer={null}
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center text-lg font-bold text-gray-800">
                        <span className="bg-green-100 text-green-600 p-1 rounded-md mr-2">
                            <InfoCircleOutlined className="h-5 w-5" style={{ fontSize: '20px' }} />
                        </span>
                        Chi tiết tour
                    </div>
                }
                className="rounded-lg"
                width={500}
            >
                <div className="flex flex-col gap-4 p-2">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-gray-700 mb-2">
                            <span className="font-bold text-gray-800 mr-2">Mã tour:</span> 
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">{modalData.tourId}</span>
                        </p>
                        <p className="text-gray-700">
                            <span className="font-bold text-gray-800 mr-2">Mã chi tiết tour:</span> 
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{modalData.tourDetailId}</span>
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button 
                            onClick={() => setOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};
