import { Result } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Error = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const orderInfo = queryParams.get('orderNo');

	useEffect(() => {
		setTimeout(() => {
			navigate('/tai-khoan', { state: { activeTab: '3', subTab: 'PENDING', bookingNo: orderInfo } });
		}, 3000);
	}, [navigate]);
	return (
		<Result
			title="Đã hủy thanh toán thành công!"
			subTitle={'MÃ TOUR ĐÃ HỦY: ' + orderInfo}
			extra={
				<div className={'text-center mt-4'}>
					<h4 className={'text-center text-red-500'}>ĐANG TRỞ LẠI TRANG CHỦ</h4>
				</div>
			}
		/>
	);
};