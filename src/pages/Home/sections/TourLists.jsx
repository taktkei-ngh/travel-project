import { Divider, Pagination, Spin, Typography } from 'antd';
import { TourCards } from '~/pages/Home/components/TourCards';
import React, { useEffect, useState, useMemo } from 'react';
import TourServices from '~/services/TourServices';
import { SearchBar } from '~/pages/Home/components/SearchBar';
import { EmptyComponent } from '~/component/ui/EmptyComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

export const TourLists = () => {
    const ITEM_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const [tours, setTours] = useState([]);
    const [query, setQuery] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const handleSearch = (query) => {
        const filterSearch = {};
        if (query.searchText) filterSearch.title = query.searchText;
        if (query.searchSides !== null) filterSearch.categoryId = query.searchSides;
        if (query.maxPrice) filterSearch.maxPrice = query.maxPrice;
        if (query.minPrice) filterSearch.minPrice = query.minPrice;
        if (query.startDate) filterSearch.startDate = query.startDate;
        if (query.endDate) filterSearch.endDate = query.endDate;
        if (query.region) filterSearch.region = query.region;

        setQuery(filterSearch);
        setCurrentPage(1); // Reset to page 1 on new search
        setLoading(true);
    };

    const onChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setLoading(true);
        TourServices.getAllTour(query)
            .then((res) => {
                const published = res.data.filter((tour) => tour.status === 'PUBLISHED');
                setTours(published);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [query]);

    const pageItem = useMemo(() => {
        return tours.slice((currentPage - 1) * ITEM_PER_PAGE, currentPage * ITEM_PER_PAGE);
    }, [tours, currentPage]);

    return (
        <div className="relative py-16 overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible" // Thay whileInView bằng animate
                className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16"
            >
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <Divider
                        className="my-12 font-bold uppercase"
                        style={{ borderColor: '#7cb305' }}
                        orientation="center"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-lime-500">
                                {t('comboTour.tour1')}
                            </h2>
                            <p className="text-sm sm:text-lg text-gray-600 mt-2">{t('comboTour.tour3')}</p>
                        </div>
                    </Divider>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-green-100/50"
                >
                    <SearchBar onSearch={handleSearch} />
                </motion.div>

                <div className="mt-12">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="min-h-[25rem] flex items-center justify-center"
                        >
                            <Spin
                                indicator={
                                    <LoadingOutlined
                                        style={{ fontSize: 60, color: '#84cc16' }}
                                        spin
                                    />
                                }
                            />
                        </motion.div>
                    ) : pageItem.length === 0 ? (
                        <motion.div
                            variants={itemVariants}
                            className="min-h-[25rem] flex items-center justify-center"
                        >
                            <EmptyComponent description={t('tour')} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`page-${currentPage}`} // Thêm key động để tái render khi đổi trang
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
                        >
                            <AnimatePresence>
                                {pageItem.map((item, index) => (
                                    <motion.div
                                        key={item.id} // Đảm bảo key duy nhất
                                        variants={itemVariants}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, y: 20 }} // Animation thoát
                                        whileHover={{ y: -8 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <TourCards data={item} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {tours.length > 0 && !loading && (
                    <motion.div variants={itemVariants} className="mt-12 flex justify-center">
                        <Pagination
                            className="text-center"
                            align="center"
                            current={currentPage}
                            total={tours.length}
                            pageSize={ITEM_PER_PAGE}
                            onChange={onChange}
                            showSizeChanger={false}
                            showLessItems={true}
                            itemRender={(page, type, originalElement) => {
                                if (type === 'page') {
                                    return (
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            {originalElement}
                                        </motion.div>
                                    );
                                }
                                return originalElement;
                            }}
                        />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};