import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Divider, Drawer, Input, Progress, Rate, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export const ReviewSection = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const showReviews = () => {
        setOpen(!open);
    };
    const onClose = () => {
        setOpen(false);
    };
    const sampleReviews = [
        {
            name: 'Nguyễn Văn A',
            date: '27/9/2024',
            avatar: 'https://i.imgur.com/0wZf9eW.png',
            rating: 5,
            comment: 'Dịch vụ tuyệt vời! Xe sạch sẽ và tài xế rất thân thiện.',
        },
        {
            name: 'Trần Thị B',
            date: '16/6/2024',
            avatar: 'https://i.imgur.com/0wZf9eW.png',
            rating: 4,
            comment: 'Chuyến đi an toàn, sẽ quay lại lần sau.',
        },
    ];
    const ratings = [
        { label: "Đáng giá tiền", value: 4.0, percent: 80 },
        { label: "Tiện nghi", value: 5.0, percent: 100 },
        { label: "Chất lượng dịch vụ", value: 4.0, percent: 80 },
        { label: "Dễ tiếp cận", value: 4.0, percent: 80 },
    ];
    return (
        <>
            <div className={'flex flex-wrap items-center w-fit justify-between gap-4'}>
                <h3 className="text-2xl font-semibold mb-4">Đánh giá của khách hàng</h3>
                <button onClick={showReviews} className={'text-blue-500 text-lg font-bold mb-2'}>Xem tất cả</button>
                <Drawer
                    title="Đánh giá của khách hàng"
                    placement="right"
                    closable
                    onClose={onClose}
                    open={open}
                    width={600}
                >
                    {/* Tìm kiếm và bộ lọc */}
                    <div className="flex gap-4 items-center mb-4">
                        <Input
                            placeholder="Tìm đánh giá"
                            prefix={<SearchOutlined />}
                            className="flex-1"
                        />
                        <Select defaultValue="Tất cả" className="w-32">
                            <Select.Option value="Tất cả">Ngôn ngữ</Select.Option>
                            <Select.Option value="vi">Tiếng Việt</Select.Option>
                            <Select.Option value="en">Tiếng Anh</Select.Option>
                        </Select>
                    </div>

                    {/* Thanh biểu đồ đánh giá */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span>Đáng giá tiền</span>
                            <Progress percent={80} showInfo={false} />
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Chất lượng dịch vụ</span>
                            <Progress percent={70} showInfo={false} />
                        </div>
                    </div>

                    <Divider />

                    {/* Danh sách đánh giá */}
                    <div className="flex flex-col gap-4">
                        {sampleReviews.map((review, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <img
                                    src={review.avatar}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{review.name}</h3>
                                    <p className="text-sm text-gray-500">{review.date}</p>
                                    <Rate disabled value={review.rating} />
                                    <p className="mt-1 text-gray-700">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Drawer>
            </div>

            {/*    TOTAL RATING*/}
            <div className="flex items-center gap-4 mt-4">
                <Rate disabled value={4.5} />
                <span className="text-lg font-semibold">4.5</span>
                <span className="text-gray-500"> - </span>
                <span className={"text-lg font-semibold"}>Xuất sắc</span>
                <span className={"text-gray-500"}> (9 đánh giá)</span>
            </div>
            <div className={"flex flex-col gap-6 mt-5"}>
                <div className="grid grid-cols-2 gap-6">
                    {ratings.map((item, index) => (
                        <div key={index} className="flex flex-row items-center justify-between w-full">
                            <span className="w-40">{item.label}</span>
                            <Progress
                                percent={item.percent}
                                strokeColor="#FFC107"
                                showInfo={false}
                                className="flex-1 mx-4"
                            />
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};