import { Rate } from 'antd';
import config from '~/config';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '~/config/AuthContext';
import { t } from 'i18next';

export const TourCards = ({ data }) => {
	const { handleAddToWishlist, wishlistMap } = useAuth();

	const isInWishlist = wishlistMap.has(data.id);

	return (
		<div
			className={
				'w-full max-w-[260px] sm:max-w-[280px] h-auto min-h-[420px] rounded-lg shadow-lg hover:scale-105 overflow-hidden transition-transform transform-gpu hover:cursor-pointer hover:border-orange-500 hover:border-2 hover:z-10'
			}
		>
			<Link to={config.routes.tourDetail + `${data.id}`}>
				<img
					alt={data.title}
					src={`${config.imageConfig.getImage(data.thumbnail)}`}
					className={'w-full h-44 sm:h-48 object-cover rounded-t-lg'}
				/>
				<div className={'p-3 sm:p-4'}>
					<h3
						className={'text-base sm:text-lg font-semibold overflow-ellipsis text-gray-800 mb-2 line-clamp-2'}>{data.title}</h3>
					<p className={'text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4'}>{data.description}</p>
					<div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2">
						<span
							className={'font-semibold'}>{data.duration} {t('tourCard.ti2')} {data.duration - 1} {t('tourCard.ti3')}</span>
					</div>
				</div>
				<div className="flex flex-col justify-start border-t p-2 sm:p-3">
					<Rate disabled allowHalf defaultValue={data.ratingAvg} className="text-xs sm:text-sm" />
					<div className={'flex flex-wrap gap-2 items-center'}>
						<p
							className="text-base sm:text-lg font-bold text-gray-800">{config.webConfig.getCurrency(data.maxPrice)}</p>
					</div>
				</div>
			</Link>
			<div className={'flex justify-end items-end -mt-14 p-3 sm:p-4'}>
				<Heart
					onClick={(e) => {
						e.preventDefault();
						handleAddToWishlist(data.id);
					}}
					className={`text-red-500 hover:fill-red-600 hover:cursor-pointer ${isInWishlist ? 'fill-red-500' : ''}`}
					size={20}
				/>
			</div>
		</div>
	);
};