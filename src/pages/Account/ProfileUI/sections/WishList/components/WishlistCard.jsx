import { Link } from 'react-router-dom';
import config from '~/config';
import { Heart } from 'lucide-react';
import { useAuth } from '~/config/AuthContext';

export const WishlistCard = ({ data, wishlistId, onWishlistChange }) => {
    const { handleRemoveWishlist } = useAuth();

    // Normalize data to avoid repetitive fallback logic
    const normalizedData = {
        id: data?.id || '',
        title: data?.title || 'N/A',
        description: data?.description || 'Không có mô tả',
        thumbnail: data?.thumbnail || '',
        duration: data?.duration || 0,
        maxPrice: data?.maxPrice || 0,
    };

    return (
        <div
            className="relative border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 w-full bg-white">
            <Link
                to={`${config.routes.tourDetail}${normalizedData.id}`}
                className="flex flex-col sm:grid sm:grid-cols-5 items-start sm:items-center h-full"
                aria-label={`Xem chi tiết tour ${normalizedData.title}`}
            >
                <div className="w-full sm:col-span-1 p-2">
                    <img
                        src={config.imageConfig.getImage(normalizedData.thumbnail) || config.webConfig.defaultTour}
                        alt={normalizedData.title}
                        className="rounded-lg w-full h-24 sm:h-32 object-cover"
                        onError={(e) => (e.target.src = config.webConfig.defaultTour)}
                    />
                </div>

                <div className="w-full sm:col-span-4 p-2 flex flex-col justify-between gap-1 sm:gap-2">
                    <h2 className="text-sm sm:text-base md:text-lg font-bold line-clamp-1 text-orange-400 hover:text-orange-600 hover:underline">
                        {normalizedData.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{normalizedData.description}</p>
                    <div className="flex gap-2 items-center">
                        <span className="font-semibold text-xs sm:text-sm">
                            {normalizedData.duration
                                ? `${normalizedData.duration} Ngày ${normalizedData.duration - 1} đêm`
                                : 'N/A'}
                        </span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                            {config.webConfig.getCurrency(normalizedData.maxPrice)}
                        </p>
                    </div>
                </div>
            </Link>

            <button
                type="button"
                onClick={() => handleRemoveWishlist(wishlistId, onWishlistChange)}
                className="absolute top-2 right-2 group p-2 rounded-full hover:bg-red-50 active:bg-red-100 transition-all duration-200"
                aria-label={`Xóa tour ${normalizedData.title} khỏi danh sách yêu thích`}
            >
                <Heart
                    size={18}
                    className="
                        fill-red-500
                        text-red-500
                        group-hover:scale-110
                        group-active:scale-90
                        transform
                        transition-transform
                        duration-200
                        ease-in-out
                    "
                />
                <span className="
                    absolute
                    inset-0
                    rounded-full
                    bg-red-200
                    opacity-0
                    group-active:opacity-50
                    group-active:animate-[ripple_0.4s_ease-out]
                " />
            </button>
        </div>
    );
};