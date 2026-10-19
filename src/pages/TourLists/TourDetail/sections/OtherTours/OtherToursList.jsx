import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TourCard } from '~/pages/TourLists/TourDetail/sections/OtherTours/Components/TourCard';
import { Pagination, Skeleton } from 'antd';
import config from '~/config';
import { Loading } from '~/component/ui/Loading';
import TourServices from '~/services/TourServices';

export const OtherToursList = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const ITEM_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);

    const onChange = (e) => {
        setPageLoading(true);
        setCurrentPage(e);
        setTimeout(() => {
            setPageLoading(false);
        }, 500);
    };

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await TourServices.getAllTour({});
                const published = res.data.filter((tour) => tour.status === 'PUBLISHED' && tour.id !== id);
                setTours(published || []);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching tours:', error);
                setTours([]);
            }
        };

        fetchTours();
    }, [id]);

    const handleTourClick = (id) => {
        setLoading(true);
        navigate(config.routes.tourDetail + id, { replace: true });
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const page = tours.slice((currentPage - 1) * ITEM_PER_PAGE, currentPage * ITEM_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {loading && <Loading />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pageLoading ? (
                    Array.from({ length: ITEM_PER_PAGE }).map((_, index) => (
                        <Skeleton
                            key={index}
                            active
                            avatar={{ shape: 'square', size: 'large' }}
                            paragraph={{ rows: 2 }}
                            className="p-4"
                        />
                    ))
                ) : (
                    page.map((tour, index) => (
                        <TourCard key={index} data={tour} onClick={handleTourClick} />
                    ))
                )}
            </div>
            <Pagination
                rootClassName="my-6 sm:my-10"
                align="center"
                defaultCurrent={1}
                total={tours.length}
                pageSize={ITEM_PER_PAGE}
                onChange={(e) => onChange(e)}
                className="text-sm sm:text-base"
            />
        </div>
    );
};