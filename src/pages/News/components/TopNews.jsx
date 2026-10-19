import { Link } from 'react-router-dom';
import config from '~/config';

export const TopNews = ({ news }) => {
    if (!news) return null;

    return (
        <Link
            to={`${config.routes.news}${news.slug}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-3 p-3"
        >
            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                <img
                    src={config.imageConfig.getImage(news.thumbnail) || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=100&q=80'}
                    alt={news.title || 'News thumbnail'}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{news.title || 'Untitled'}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{news.user?.username || 'Unknown Author'}</span>
                    <span className="text-orange-600">•</span>
                    <span>{config.webConfig.convertDateNoTime(news.createdAt) || 'N/A'}</span>
                </div>
            </div>
        </Link>
    );
};