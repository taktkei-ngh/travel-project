import { Link } from 'react-router-dom';

export const FloatButton = ({icon,href,...props}) => {
    return (
    <Link to={href} className="block bg-black bg-opacity-60 p-3 rounded-full text-white hover:bg-indigo-500 transition">
        <i className={icon}></i>
    </Link>
    );
};