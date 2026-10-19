import { Card, Divider } from 'antd';
import { FaHotel, FaInfoCircle, FaPlaneDeparture } from 'react-icons/fa';
import { BiSolidUserDetail } from 'react-icons/bi';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

export const TourInfoCard = memo(
    ({
         data,
         detailData,
         adults,
         children,
         totalPrice,
         voucherValid,
         discount,
         hotel,
         transport,
         actualDiscountAmount,
     }) => {
        const navigate = useNavigate();

        // Tính giá gốc (totalBasePrice)
        const totalBasePrice = (() => {
            const basePrice = adults * (detailData.priceAdults || 0) + children * (detailData.priceChildren || 0);
            const hotelCost = hotel?.cost || 0;
            const transportCost = transport?.cost || 0;
            return basePrice + hotelCost + transportCost;
        })();

        return (
            <Card className="w-full max-w-[500px] p-4 shadow-lg border rounded-xl xl:sticky xl:top-24">
                <h2 className="text-base sm:text-lg font-bold uppercase text-gray-800">
                    Tóm Tắt Chuyến Đi
                </h2>
                <div className="flex gap-3 mt-2">
                    <img
                        src={config.imageConfig.getImage(data.thumbnail)}
                        alt={data.title}
                        className="rounded-md object-cover w-20 h-16 sm:w-28 sm:h-20"
                    />
                    <div className="flex-1">
                        <p
                            onClick={() => navigate(config.routes.tourDetail + data.id)}
                            className="text-xs sm:text-sm font-semibold line-clamp-1 hover:text-indigo-500 transition-all uppercase hover:underline cursor-pointer"
                            role="link"
                            aria-label={`Xem chi tiết tour ${data.title}`}
                        >
                            {data.title}
                        </p>
                        <p className="text-xs text-gray-500">
                            Mã tour: <span className="font-bold">{data.id}</span>
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-3">{data.description}</p>
                    </div>
                </div>
                <div className="mt-3 text-xs sm:text-sm text-gray-700">
                    <p>
                        <strong>Khởi hành:</strong>{' '}
                        <span className="text-blue-500 font-semibold">{data.destination?.city}</span>
                    </p>
                    <p>
                        <strong>Thời gian:</strong>{' '}
                        <span className="text-blue-500 font-semibold">
              {data.duration > 0 ? `${data.duration}N${data.duration - 1}Đ` : 'N/A'}
            </span>
                    </p>
                </div>
                <Divider className="my-3" />
                <div className="text-xs sm:text-sm text-gray-700">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                        <FaInfoCircle className="text-indigo-500" aria-hidden="true" /> Thông tin chuyến đi
                    </h3>
                    <p>
                        <strong>Ngày đi:</strong>{' '}
                        {config.webConfig.convertDateNoTime(detailData.startDate) || 'N/A'}
                    </p>
                    <p>
                        <strong>Ngày về:</strong>{' '}
                        {config.webConfig.convertDateNoTime(detailData.endDate) || 'N/A'}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 mt-2">
                        <FaHotel className="text-orange-400" aria-hidden="true" /> Thông tin khách sạn
                    </h3>
                    <p>
                        <strong>Khách sạn:</strong> {hotel?.name ?? 'Không có thông tin'}
                    </p>
                    <p>
                        <strong>Giá:</strong>{' '}
                        {hotel?.cost ? config.webConfig.getCurrency(hotel.cost) : 'N/A'}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 mt-2">
                        <FaPlaneDeparture className="text-orange-400" aria-hidden="true" /> Thông tin phương tiện
                    </h3>
                    <p>
                        <strong>Phương tiện:</strong> {transport?.name ?? 'Không có thông tin'}
                    </p>
                    <p>
                        <strong>Giá:</strong>{' '}
                        {transport?.cost ? config.webConfig.getCurrency(transport.cost) : 'N/A'}
                    </p>
                </div>
                <Divider className="my-3" />
                <div className="text-xs sm:text-sm text-gray-700">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                        <BiSolidUserDetail className="text-orange-400" aria-hidden="true" /> Khách hàng + Phụ thu
                    </h3>
                    <p>
                        <strong>Người lớn:</strong> {adults || 1} -{' '}
                        {config.webConfig.getCurrency(detailData.priceAdults)}/Người
                    </p>
                    {children > 0 && (
                        <p>
                            <strong>Trẻ em:</strong> {children} -{' '}
                            {config.webConfig.getCurrency(detailData.priceChildren)}/Người
                        </p>
                    )}
                    <p>
                        <strong>Khách sạn:</strong>{' '}
                        {hotel?.cost ? config.webConfig.getCurrency(hotel.cost) : 'N/A'}
                    </p>
                    <p>
                        <strong>Phương tiện:</strong>{' '}
                        {transport?.cost ? config.webConfig.getCurrency(transport.cost) : 'N/A'}
                    </p>
                </div>
                <span className="text-xs text-red-500 mt-2 block">
          * Giá trên đã bao gồm các phụ thu: giá dịch vụ, giá vé máy bay, giá khách sạn, giá ăn uống,
          giá vận chuyển, giá phí tham quan, giá phí hướng dẫn viên, giá phí bảo hiểm, giá phí visa,
          giá phí phục vụ, giá phí khác.
        </span>
                <Divider className="my-3" />
                <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-gray-800">
                        Tổng tiền cần thanh toán:
                    </p>
                    {voucherValid && (
                        <p className="text-sm text-gray-500 line-through">
                            Giá gốc: {config.webConfig.getCurrency(totalBasePrice)}
                        </p>
                    )}
                    <p className="text-lg sm:text-xl font-bold text-red-500 flex justify-end items-center gap-2">
                        {config.webConfig.getCurrency(totalPrice)}
                        {voucherValid && (
                            <span className="text-xs text-green-500 animate-fade-in">
                (Giảm {config.webConfig.getCurrency(actualDiscountAmount)})
              </span>
                        )}
                    </p>
                </div>
            </Card>
        );
    },
);