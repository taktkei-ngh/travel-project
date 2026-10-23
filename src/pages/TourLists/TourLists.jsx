import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pagination, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import {
    FaCompass,
    FaMapMarkerAlt,
    FaArrowRight,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import config from '~/config';
import { useAuth } from '~/config/AuthContext';
import TourServices from '~/services/TourServices';
import { SearchBar } from '~/pages/TourLists/components/SearchBar';
import { TourCards } from '~/pages/TourLists/components/TourCards';
import { Aside } from '~/pages/TourLists/components/Aside';
import { SearchFilterBar } from '~/pages/TourLists/components/SearchFilterBar';
import { EmptyComponent } from '~/component/ui/EmptyComponent';

export const TourLists = ({ titleType }) => {
    const token = localStorage.getItem('accessToken');
    const { getWishlist } = useAuth();
    const { t } = useTranslation();

    const ITEM_PER_PAGE = 6;
    const isDomestic = titleType === 'INSIDE';

    const [currentPage, setCurrentPage] = useState(1);
    const [tours, setTours] = useState([]);
    const [query, setQuery] = useState({});
    const [loading, setLoading] = useState(false);

    const pageTitle = isDomestic
        ? 'Tour trong nước'
        : 'Tour nước ngoài';

    const pageDescription = isDomestic
        ? 'Khám phá những điểm đến tuyệt đẹp trên khắp Việt Nam.'
        : 'Mở rộng hành trình, khám phá những vùng đất mới trên thế giới.';

    const bannerImages = [
        {
            src: config.webConfig.banner1,
            title: isDomestic ? 'Khám phá Việt Nam' : 'Khám phá thế giới',
            subtitle: isDomestic
                ? 'Những hành trình đáng nhớ ngay trên quê hương mình'
                : 'Mỗi chuyến đi là một câu chuyện mới',
        },
        {
            src: config.webConfig.banner2,
            title: 'Bắt đầu hành trình',
            subtitle: 'Tìm điểm đến phù hợp với phong cách của bạn',
        },
        {
            src: config.webConfig.banner3,
            title: 'Đi để trải nghiệm',
            subtitle: 'Lưu giữ những khoảnh khắc đáng nhớ cùng ROAM',
        },
    ];

    // Load wishlist khi người dùng đã đăng nhập.
    useEffect(() => {
        if (token) {
            getWishlist(token);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Load tour theo bộ lọc và loại tour.
    useEffect(() => {
        let isMounted = true;

        const fetchTours = async () => {
            setLoading(true);

            try {
                const params = {
                    status: 'PUBLISHED',
                    region: titleType,
                };

                if (query.title) {
                    params.title = query.title;
                }

                if (query.categoryId != null) {
                    params.categoryId = query.categoryId;
                }

                if (query.startDate) {
                    params.startDate = query.startDate;
                }

                if (query.endDate) {
                    params.endDate = query.endDate;
                }

                if (query.minPrice != null && query.minPrice !== '') {
                    params.minPrice = query.minPrice;
                }

                if (query.maxPrice != null && query.maxPrice !== '') {
                    params.maxPrice = query.maxPrice;
                }

                const response = await TourServices.getAllTour(params);
                const data = Array.isArray(response?.data)
                    ? response.data
                    : [];

                if (isMounted) {
                    setTours(
                        data.filter(
                            (tour) => tour.status === 'PUBLISHED'
                        )
                    );
                }
            } catch (error) {
                console.error('Error fetching tours:', error);

                if (isMounted) {
                    setTours([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTours();

        return () => {
            isMounted = false;
        };
    }, [query, titleType]);

    // Lọc và sắp xếp phía client.
    const allFilteredTours = useMemo(() => {
        let result = [...tours];

        if (query.rate != null && query.rate !== '') {
            const rating = Number(query.rate);

            if (rating === 5) {
                result = result.filter(
                    (tour) => Number(tour.ratingAvg) === 5
                );
            } else {
                result = result.filter(
                    (tour) => (Number(tour.ratingAvg) || 0) >= rating
                );
            }
        }

        if (query.searchPrices === 'HighToLow') {
            result.sort(
                (a, b) =>
                    (Number(b.maxPrice) || 0) -
                    (Number(a.maxPrice) || 0)
            );
        } else if (query.searchPrices === 'LowToHigh') {
            result.sort(
                (a, b) =>
                    (Number(a.maxPrice) || 0) -
                    (Number(b.maxPrice) || 0)
            );
        }

        return result;
    }, [tours, query.rate, query.searchPrices]);

    const filteredTours = useMemo(() => {
        const start = (currentPage - 1) * ITEM_PER_PAGE;

        return allFilteredTours.slice(start, start + ITEM_PER_PAGE);
    }, [allFilteredTours, currentPage]);

    const totalItems = allFilteredTours.length;

    // Tìm kiếm: giữ các khóa dữ liệu mà SearchBar hiện tại sử dụng.
    const handleSearch = (searchQuery) => {
        const nextQuery = { ...query };

        nextQuery.title = searchQuery.searchText || undefined;
        nextQuery.categoryId = searchQuery.searchSides ?? undefined;
        nextQuery.startDate = searchQuery.startDate ?? undefined;
        nextQuery.endDate = searchQuery.endDate ?? undefined;
        nextQuery.minPrice = searchQuery.minPrice ?? undefined;
        nextQuery.maxPrice = searchQuery.maxPrice ?? undefined;

        setQuery(nextQuery);
        setCurrentPage(1);
    };

    // Giữ callback tương thích với Aside và SearchFilterBar.
   const handleFilterChange = useCallback((nextQuery) => {
    setQuery((previous) => {
        if (typeof nextQuery === 'function') {
            return nextQuery(previous);
        }

        return nextQuery;
    });

    setCurrentPage(1);
}, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [titleType]);

    const revealVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: 'easeOut' },
        },
    };

    return (
        <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-[#f7f6f0]">
            {/* Hero banner */}
            <section className="relative w-full min-w-0">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    loop
                    slidesPerView={1}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    className="h-[300px] w-full sm:h-[360px] lg:h-[440px]"
                >
                    {bannerImages.map((banner, index) => (
                        <SwiperSlide key={`${banner.title}-${index}`}>
                            <div className="relative h-full w-full overflow-hidden bg-[#142a20]">
                                <img
                                    src={banner.src}
                                    alt={banner.title}
                                    className="h-full w-full object-cover brightness-[45%]"
                                />

                                <div className="absolute inset-0 bg-gradient-to-r from-[#0c1d15]/85 via-[#0c1d15]/40 to-transparent" />

                                <div className="absolute inset-0 flex items-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.65 }}
                                        className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"
                                    >
                                        <div className="max-w-3xl">
                                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-200 backdrop-blur-sm">
                                                <FaCompass />
                                                ROAM · EXPLORE MORE
                                            </div>

                                            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                                {banner.title}
                                            </h1>

                                            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">
                                                {banner.subtitle}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Page heading */}
            <section className="mx-auto w-full min-w-0 max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
                <motion.div
                    variants={revealVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex min-w-0 flex-col gap-5 md:flex-row md:items-end md:justify-between"
                >
                    <div className="min-w-0">
                        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-600 sm:text-sm">
                            <FaMapMarkerAlt />
                            ROAM · YOUR NEXT JOURNEY
                        </p>

                        <h2 className="break-words text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            {pageTitle}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                            {pageDescription}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm md:self-auto">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <FaCompass />
                        </span>

                        <div>
                            <p className="text-xs text-gray-500">
                                Tour phù hợp
                            </p>
                            <p className="font-bold text-gray-900">
                                {loading ? 'Đang tải...' : `${totalItems} tour`}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Main search */}
            <section className="mx-auto mt-8 w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="w-full min-w-0 rounded-2xl border border-white bg-white p-3 shadow-sm sm:p-5">
                    <SearchBar onSearch={handleSearch} query={query} />
                </div>

                <div className="mt-4 w-full min-w-0">
                    <SearchFilterBar
                        onSearch={handleFilterChange}
                        query={query}
                    />
                </div>
            </section>

            {/* Sidebar + results: constrained grid prevents horizontal overflow */}
            <section className="mx-auto mt-8 w-full min-w-0 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
               <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
             {/* Tour filters */}
<aside className="w-full min-w-0 shrink-0 lg:w-[300px]">
    <div className="w-full min-w-0 overflow-visible">
        <Aside
            query={query}
            setQuery={handleFilterChange}
            titleType={titleType}
        />
    </div>
</aside>

                    {/* Result list */}
                    <div className="w-full min-w-0">
                        <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="min-w-0">
                                <h3 className="break-words text-lg font-extrabold text-gray-900 sm:text-xl">
                                    Các hành trình dành cho bạn
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Chọn chuyến đi phù hợp với lịch trình của bạn.
                                </p>
                            </div>

                            <span className="w-fit shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
                                {totalItems} kết quả
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
                                {Array.from(
                                    { length: ITEM_PER_PAGE },
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4"
                                        >
                                            <Skeleton
                                                active
                                                avatar={false}
                                                paragraph={{ rows: 4 }}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : filteredTours.length > 0 ? (
                            <motion.div
                                key={`${titleType}-${currentPage}-${JSON.stringify(query)}`}
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.07 },
                                    },
                                }}
                                className="grid w-full min-w-0 grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 xl:grid-cols-3"
                            >
                                {filteredTours.map((tour) => (
                                    <motion.div
                                        key={tour.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 16 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: { duration: 0.4 },
                                            },
                                        }}
                                        className="flex w-full min-w-0 justify-center"
                                    >
                                        <div className="w-full min-w-0 max-w-[280px]">
                                            <TourCards data={tour} />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex min-h-[320px] w-full min-w-0 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 p-6">
                                <EmptyComponent description={t('tour')} />
                            </div>
                        )}

                        {!loading && totalItems > 0 && (
                            <div className="mt-8 flex w-full min-w-0 flex-col items-center gap-3 rounded-2xl border border-white bg-white p-4 sm:p-5">
                                <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                                    Trang {currentPage} /{' '}
                                    {Math.ceil(totalItems / ITEM_PER_PAGE)}
                                </p>

                                <Pagination
                                    align="center"
                                    current={currentPage}
                                    total={totalItems}
                                    pageSize={ITEM_PER_PAGE}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    responsive
                                    showLessItems
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="mx-auto mb-12 mt-2 w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 flex-col items-start justify-between gap-4 rounded-2xl bg-[#13271d] p-6 text-white sm:flex-row sm:items-center sm:p-8">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                            ROAM · EXPLORE MORE
                        </p>

                        <h3 className="mt-2 break-words text-xl font-extrabold sm:text-2xl">
                            Hành trình tiếp theo đang chờ bạn
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-white/65">
                            Khám phá thêm những nơi bạn chưa từng đặt chân đến.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                        }
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-400 px-5 py-3 text-sm font-bold text-[#17271f] transition-colors hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                        Lên đầu trang
                        <FaArrowRight />
                    </button>
                </div>
            </section>
        </main>
    );
};

export default TourLists;
