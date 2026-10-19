import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Steps } from 'antd';
import { Loading } from '~/component/ui/Loading';
import { BookingInfo1 } from '~/pages/Booking/components/BookingInfo1';
import TourDetailServices from '~/services/TourDetailServices';

export const Booking = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [tour, setTour] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        TourDetailServices.getTourDetailById(id)
            .then((res) => {
                setTour(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
            <h1 className="text-2xl sm:text-3xl font-semibold text-orange-600 mb-6 text-center">
                Quy trình đặt tour
            </h1>

            {/* Steps component */}
            <Steps
                status="process"
                progressDot
                size="small"
                current={1}
                className="mb-6 sm:mb-8 w-full max-w-3xl mx-auto"
                direction="horizontal"
                responsive
                items={[
                    {
                        title: <span className="text-xs sm:text-sm">Chọn tour</span>,
                        description: <span className="text-xs">Chọn tour bạn muốn đặt</span>,
                    },
                    {
                        title: <span className="text-xs sm:text-sm">Thông tin đặt tour</span>,
                        description: <span className="text-xs">Điền thông tin khách hàng và tour</span>,
                    },
                    {
                        title: <span className="text-xs sm:text-sm">Hoàn tất thanh toán</span>,
                        description: <span className="text-xs">Xác nhận và thanh toán tour</span>,
                    },
                ]}
            />

            {/* Main content */}
            <div className="w-full">
                <BookingInfo1 data={tour} />
            </div>
        </div>
    );
};