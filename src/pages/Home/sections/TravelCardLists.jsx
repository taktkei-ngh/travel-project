
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import TravelCards from '~/pages/Home/components/TravelCards';
import config from '~/config';

export const TravelCardLists = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const travelCardsData = [
        {
            imageSrc: '/img/Cards/card1.jpg',
            title: t('travelCard.ti1'),
            description: t('travelCard.de1'),
            altText: 'Travel 1',
        },
        {
            imageSrc: '/img/Cards/card2.jpg',
            title: t('travelCard.ti1'),
            description: t('travelCard.de1'),
            altText: 'Travel 2',
        },
        {
            imageSrc: '/img/Cards/card3.jpg',
            title: t('travelCard.ti1'),
            description: t('travelCard.de1'),
            altText: 'Travel 3',
        },
        {
            imageSrc: '/img/Cards/card4.jpg',
            title: t('travelCard.ti1'),
            description: t('travelCard.de1'),
            altText: 'Travel 4',
        },
    ];

    return (
        <section className="relative isolate overflow-hidden bg-[#f8f7f2] px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
            <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-96 w-96 rounded-full bg-green-200/30 blur-3xl" />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                {/* Brand story */}
                <div className="relative z-10 order-2 lg:order-1">
                    <p className="mb-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-600 sm:text-sm lg:justify-start">
                        <span className="h-px w-9 bg-orange-500" />
                        ROAM · HÀNH TRÌNH CỦA BẠN
                    </p>

                    <h2 className="text-center text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-left lg:text-5xl xl:text-6xl">
                        {t('travelCard.ti2')}
                    </h2>

                    <h3 className="mt-5 text-center text-lg font-semibold leading-relaxed text-gray-700 sm:text-xl lg:text-left lg:text-2xl">
                        {t('travelCard.ti3')}
                    </h3>

                    <div className="mx-auto my-6 h-1 w-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 lg:mx-0" />

                    <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                        <p>{t('travelCard.de2')}</p>
                        <p>{t('travelCard.de3')}</p>
                        <p>{t('travelCard.de4')}</p>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(config.routes.tourTrongNuoc)
                            }
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gray-950 px-7 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                        >
                            {t('travelCard.ti4')}
                            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </button>

                        <span className="self-center text-xs font-medium tracking-wide text-gray-400 sm:self-auto sm:pt-4">
                            KHÁM PHÁ THEO CÁCH CỦA BẠN
                        </span>
                    </div>

                    <div className="mt-10 hidden border-t border-gray-200 pt-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <div>
                            <p className="text-xl font-black text-gray-900">01</p>
                            <p className="mt-1 text-xs text-gray-500">Khám phá</p>
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900">02</p>
                            <p className="mt-1 text-xs text-gray-500">Trải nghiệm</p>
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900">03</p>
                            <p className="mt-1 text-xs text-gray-500">Lưu giữ</p>
                        </div>
                    </div>
                </div>

                {/* Existing cards component */}
                <div className="relative order-1 min-w-0 lg:order-2">
                    <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] border border-orange-200/60 sm:-inset-6" />

                    <div className="overflow-hidden rounded-3xl border border-white bg-white/70 p-2 shadow-2xl shadow-gray-900/5 sm:p-4">
                        <TravelCards cards={travelCardsData} />
                    </div>

                    <div className="pointer-events-none absolute -bottom-4 right-4 h-16 w-16 rounded-2xl border border-orange-300/60 sm:-bottom-6 sm:right-8 sm:h-20 sm:w-20" />
                </div>
            </div>
        </section>
    );
};
