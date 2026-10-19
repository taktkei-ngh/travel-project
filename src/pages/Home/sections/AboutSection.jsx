import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { useTranslation } from 'react-i18next';
import BounceCards from '~/component/Animation/AnimatedUI/BounceCards';

// AboutSection Component
export const AboutSection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Dữ liệu mẫu cho BounceCards (dùng cùng src, bạn có thể thay đổi sau)
    const cardImages = [
        '/img/about/about.jpg',
        '/img/about/about.jpg',
        '/img/about/about.jpg',
        '/img/about/about.jpg',
        '/img/about/about.jpg',
        '/img/about/about.jpg',

    ];

    return (
        <>
            {/* Desktop Version */}
            <div className="hidden lg:block relative bg-gradient-to-br from-gray-50 to-orange-50">
                <div
                    className="relative h-screen bg-center bg-cover rounded-3xl mx-8 overflow-hidden shadow-2xl"
                    style={{ backgroundImage: 'url(\'/img/about/aboutbg.jpg\')' }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
                        <BounceCards
                            images={cardImages}
                            containerWidth={800} // Tăng chiều rộng để các card trải ra
                            containerHeight={400}
                            animationDelay={0.5}
                            animationStagger={0.1}
                            easeType="elastic.out(1, 0.8)"
                            enableHover={true} // Bật hiệu ứng hover
                        />
                    </div>
                </div>
                <div className="container mx-auto py-12 px-8 lg:px-16">
                    <div className="ml-96 max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-orange-600 bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                            {t('aboutUs.ab1')}
                        </h2>
                        <p className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">
                            {t('aboutUs.ab2')}
                        </p>
                        <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                            {t('aboutUs.ab3')}
                        </p>
                        <button
                            onClick={() => navigate(config.routes.tourTrongNuoc)}
                            className="mt-8 bg-orange-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {t('aboutUs.ab4')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Version */}
            <div className="block lg:hidden bg-gradient-to-br from-gray-50 to-orange-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <BounceCards
                            images={cardImages}
                            containerWidth={300} // Thu nhỏ cho mobile
                            containerHeight={300}
                            animationDelay={0.5}
                            animationStagger={0.1}
                            easeType="elastic.out(1, 0.8)"
                            enableHover={true}
                        />
                    </div>
                    <div className="text-center mt-6 px-4">
                        <h2 className="text-3xl font-extrabold mb-4 text-orange-600 bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                            {t('aboutUs.ab1')}
                        </h2>
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            {t('aboutUs.ab2')}
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {t('aboutUs.ab3')}
                        </p>
                        <button
                            onClick={() => navigate(config.routes.tourTrongNuoc)}
                            className="mt-6 bg-orange-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {t('aboutUs.ab4')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};