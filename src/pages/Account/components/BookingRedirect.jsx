import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export const BookingRedirect = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/tai-khoan', { state: { activeTab: '3', subTab: 'PAID', bookingNo: id } });
	}, [navigate]);

	return null;
};