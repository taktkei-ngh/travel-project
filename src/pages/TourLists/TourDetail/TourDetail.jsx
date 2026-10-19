import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider } from 'antd';
import { CalendarSection } from '~/pages/TourLists/TourDetail/sections/CalendarSection/CalendarSection';
import { OtherToursList } from '~/pages/TourLists/TourDetail/sections/OtherTours/OtherToursList';
import { Loading } from '~/component/ui/Loading';
import TourServices from '~/services/TourServices';
import config from '~/config';
import { ItinerarySection } from '~/pages/TourLists/TourDetail/sections/ItinerarySection/ItinerarySection';

export const TourDetail = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [tour, setTour] = useState({});

    useEffect(() => {
        TourServices.getById(id)
            .then((res) => {
                setTour(res.data);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Loading />;
    }
    if (!tour) return config.routes.home;
    console.log(tour);
    return (
        <div className="bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{tour.title}</h1>
                <div className="flex flex-col gap-6">
                    <CalendarSection data={tour} />
                    <ItinerarySection data={tour} />
                    <Divider>
                        <p className="font-bold uppercase text-orange-400 text-xl sm:text-2xl lg:text-3xl text-center">
                            Tour khác liên quan
                        </p>
                    </Divider>
                    <OtherToursList />
                </div>
            </div>
        </div>
    );
};