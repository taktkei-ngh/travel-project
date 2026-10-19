import React from 'react';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';
import config from '~/config';
import { useAuth } from '~/config/AuthContext';
import { Heart } from 'lucide-react';

export const TourCard = ({ data, onClick }) => {
    const { handleAddToWishlist, wishlist } = useAuth();
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClick(data.id);
    };

    const isInWishlist = wishlist.some((item) => item.tourId === data.id);

    return (
        <div className="relative">
            <Link
                to={config.routes.tourDetail + `${data.id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center border shadow-md border-gray-300 bg-gray-50 p-3 sm:p-4 rounded-lg hover:border-orange-600 hover:bg-orange-100 transition-all hover:cursor-pointer"
                onClick={handleClick}
            >
                <div className="w-full sm:w-24 mb-3 sm:mb-0">
                    <img
                        src={config.imageConfig.getImage(data.thumbnail) || config.webConfig.defaultTour}
                        alt="tour-logo"
                        className="rounded-lg w-full sm:w-24 aspect-square object-cover"
                    />
                </div>
                <div className="flex-1 sm:pl-4">
                    <h2 className="text-base sm:text-lg font-bold line-clamp-1 hover:text-orange-400 transition-all">
                        {data.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{data.description}</p>
                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-2">
                        <p className="text-red-500 font-semibold text-sm sm:text-base">
                            {config.webConfig.getCurrency(data.maxPrice)}
                        </p>
                        <Rate
                            allowHalf
                            defaultValue={data.ratingAvg}
                            disabled
                            className="text-xs sm:text-sm"
                        />
                    </div>
                </div>
            </Link>
            <Heart
                onClick={(e) => {
                    e.preventDefault();
                    handleAddToWishlist(data.id);
                }}
                className={`absolute bottom-3 right-3 transition-all hover:cursor-pointer ${
                    isInWishlist ? 'text-red-500 fill-red-500' : 'text-red-500 hover:fill-red-500'
                }`}
                size={20}
            />
        </div>
    );
};