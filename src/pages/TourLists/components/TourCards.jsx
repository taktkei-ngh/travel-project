import { Link } from 'react-router-dom';
import config from '~/config';
import { Rate } from 'antd';
import { Heart } from 'lucide-react';
import { useAuth } from '~/config/AuthContext';

export const TourCards = ({ data }) => {
    const { handleAddToWishlist, wishlist } = useAuth();
    const isInWishlist = wishlist.some((item) => item?.tourId === data.id);

    return (
        <div
            className="
                w-72
                max-h-full
                rounded-lg
                shadow-lg
                hover:scale-105
                overflow-hidden
                transition-transform
                duration-300
                hover:cursor-pointer
                hover:border-orange-500
                hover:border-2
            "
        >
            <Link to={config.routes.tourDetail + `${data.id}`}>
                <img
                    alt={data.title}
                    src={config.imageConfig.getImage(data.thumbnail) || config.webConfig.defaultTour}
                    className="w-full max-h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold overflow-ellipsis text-gray-800 mb-2 line-clamp-2">
                        {data.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{data.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span className="font-semibold">
                            {data.duration} Ngày {data.duration - 1} đêm
                        </span>
                    </div>
                </div>
                <div className="flex flex-col justify-start border-t p-3">
                    <Rate disabled allowHalf defaultValue={data.ratingAvg} />
                    <div className="flex flex-wrap gap-2 items-center">
                        <p className="text-lg font-bold text-gray-800">
                            {config.webConfig.getCurrency(data.maxPrice)}
                        </p>
                    </div>
                </div>
            </Link>
            <div className="flex justify-end items-end -mt-14 p-4">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleAddToWishlist(data.id);
                    }}
                    className="
                        group
                        p-1
                        rounded-full
                        hover:bg-red-50
                        transition-all
                        duration-200
                        relative
                    "
                >
                    <Heart
                        size={24}
                        className={`
                            text-red-500 
                            transform 
                            transition-transform 
                            duration-200 
                            ease-in-out
                            group-hover:scale-110 
                            group-active:scale-90 
                            hover:cursor-pointer 
                            ${isInWishlist ? 'fill-red-500' : 'group-hover:fill-red-600'}
                        `}
                    />
                    {/* Ripple effect */}
                    <span
                        className="
                            absolute
                            inset-0
                            rounded-full
                            bg-red-200
                            opacity-0
                            group-active:opacity-50
                            group-active:animate-[ripple_0.4s_ease-out]
                        "
                    />
                </button>
            </div>
        </div>
    );
};