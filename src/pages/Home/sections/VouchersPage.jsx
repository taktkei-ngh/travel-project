import { Divider } from 'antd';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'; // Import các module cần thiết
import 'swiper/css'; // CSS cơ bản của Swiper
import 'swiper/css/navigation'; // CSS cho navigation
import 'swiper/css/pagination'; // CSS cho pagination
import 'swiper/css/effect-coverflow';
import config from '~/config';
import { useTranslation } from 'react-i18next'; // CSS cho hiệu ứng coverflow

export const VouchersPage = () => {
    const { t } = useTranslation();
    // Dữ liệu mẫu cho các voucher/sự kiện
    const vouchers = [
        {
            id: 1,
            image: '1NEMFo2i8XH6oTkUVSpQRXSSUjgy9ooxe',
            cta: 'Đặt ngay',
        },
        {
            id: 2,
            image: '1fjMrC_8Jq_I35tD6HjXx_mJh__P-CwZm',
            cta: 'Khám phá',
        },
        {
            id: 3,
            image: '1XrG7EJ6ofB6xjjPcjXeeF3cwUfBMdvHM',
            cta: 'Xem chi tiết',
        },
        {
            id: 4,
            image: '1ofrgv-NljF13ZmdoFBAn_DPVpXMZK4rJ',
            cta: 'Đặt ngay',
        },
    ];

    return (
        <div
            className="relative bg-gradient-to-tl from-gray-50 via-white to-orange-50 justify-center mx-auto max-w-full p-12">
            <Divider
                className="my-12 font-bold uppercase"
                style={{ borderColor: '#7cb305' }}
                orientation="center"
            >
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-lime-500">
                        {t('voucher.ti1')}
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-600 mt-2">
                        {t('voucher.ti2')}
                    </p>
                </div>
            </Divider>

            {/* Swiper Carousel */}
            <div className="relative max-w-5xl mx-auto">
                <Swiper
                    modules={[Navigation, Autoplay, EffectCoverflow]} // Thêm các module
                    spaceBetween={30} // Khoảng cách giữa các slide
                    slidesPerView={1} // Hiển thị 1 slide trên mobile
                    centeredSlides={true} // Căn giữa slide
                    loop={true} // Lặp vô hạn
                    autoplay={{ delay: 3000, disableOnInteraction: false }} // Tự động chuyển sau 3s
                    navigation={true} // Nút điều hướng trái/phải
                    effect="coverflow" // Hiệu ứng coverflow (3D)
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 }, // Mobile
                        768: { slidesPerView: 2 }, // Tablet
                        1024: { slidesPerView: 3 }, // Desktop
                    }}
                    className="mySwiper"
                >
                    {vouchers.map((voucher) => (
                        <SwiperSlide key={voucher.id}>
                            <img src={config.imageConfig.getImage(voucher.image)} alt={voucher.title} className="w-full h-full object-cover rounded-lg" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,167,38,0.2),_transparent_80%)] pointer-events-none" />
        </div>
    );
};