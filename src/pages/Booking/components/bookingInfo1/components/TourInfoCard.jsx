
import { Card, Divider } from 'antd';
import {
    FaHotel,
    FaInfoCircle,
    FaPlaneDeparture,
} from 'react-icons/fa';
import { BiSolidUserDetail } from 'react-icons/bi';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const formatDateSafe = (value) => {
    if (!value) return 'N/A';

    try {
        return config.webConfig.convertDateNoTime(value) || 'N/A';
    } catch (error) {
        console.warn('Ngày không hợp lệ trong TourInfoCard:', value);
        return 'N/A';
    }
};

const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) return 'N/A';

    return config.webConfig.getCurrency(amount);
};

const getTourImage = (data) => {
    const source =
        data?.image ??
        data?.thumbnail ??
        data?.images?.[0] ??
        data?.coverImage;

    if (!source) return '';

    try {
        const imageSource =
            typeof source === 'string'
                ? source
                : source?.url ??
                  source?.imageUrl ??
                  source?.src ??
                  '';

        return imageSource
            ? config.imageConfig.getImage(imageSource)
            : '';
    } catch (error) {
        console.error('Không thể tải ảnh tour:', error);
        return '';
    }
};

export const TourInfoCard = memo(
    ({
        data = {},
        detailData = {},
        adults = 1,
        children: childCount = 0,
        totalPrice = 0,
        voucherValid = false,
        discount = 0,
        hotel = {},
        transport = {},
        actualDiscountAmount = 0,
    }) => {
        const navigate = useNavigate();

        const tourId =
            data?.id ??
            data?._id ??
            detailData?.tourId ??
            detailData?.tour_id ??
            '';

        const tourTitle =
            data?.title ??
            detailData?.title ??
            'Tour du lịch';

        const tourDescription =
            data?.description ??
            detailData?.description ??
            '';

        const imageUrl = getTourImage(data);

        const destination =
            data?.destination?.city ??
            data?.location ??
            data?.destination?.name ??
            detailData?.destination?.city ??
            detailData?.location ??
            'Chưa có thông tin';

        const durationValue =
            data?.duration ??
            detailData?.duration;

        const duration =
            typeof durationValue === 'string'
                ? durationValue
                : Number(durationValue) > 0
                  ? `${durationValue} ngày ${Number(durationValue) - 1} đêm`
                  : 'N/A';

        const startDate =
            detailData?.startDate ??
            detailData?.departureDate ??
            detailData?.date ??
            detailData?.tourDate;

        const endDate = detailData?.endDate;

        const adultPrice =
            detailData?.priceAdults ??
            detailData?.price ??
            data?.price;

        const childPrice = detailData?.priceChildren;

        const adultCount = Math.max(0, Number(adults) || 0);
        const numberOfChildren = Math.max(0, Number(childCount) || 0);

        const hotelCost = Number(hotel?.cost) || 0;
        const transportCost = Number(transport?.cost) || 0;

        const totalBasePrice =
            adultCount * (Number(adultPrice) || 0) +
            numberOfChildren * (Number(childPrice) || 0) +
            hotelCost +
            transportCost;

        const handleOpenTour = () => {
            if (!tourId) return;

            navigate(`${config.routes.tourDetail}${tourId}`);
        };

        return (
            <Card className="w-full max-w-[500px] rounded-xl border p-4 shadow-lg xl:sticky xl:top-24">
                <h2 className="text-base font-bold uppercase text-gray-800 sm:text-lg">
                    Tóm tắt chuyến đi
                </h2>

                <div className="mt-3 flex gap-3">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={tourTitle}
                            className="h-16 w-20 shrink-0 rounded-md object-cover sm:h-20 sm:w-28"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-gray-100 text-center text-xs text-gray-500 sm:h-20 sm:w-28">
                            Chưa có ảnh
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={handleOpenTour}
                            disabled={!tourId}
                            className="line-clamp-2 text-left text-xs font-semibold uppercase transition-all hover:text-indigo-500 hover:underline disabled:cursor-default sm:text-sm"
                        >
                            {tourTitle}
                        </button>

                        <p className="mt-1 break-all text-xs text-gray-500">
                            Mã tour:{' '}
                            <span className="font-bold">
                                {tourId || 'N/A'}
                            </span>
                        </p>

                        {tourDescription && (
                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                {tourDescription}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-700 sm:text-sm">
                    <p>
                        <strong>Điểm đến:</strong>{' '}
                        <span className="font-semibold text-blue-500">
                            {destination}
                        </span>
                    </p>

                    <p>
                        <strong>Thời gian:</strong>{' '}
                        <span className="font-semibold text-blue-500">
                            {duration}
                        </span>
                    </p>
                </div>

                <Divider className="my-3" />

                <div className="space-y-2 text-xs text-gray-700 sm:text-sm">
                    <h3 className="flex items-center gap-2 text-base font-bold sm:text-lg">
                        <FaInfoCircle
                            className="text-indigo-500"
                            aria-hidden="true"
                        />
                        Thông tin chuyến đi
                    </h3>

                    <p>
                        <strong>Ngày đi:</strong>{' '}
                        {formatDateSafe(startDate)}
                    </p>

                    <p>
                        <strong>Ngày về:</strong>{' '}
                        {formatDateSafe(endDate)}
                    </p>

                    <h3 className="mt-2 flex items-center gap-2 text-base font-bold sm:text-lg">
                        <FaHotel
                            className="text-orange-400"
                            aria-hidden="true"
                        />
                        Thông tin khách sạn
                    </h3>

                    <p>
                        <strong>Khách sạn:</strong>{' '}
                        {hotel?.name ??
                            detailData?.hotel?.name ??
                            'Không có thông tin'}
                    </p>

                    <p>
                        <strong>Giá:</strong>{' '}
                        {formatPrice(hotel?.cost)}
                    </p>

                    <h3 className="mt-2 flex items-center gap-2 text-base font-bold sm:text-lg">
                        <FaPlaneDeparture
                            className="text-orange-400"
                            aria-hidden="true"
                        />
                        Thông tin phương tiện
                    </h3>

                    <p>
                        <strong>Phương tiện:</strong>{' '}
                        {transport?.name ??
                            detailData?.transport?.name ??
                            'Không có thông tin'}
                    </p>

                    <p>
                        <strong>Giá:</strong>{' '}
                        {formatPrice(transport?.cost)}
                    </p>
                </div>

                <Divider className="my-3" />

                <div className="space-y-2 text-xs text-gray-700 sm:text-sm">
                    <h3 className="flex items-center gap-2 text-base font-bold sm:text-lg">
                        <BiSolidUserDetail
                            className="text-orange-400"
                            aria-hidden="true"
                        />
                        Khách hàng và phụ thu
                    </h3>

                    <p>
                        <strong>Người lớn:</strong>{' '}
                        {adultCount} - {formatPrice(adultPrice)}/người
                    </p>

                    {numberOfChildren > 0 && (
                        <p>
                            <strong>Trẻ em:</strong>{' '}
                            {numberOfChildren} - {formatPrice(childPrice)}/người
                        </p>
                    )}

                    <p>
                        <strong>Khách sạn:</strong>{' '}
                        {formatPrice(hotelCost)}
                    </p>

                    <p>
                        <strong>Phương tiện:</strong>{' '}
                        {formatPrice(transportCost)}
                    </p>
                </div>

                <p className="mt-3 block text-xs text-red-500">
                    * Tổng chi phí được tính theo số khách và các khoản
                    phụ thu hiện có. Vui lòng kiểm tra các dịch vụ đi kèm
                    trước khi xác nhận.
                </p>

                <Divider className="my-3" />

                <div className="text-right">
                    <p className="text-base font-bold text-gray-800 sm:text-lg">
                        Tổng tiền cần thanh toán:
                    </p>

                    {voucherValid && (
                        <p className="text-sm text-gray-500 line-through">
                            Giá gốc: {formatPrice(totalBasePrice)}
                        </p>
                    )}

                    <p className="flex items-center justify-end gap-2 text-lg font-bold text-red-500 sm:text-xl">
                        {formatPrice(totalPrice)}
                    </p>

                    {voucherValid && (
                        <p className="mt-1 text-xs text-green-600">
                            Giảm {formatPrice(actualDiscountAmount || discount)}
                        </p>
                    )}
                </div>
            </Card>
        );
    }
);

export default TourInfoCard;
