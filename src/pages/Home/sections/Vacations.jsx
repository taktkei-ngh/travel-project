import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { Divider } from 'antd';
import config from '~/config';

const Vacations = () => {
    const { t } = useTranslation();
    const [swiper, setSwiper] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const carouselItems = [
        {
            title: 'Pháp',
            imageUrl: config.imageConfig.getImage('18sjM8FDlALE2hixi1p_GsVuTsesfkkME'),
            hoverImageUrl: config.imageConfig.getImage('1GIQYwOWmMcQWbxKtypebz06CSZGNUtup'),
        },
        {
            title: 'Mỹ',
            imageUrl: config.imageConfig.getImage('1wHeycggR1kB8kpTOavzNICZGKYJbbGR8'),
            hoverImageUrl: config.imageConfig.getImage('10rgIQOXLVlfWEXm_NAFS3QMJyryosfuK'),
        },
        {
            title: 'Nhật Bản - TOKYO',
            imageUrl: config.imageConfig.getImage('1FIw6uiJePA7bSmeg7UiqbFGkPICRRZRP'),
            hoverImageUrl: config.imageConfig.getImage('1RWt4o2YRz5qabpA98uJfuwi8DlUU4089'),
        },
        {
            title: 'Anh Quốc',
            imageUrl: config.imageConfig.getImage('1mbWseV_P9e6laA9xqgo7JNAriwWLjGs7'),
            hoverImageUrl: config.imageConfig.getImage('1cxpNMtnsY0LUUrJj9qzE7oYQXmmP3iuu'),
        },
        {
            title: 'Hàn Quốc',
            imageUrl: config.imageConfig.getImage('13MVHCyewA9xR9WEXg6pdL-qgDkI-cW5w'),
            hoverImageUrl: config.imageConfig.getImage('1wMFgwh7CEnmaulzN6wWcvYbhfMK4ZzW3'),
        },
        {
            title: 'Mexico',
            imageUrl: config.imageConfig.getImage('1_P2mBUnhQzk862YBW3QvHH-5wmRAfNIb'),
            hoverImageUrl: config.imageConfig.getImage('1nQOT1raQxcrjIjKSN0cYsBNRZKjL74fJ'),
        },
        {
            title: 'Nhật Bản - OSAKA',
            imageUrl: config.imageConfig.getImage('1IJTeahSvtheCYBu7V7CRmpdcu7k9M6I8'),
            hoverImageUrl: config.imageConfig.getImage('1jBHq2iI1dJbhDm_lk84Q5I06AKE9JfSA'),
        },
        {
            title: 'Sao Hỏa',
            imageUrl: config.imageConfig.getImage('1VS7ZwEj3CjKDSF6AINqxew3zd5Td0chu'),
            hoverImageUrl: config.imageConfig.getImage('1A-2DQzrX6F0f4tR3zJIXMRu1FZl63J18'),
        },
        {
            title: 'Sao Mộc',
            imageUrl: config.imageConfig.getImage('1wfqlk8df4WWxjsGFRTbUupvrFKu9Yf3U'),
            hoverImageUrl: config.imageConfig.getImage('1nSEqsUzQKmEG24Nf6CPvGIk2BNoeT6ki'),
        },
    ];

    return (
        <div
            className="relative bg-gradient-to-br from-gray-50 via-white to-orange-50 justify-center mx-auto max-w-full p-12">
            <Divider
                className="my-12 font-bold uppercase"
                style={{ borderColor: '#7cb305' }}
                orientation="center"
            >
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-lime-500">
                        {t('index.ind3')}
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-600 mt-2">
                        {t('index.ind4')}
                    </p>
                </div>
            </Divider>
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,167,38,0.2),_transparent_70%)] pointer-events-none"></div>
            <Swiper
                onSwiper={setSwiper}
                spaceBetween={30}
                slidesPerView={1}
                navigation={false}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                loop={true}
                modules={[Autoplay]}
                className="mySwiper"
                breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 25 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                    1280: { slidesPerView: 4, spaceBetween: 30 },
                }}
            >
                {carouselItems.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative group overflow-hidden rounded-xl shadow-md transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2"
                        >
                            <div className="relative w-full h-80 overflow-hidden">
                                <img
                                    alt={item.title}
                                    src={hoveredIndex === index ? item.hoverImageUrl : item.imageUrl}
                                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-75"
                                    loading="lazy"
                                />
                                {/* Overlay */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>
                            </div>
                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="relative overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-sm px-4 py-2 rounded-full inline-block font-semibold shadow-md transform transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-lg">
                                        {item.title}
                                    </div>
                                    {/* Subtle shine effect */}
                                    <div
                                        className="absolute inset-0 -top-1/2 w-1/2 bg-white/20 opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-500 ease-out group-hover:-translate-x-full"></div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 space-x-6">
                <button
                    onClick={() => swiper?.slidePrev()}
                    className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-600 transform hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <FaArrowLeft size={20} />
                </button>
                <button
                    onClick={() => swiper?.slideNext()}
                    className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-600 transform hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <FaArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Vacations;