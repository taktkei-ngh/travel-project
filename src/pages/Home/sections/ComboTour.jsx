
import React, { useEffect, useMemo, useState } from 'react';
import { Divider, Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import { TourCards } from '~/pages/Home/components/TourCards';
import TourServices from '~/services/TourServices';
import SearchBar from '../components/SearchBar';
import { EmptyComponent } from '~/component/ui/EmptyComponent';

export const ComboTour = () => {
    const ITEM_PER_PAGE = 8;

    const [currentPage, setCurrentPage] = useState(1);
    const [tours, setTours] = useState([]);
    const [query, setQuery] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: 'beforeChildren',
                staggerChildren: 0.07,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 18, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    const handleSearch = (searchQuery) => {
        const filterSearch = {};

        if (searchQuery.searchText) {
            filterSearch.title = searchQuery.searchText;
        }
        if (searchQuery.searchSides != null) {
            filterSearch.categoryId = searchQuery.searchSides;
        }
        if (searchQuery.maxPrice != null) {
            filterSearch.maxPrice = searchQuery.maxPrice;
        }
        if (searchQuery.minPrice != null) {
            filterSearch.minPrice = searchQuery.minPrice;
        }
        if (searchQuery.startDate) {
            filterSearch.startDate = searchQuery.startDate;
        }
        if (searchQuery.endDate) {
            filterSearch.endDate = searchQuery.endDate;
        }
        if (searchQuery.region) {
            filterSearch.region = searchQuery.region;
        }

        setQuery(filterSearch);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        let isMounted = true;

        const fetchTours = async () => {
            setLoading(true);

            try {
                const res = await TourServices.getAllTour(query);
                const tourData = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res)
                        ? res
                        : [];

                const published = tourData.filter(
                    (tour) => tour.status === 'PUBLISHED'
                );

                if (isMounted) {
                    setTours(published);
                }
            } catch (error) {
                console.error('Không thể tải danh sách combo tour:', error);

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
    }, [query]);

    const pageItem = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
        return tours.slice(startIndex, startIndex + ITEM_PER_PAGE);
    }, [tours, currentPage]);

    return (
        <section className="relative isolate overflow-hidden bg-white py-14 sm:py-18 lg:py-24">
            <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 right-0 -z-10 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12"
            >
                <motion.div
                    variants={itemVariants}
                    className="mb-10 text-center sm:mb-12"
                >
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-sm">
                        ROAM · TRAVEL COLLECTION
                    </p>

                    <Divider
                        className="!my-0 font-bold uppercase"
                        style={{ borderColor: '#60a5fa' }}
                        orientation="center"
                    >
                        <h2 className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text px-2 text-2xl font-extrabold text-transparent sm:text-3xl lg:text-4xl">
                            {t('comboTour.tour1')}
                        </h2>
                    </Divider>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                        {t('comboTour.tour2')}
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mx-auto max-w-6xl rounded-2xl border border-blue-100/70 bg-white/90 p-3 shadow-xl shadow-blue-900/5 backdrop-blur-sm sm:p-5"
                >
                    <SearchBar onSearch={handleSearch} />
                </motion.div>

                <div className="mt-10 sm:mt-14">
                    {loading ? (
                        <div className="flex min-h-[25rem] items-center justify-center">
                            <Spin
                                indicator={
                                    <LoadingOutlined
                                        style={{
                                            fontSize: 48,
                                            color: '#3b82f6',
                                        }}
                                        spin
                                    />
                                }
                            />
                        </div>
                    ) : pageItem.length === 0 ? (
                        <div className="flex min-h-[25rem] items-center justify-center">
                            <EmptyComponent description={t('tour')} />
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`combo-page-${currentPage}`}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: 10 }}
                                className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4"
                            >
                                {pageItem.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 280,
                                            damping: 22,
                                        }}
                                        className="flex h-full w-full justify-center"
                                    >
                                        <TourCards data={item} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {tours.length > 0 && !loading && (
                    <div className="mt-10 flex flex-col items-center gap-3 sm:mt-14">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                            Trang {currentPage} ·{' '}
                            {Math.ceil(tours.length / ITEM_PER_PAGE)} trang
                        </p>

                        <Pagination
                            current={currentPage}
                            total={tours.length}
                            pageSize={ITEM_PER_PAGE}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showLessItems
                        />
                    </div>
                )}
            </motion.div>
        </section>
    );
};
