import { Result } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Success = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const orderInfo = queryParams.get('orderNo');

	useEffect(() => {
		setTimeout(() => {
			navigate('/tai-khoan', { state: { activeTab: '3', subTab: 'PAID', bookingNo: orderInfo } });
		}, 3000);
	}, [navigate]);
	return (
		<Result status={'success'}
						title={'Thanh toán thành công!'}
						subTitle={`Mã Tour đã thanh toán: ${orderInfo} - Đang chuyển về trang chủ trong 3-5s. Xin cám ơn!`}
		/>
	);
};