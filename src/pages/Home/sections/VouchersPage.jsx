
import React from 'react';
import { Divider } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Autoplay,
    EffectCoverflow,
    Pagination,
} from 'swiper/modules';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export const VouchersPage = () => {
    const { t } = useTranslation();

    const vouchers = [
        {
            id: 1,
            image: '/img/event/keii.jpg',
            title: 'Sự kiện nổi bật 1',
        },
        {
            id: 2,
            image: '/img/event/keii.jpg',
            title: 'Sự kiện nổi bật 2',
        },
        {
            id: 3,
            image: '/img/event/keii.jpg',
            title: 'Sự kiện nổi bật 3',
        },
        {
            id: 4,
            image: '/img/event/keii.jpg',
            title: 'Sự kiện nổi bật 4',
        },
    ];

    return (
        <section className="relative isolate overflow-hidden bg-[#f8f7f2] px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-32 -top-24 -z-10 h-96 w-96 rounded-full bg-orange-200/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-96 w-96 rounded-full bg-green-200/25 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Section heading */}
                <div className="mb-10 flex flex-col gap-5 sm:mb-14 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600 sm:text-sm">
                            <span className="h-px w-9 bg-orange-500" />
                            ROAM / ĐẶC QUYỀN DÀNH CHO BẠN
                        </p>

                        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                            {t('voucher.ti1')}
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                            {t('voucher.ti2')}
                        </p>
                    </div>

                    <p className="max-w-xs text-sm leading-6 text-gray-500 md:text-right">
                        Những khoảnh khắc đáng nhớ bắt đầu từ một hành trình
                        đáng mong chờ.
                    </p>
                </div>

                {/* Existing voucher carousel */}
                <div className="rounded-3xl border border-white/80 bg-white/60 px-2 py-6 shadow-xl shadow-gray-900/5 backdrop-blur-sm sm:px-5 sm:py-8">
                    <Swiper
                        modules={[
                            Navigation,
                            Autoplay,
                            EffectCoverflow,
                            Pagination,
                        ]}
                        spaceBetween={20}
                        slidesPerView={1.08}
                        centeredSlides
                        loop
                        speed={750}
                        grabCursor
                        watchOverflow
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        effect="coverflow"
                        coverflowEffect={{
                            rotate: 22,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1.35,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 28,
                            },
                        }}
                        className="roam-voucher-swiper !pb-14"
                    >
                        {vouchers.map((voucher, index) => (
                            <SwiperSlide
                                key={voucher.id}
                                className="!h-auto"
                            >
                                <article className="group relative h-[340px] overflow-hidden rounded-2xl border border-white bg-gray-200 shadow-lg sm:h-[390px]">
                                    <img
                                        src={voucher.image}
                                        alt={voucher.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/10 to-gray-950/20" />

                                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                                        <span className="rounded-full border border-white/40 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                                            ROAM EVENT
                                        </span>

                                        <span className="text-sm font-semibold text-white/85">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                        <div className="mb-3 h-1 w-9 rounded-full bg-orange-400 transition-all duration-300 group-hover:w-14" />

                                        <h3 className="text-xl font-extrabold leading-snug text-white sm:text-2xl">
                                            {voucher.title}
                                        </h3>

                                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-white/70">
                                            Cùng ROAM tạo nên kỷ niệm
                                        </p>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};
