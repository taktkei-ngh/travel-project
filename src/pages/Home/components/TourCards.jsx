
import React from 'react';
import { Rate } from 'antd';
import config from '~/config';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '~/config/AuthContext';
import { useTranslation } from 'react-i18next';

export const TourCards = ({ data }) => {
    const { handleAddToWishlist, wishlistMap } = useAuth();
    const { t } = useTranslation();

    if (!data) return null;

    const isInWishlist = wishlistMap?.has(data.id) ?? false;
    const imageUrl = config.imageConfig.getImage(data.thumbnail);
    const duration = Number(data.duration);
    const hasDuration = Number.isFinite(duration) && duration > 0;
    const rating = Number(data.ratingAvg) || 0;

    return (
        <article className="group relative flex h-full w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl">
            <Link
                to={`${config.routes.tourDetail}${data.id}`}
                aria-label={`Xem chi tiết tour ${data.title || ''}`}
                className="flex h-full flex-col text-left no-underline"
            >
                <div className="relative h-52 shrink-0 overflow-hidden bg-gray-100">
                    <img
                        alt={data.title || 'Tour du lịch ROAM'}
                        src={imageUrl}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/55 via-transparent to-black/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                    <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        ROAM · TOUR
                    </span>

                    <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-extrabold text-gray-900 shadow-md">
                        {config.webConfig.getCurrency(data.maxPrice)}
                    </span>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-base font-extrabold leading-7 text-gray-900 transition-colors duration-300 group-hover:text-orange-600 sm:text-lg">
                        {data.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {data.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="min-w-0">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                                Thời lượng
                            </p>
                            <p className="text-xs font-semibold text-gray-700 sm:text-sm">
                                {hasDuration
                                    ? `${data.duration} ${t('tourCard.ti2')} ${Math.max(duration - 1, 0)} ${t('tourCard.ti3')}`
                                    : 'Xem chi tiết'}
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                                Đánh giá
                            </p>
                            <Rate
                                disabled
                                allowHalf
                                value={rating}
                                className="!text-xs sm:!text-sm"
                            />
                        </div>
                    </div>
                </div>
            </Link>

            <button
                type="button"
                aria-label={
                    isInWishlist
                        ? 'Xóa tour khỏi danh sách yêu thích'
                        : 'Thêm tour vào danh sách yêu thích'
                }
                aria-pressed={isInWishlist}
                onClick={() => handleAddToWishlist(data.id)}
                className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/95 shadow-md transition-all duration-300 hover:scale-110 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                    isInWishlist
                        ? 'text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                }`}
            >
                <Heart
                    size={19}
                    strokeWidth={2}
                    fill={isInWishlist ? 'currentColor' : 'none'}
                />
            </button>
        </article>
    );
};
