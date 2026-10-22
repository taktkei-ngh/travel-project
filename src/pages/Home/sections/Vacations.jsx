
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/pagination';

const Vacations = () => {
    const { t } = useTranslation();
    const [swiper, setSwiper] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const carouselItems = [
        {
            title: 'Pháp',
            imageUrl: '/img/vacation/Paris.jpg',
            hoverImageUrl: '/img/vacation/Paris.jpg',
        },
        {
            title: 'Mỹ',
            imageUrl: '/img/vacation/newyork.jpg',
            hoverImageUrl: '/img/vacation/newyork.jpg',
        },
        {
            title: 'Nhật Bản - TOKYO',
            imageUrl: '/img/vacation/Tokyo.jpg',
            hoverImageUrl: '/img/vacation/Tokyo.jpg',
        },
        {
            title: 'Anh Quốc',
            imageUrl: '/img/vacation/England.jpg',
            hoverImageUrl: '/img/vacation/England.jpg',
        },
        {
            title: 'Hàn Quốc',
            imageUrl: '/img/vacation/Korea.jpg',
            hoverImageUrl: '/img/vacation/Korea.jpg',
        },
        {
            title: 'Mexico',
            imageUrl: '/img/vacation/Mexico.jpg',
            hoverImageUrl: '/img/vacation/Mexico.jpg',
        },
        {
            title: 'Nhật Bản - OSAKA',
            imageUrl: '/img/vacation/Osaka.jpg',
            hoverImageUrl: '/img/vacation/Osaka.jpg',
        },
        {
            title: 'Sao Hỏa',
            imageUrl: '/img/vacation/Mars.jpg',
            hoverImageUrl: '/img/vacation/Mars.jpg',
        },
        {
            title: 'Sao Mộc',
            imageUrl: '/img/vacation/Jupiter.jpg',
            hoverImageUrl: '/img/vacation/Jupiter.jpg',
        },
    ];

    return (
        <section className="relative isolate overflow-hidden bg-[#101916] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-12 lg:py-24">
            <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-orange-400 sm:text-sm">
                            <span className="h-px w-9 bg-orange-400" />
                            ROAM / KHÁM PHÁ THẾ GIỚI
                        </p>

                        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            {t('index.ind3')}
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                            {t('index.ind4')}
                        </p>
                    </div>

                    <div className="hidden shrink-0 text-right md:block">
                        <span className="text-5xl font-light tracking-tight text-white/90">
                            09
                        </span>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">
                            Điểm đến nổi bật
                        </p>
                    </div>
                </div>

                <Swiper
                    onSwiper={setSwiper}
                    modules={[Autoplay, Pagination]}
                    slidesPerView={1.08}
                    spaceBetween={16}
                    speed={750}
                    grabCursor
                    loop
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1.7, spaceBetween: 18 },
                        768: { slidesPerView: 2.2, spaceBetween: 22 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                        1280: { slidesPerView: 3.5, spaceBetween: 26 },
                    }}
                    className="roam-dark-swiper !pb-14"
                >
                    {carouselItems.map((item, index) => (
                        <SwiperSlide key={item.title} className="!h-auto">
                            <article
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="group relative h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-gray-800 sm:h-[390px] lg:h-[430px]"
                            >
                                <img
                                    src={
                                        hoveredIndex === index
                                            ? item.hoverImageUrl
                                            : item.imageUrl
                                    }
                                    alt={item.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/5 transition-all duration-500 group-hover:from-black/95" />

                                <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                                    <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                        ROAM DESTINATION
                                    </span>
                                    <span className="text-sm font-medium text-white/80">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                    <div className="mb-3 h-1 w-9 rounded-full bg-orange-400 transition-all duration-300 group-hover:w-16" />

                                    <h3 className="text-xl font-extrabold tracking-wide text-white sm:text-2xl">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/65">
                                        Cùng ROAM mở lối hành trình mới
                                    </p>
                                </div>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <p className="max-w-xs text-xs leading-6 text-gray-500 sm:text-sm">
                        Một thế giới rộng lớn đang chờ bạn khám phá.
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            aria-label="Điểm đến trước"
                            onClick={() => swiper?.slidePrev()}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-orange-400 hover:bg-orange-400 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        >
                            <FaArrowLeft size={15} />
                        </button>

                        <button
                            type="button"
                            aria-label="Điểm đến tiếp theo"
                            onClick={() => swiper?.slideNext()}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400 text-gray-950 transition-all duration-300 hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101916]"
                        >
                            <FaArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Vacations;
