import TravelCards from '~/pages/Home/components/TravelCards';
import { useTranslation } from 'react-i18next';
import config from '~/config';
import { Divider } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TravelCardLists = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const travelCardsData = [
        {
            imageSrc: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH'),
            title: t("travelCard.ti1"),
            description: t("travelCard.de1"),
            altText: 'Travel 1',
        },
        {
            imageSrc: config.imageConfig.getImage('1iD_Pa2qZnOyEn6VN6EHXd_9nGw9B_3PL'),
            title: t("travelCard.ti1"),
            description: t("travelCard.de1"),
            altText: 'Travel 2',
        },
        {
            imageSrc: config.imageConfig.getImage('1LZz8gJFm1Ez3OfcGDUd9hSm5cVzbK1L7'),
            title: t("travelCard.ti1"),
            description: t("travelCard.de1"),
            altText: 'Travel 3',
        },
        {
            imageSrc: config.imageConfig.getImage('1JjaqjdwMsg22toEBdQBMgAlDTcfIxMDa'),
            title: t("travelCard.ti1"),
            description: t("travelCard.de1"),
            altText: 'Travel 4',
        },
    ];

    return (
        <div className="relative bg-gradient-to-br from-gray-50 via-white to-orange-50 py-20 px-6 lg:px-16 overflow-hidden">
            <Divider
                className="my-12 font-bold uppercase"
                style={{ borderColor: '#7cb305' }}
                orientation="center"
            >
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-lime-500">
                        {t('index.ind1')}
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-600 mt-2">
                        {t('index.ind2')}
                    </p>
                </div>
            </Divider>
            {/* Background Decorative Element */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,167,38,0.2),_transparent_70%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                {/* Phần Cards */}
                <div className="lg:w-1/2">
                    <TravelCards cards={travelCardsData} />
                </div>

                {/* Phần Text */}
                <div className="lg:w-1/2 text-center lg:text-left space-y-6 relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 leading-tight">
                        {t("travelCard.ti2")}
                    </h1>
                    <h2 className="text-xl lg:text-2xl font-medium text-gray-700">
                        {t("travelCard.ti3")}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {t("travelCard.de2")}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        {t("travelCard.de3")}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        {t("travelCard.de4")}
                    </p>
                    <button
                        onClick={() => navigate(config.routes.tourTrongNuoc)}
                        className="mt-4 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        {t("travelCard.ti4")}
                    </button>
                </div>
            </div>
        </div>
    );
};