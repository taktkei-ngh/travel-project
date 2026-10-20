
import { Divider } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import { useTranslation } from 'react-i18next';

export const VouchersPage = () => {
    const { t } = useTranslation();

    // Chi thay duong dan anh, giu nguyen hieu ung Swiper ban dau
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
        <div className="relative bg-gradient-to-tl from-gray-50 via-white to-orange-50 justify-center mx-auto max-w-full p-12">
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

            <div className="relative max-w-5xl mx-auto">
                <Swiper
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    navigation={true}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="mySwiper"
                >
                    {vouchers.map((voucher) => (
                        <SwiperSlide key={voucher.id}>
                            <img
                                src={voucher.image}
                                alt={voucher.title}
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,167,38,0.2),_transparent_80%)] pointer-events-none" />
        </div>
    );
};
