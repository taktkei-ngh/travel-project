import { WishlistCard } from '~/pages/Account/ProfileUI/sections/WishList/components/WishlistCard';
import { useEffect, useMemo, useState } from 'react';
import TourServices from '~/services/TourServices';
import { Empty, Pagination, Skeleton } from 'antd'; // Thêm Pagination từ Ant Design
import { useAuth } from '~/config/AuthContext';

export const WishListIndex = () => {
    const { wishlist, setWishlist, getWishlist } = useAuth();
    const accessToken = localStorage.getItem('accessToken');

    const [tours, setTours] = useState([]);
    const [wishlistUpdate, setWishlistUpdate] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const [pageSize, setPageSize] = useState(4); // Số lượng mục trên mỗi trang (mặc định là 4)

    useEffect(() => {
        if (accessToken) {
            setLoading(true);
            getWishlist(accessToken)
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                });
        }
    }, [accessToken, wishlistUpdate]);

    useEffect(() => {
        TourServices.getAllTour({})
            .then((res) => {
                setTours(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const tourMap = useMemo(() => {
        return tours.reduce((acc, tour) => {
            acc[tour.id] = tour;
            return acc;
        }, {});
    }, [tours]);

    // Tính toán các mục hiển thị trên trang hiện tại
    const paginatedWishlist = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return wishlist.slice(startIndex, endIndex);
    }, [wishlist, currentPage, pageSize]);

    // Xử lý khi người dùng chuyển trang
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang khi chuyển trang
    };

    return (
        <div className="justify-center flex w-full min-h-[350px] overflow-hidden">
            <div className="w-full">
                {/* Danh sách wishlist */}
                <div className="grid grid-cols-2 gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                active
                                avatar={{ shape: 'square', size: 'large' }}
                                paragraph={{ rows: 2 }}
                                title
                                className="p-4 bg-white rounded-lg shadow-md"
                            />
                        ))
                    ) : wishlist.length > 0 ? (
                        paginatedWishlist.map((wish, index) => {
                            const tour = tourMap[wish.tourId];
                            return tour ? (
                                <WishlistCard
                                    key={wish.id || index}
                                    data={tour}
                                    wishlistId={wish.id}
                                    onWishlistChange={() => setWishlistUpdate((prev) => prev + 1)}
                                />
                            ) : null;
                        })
                    ) : (
                        <div className="p-2 py-36 col-span-2 w-full max-h-screen justify-center flex">
                            <Empty description="Danh sách yêu thích trống" image="/img/a.gif" />
                        </div>
                    )}
                </div>

                {/* Phân trang */}
                {wishlist.length > 0 && !loading && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={wishlist.length}
                            onChange={handlePageChange}
                            pageSizeOptions={['4', '8', '12']} // Tùy chọn số lượng mục trên mỗi trang
                        />
                    </div>
                )}
            </div>
        </div>
    );
};