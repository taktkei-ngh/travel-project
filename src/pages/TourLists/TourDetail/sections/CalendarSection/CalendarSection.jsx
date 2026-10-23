
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Button,
    Calendar,
    Card,
    Divider,
    Image,
    Menu,
    Rate,
    Skeleton,
    Empty,
    message,
} from 'antd';
import dayjs from 'dayjs';
import BookingServices from '~/services/BookingServices';
import config from '~/config';
import TourDetailServices from '~/services/TourDetailServices';
import HotelServices from '~/services/HotelServices';
import TransportServices from '~/services/TransportServices';
import {
    FaBus,
    FaCalendarAlt,
    FaChild,
    FaHotel,
    FaMoneyBill,
    FaUser,
} from 'react-icons/fa';
import { PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/* ======================================================
   HELPERS
====================================================== */

const getResponseData = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response?.data?.months)) {
        return response.data.months;
    }

    if (Array.isArray(response?.months)) {
        return response.months;
    }

    return (
        response?.data?.data ??
        response?.data ??
        response?.result ??
        response ??
        null
    );
};

const getMonthValue = (item) => {
    const value =
        item?.month ??
        item?.date ??
        item?.getDate ??
        item;

    if (typeof value !== 'string') return '';

    if (/^\d{4}-\d{2}$/.test(value)) {
        return value;
    }

    const parsed = dayjs(value);

    return parsed.isValid() ? parsed.format('YYYY-MM') : '';
};

const normalizeDayStatus = (status) => {
    const value = String(status || 'AVAILABLE').toUpperCase();

    if (
        ['AVAILABLE', 'OPEN', 'ACTIVE', 'PUBLISHED'].includes(value)
    ) {
        return 'OPEN';
    }

    if (['IN_PROGRESS', 'IN-PROGRESS'].includes(value)) {
        return 'IN_PROGRESS';
    }

    if (
        [
            'CLOSED',
            'CANCELLED',
            'CANCELED',
            'INACTIVE',
            'DELETED',
            'FULL',
            'SOLD_OUT',
        ].includes(value)
    ) {
        return 'CLOSED';
    }

    return 'CLOSED';
};

const normalizeTourDay = (item) => {
    const rawDate =
        item?.startDate ||
        item?.departureDate ||
        item?.date ||
        item?.tourDate;

    const parsedDate = rawDate ? dayjs(rawDate) : null;

    const dayNumber =
        item?.getDate != null
            ? Number(item.getDate)
            : parsedDate?.isValid()
              ? parsedDate.date()
              : null;

    return {
        ...item,
        getDate: dayNumber,
        getId: item?.getId ?? item?.id ?? item?._id,
        status: normalizeDayStatus(item?.status),
        startDate: item?.startDate ?? rawDate,
        date: item?.date ?? rawDate,
    };
};

const getImageUrl = (image) => {
    if (!image) return undefined;

    const source =
        typeof image === 'string'
            ? image
            : image?.url ??
              image?.imageUrl ??
              image?.src ??
              image?.thumbnail;

    if (!source) return undefined;

    try {
        return config.imageConfig.getImage(source);
    } catch (error) {
        console.error('Không thể xử lý ảnh tour:', error);
        return undefined;
    }
};

/*
 * Định dạng ngày an toàn.
 * Không gọi convertDateNoTime vì hàm đó có thể ném
 * RangeError: Invalid time value khi dữ liệu không hợp lệ.
 */
const formatDateSafe = (value) => {
    if (
        value == null ||
        value === '' ||
        value === 'Invalid Date'
    ) {
        return 'Chưa có thông tin';
    }

    const dateValue = value?.$date ?? value;
    const parsedDate = dayjs(dateValue);

    if (!parsedDate.isValid()) {
        console.warn('Ngày không hợp lệ:', value);
        return 'Chưa có thông tin';
    }

    return parsedDate.format('DD/MM/YYYY');
};

/* ======================================================
   MAIN COMPONENT
====================================================== */

export const CalendarSection = ({ data = {} }) => {
    const navigate = useNavigate();
    const dayRequestRef = useRef(0);

    const tourId = data?.id ?? data?._id ?? data?.tourId ?? null;

    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState([]);
    const [days, setDays] = useState([]);

    const [tourDetail, setTourDetail] = useState(
        () => data?.detail?.[0] ?? data ?? {}
    );

    const [transport, setTransport] = useState({});
    const [hotel, setHotel] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [toggle, setToggle] = useState(true);

    const mainImage = getImageUrl(
        data?.image ??
            data?.thumbnail ??
            (Array.isArray(data?.images) ? data.images[0] : null)
    );

    const secondaryImages = Array.isArray(data?.images)
        ? data.images.slice(1)
        : [];

    const displayPrice =
        tourDetail?.priceAdults ??
        tourDetail?.price ??
        data?.price;

    const displayRating = Number(data?.ratingAvg ?? data?.rating ?? 0);

    const displayLocation =
        data?.destination?.city ??
        data?.location ??
        data?.destination?.name ??
        'Chưa có thông tin';

    const displayDuration =
        data?.duration ??
        tourDetail?.duration ??
        'Chưa có thông tin';

    const availableSeats =
        tourDetail?.quantity ??
        tourDetail?.availableSeats ??
        data?.availableSeats;

    const firstBookableDay = days.find(
        (item) => item?.status === 'OPEN' && item?.getId
    );

    const canBook = Boolean(
        tourId &&
            displayPrice != null &&
            firstBookableDay
    );

    /* ======================================================
       RESET WHEN TOUR CHANGES
    ====================================================== */

    useEffect(() => {
        dayRequestRef.current += 1;

        setTourDetail(data?.detail?.[0] ?? data ?? {});
        setHotel({});
        setTransport({});
        setSelectedMonth(null);
        setSelectedDay(null);
        setDays([]);
        setMonth([]);
        setToggle(true);
        setLoading(false);
    }, [tourId]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ======================================================
       LOAD MONTHS
    ====================================================== */

    useEffect(() => {
        let active = true;

        const loadMonths = async () => {
            if (!tourId) {
                setMonth([]);
                setDays([]);
                return;
            }

            try {
                const response =
                    await BookingServices.getInfoMonth(tourId);

                const result = getResponseData(response);

                const monthList = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.months)
                      ? result.months
                      : [];

                if (active) {
                    setMonth(monthList);
                }
            } catch (error) {
                if (active) {
                    setMonth([]);
                    setDays([]);

                    console.error(
                        'Không thể tải lịch khởi hành:',
                        error
                    );
                }
            }
        };

        loadMonths();

        return () => {
            active = false;
        };
    }, [tourId]);

    /* ======================================================
       LOAD DAYS BY MONTH
    ====================================================== */

    const handleSelectedMonth = useCallback(
        async (monthParam) => {
            if (!tourId || !monthParam) return;

            const normalizedMonth = getMonthValue(monthParam);

            if (!normalizedMonth) {
                message.warning('Tháng khởi hành không hợp lệ.');
                return;
            }

            const requestId = ++dayRequestRef.current;

            setSelectedMonth(normalizedMonth);
            setSelectedDay(null);
            setDays([]);
            setToggle(true);
            setLoading(true);

            try {
                const response = await BookingServices.getInfoDay({
                    tourId,
                    months: normalizedMonth,
                });

                if (requestId !== dayRequestRef.current) return;

                const result = getResponseData(response);

                const records = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.days)
                      ? result.days
                      : Array.isArray(result?.items)
                        ? result.items
                        : [];

                const normalizedDays = records
                    .map(normalizeTourDay)
                    .filter((item) => {
                        return (
                            Number.isInteger(item.getDate) &&
                            item.getDate >= 1 &&
                            item.getDate <= 31
                        );
                    });

                setDays(normalizedDays);
            } catch (error) {
                if (requestId === dayRequestRef.current) {
                    setDays([]);

                    console.error(
                        'Không thể tải ngày khởi hành:',
                        error
                    );

                    message.error(
                        'Không tải được lịch tháng này. Vui lòng thử lại.'
                    );
                }
            } finally {
                if (requestId === dayRequestRef.current) {
                    setLoading(false);
                }
            }
        },
        [tourId]
    );

    /* ======================================================
       AUTO SELECT FIRST MONTH
    ====================================================== */

    useEffect(() => {
        if (!month.length) return;

        const firstMonth = getMonthValue(month[0]);

        if (firstMonth) {
            handleSelectedMonth(firstMonth);
        }
    }, [month, handleSelectedMonth]);

    /* ======================================================
       LOAD DEPARTURE DETAIL
    ====================================================== */

    const selectTourDetail = useCallback(
        async (id, fallbackDetail) => {
            if (fallbackDetail) {
                setTourDetail(fallbackDetail);
            }

            setToggle(false);

            if (!id) return;

            setLoading(true);

            try {
                const response =
                    await TourDetailServices.getTourDetailById(id);

                const result = getResponseData(response);

                const detail =
                    result?.detail?.[0] ??
                    result?.data ??
                    result;

                if (detail && typeof detail === 'object') {
                    setTourDetail(detail);
                }
            } catch (error) {
                console.error(
                    'Không thể tải chi tiết lịch khởi hành:',
                    error
                );

                message.warning(
                    'Không tải thêm được chi tiết. Đang hiển thị dữ liệu lịch hiện có.'
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /* ======================================================
       CLICK DEPARTURE DAY
    ====================================================== */

    const handleDayClick = useCallback(
        (validDay) => {
            if (!validDay || validDay.status !== 'OPEN') {
                return;
            }

            setSelectedDay(validDay.getDate);

            const detailId =
                validDay.getId ??
                validDay.id ??
                validDay._id;

            selectTourDetail(detailId, validDay);
        },
        [selectTourDetail]
    );

    /* ======================================================
       LOAD HOTEL AND TRANSPORT
    ====================================================== */

    useEffect(() => {
        let active = true;

        const loadRelatedServices = async () => {
            const hotelId = tourDetail?.hotelId;
            const transportId = tourDetail?.transportId;

            setHotel({});
            setTransport({});

            if (hotelId) {
                try {
                    const response =
                        await HotelServices.getHotelById(hotelId);

                    const result = getResponseData(response);

                    if (active) {
                        setHotel(
                            result && typeof result === 'object'
                                ? result
                                : {}
                        );
                    }
                } catch (error) {
                    if (active) {
                        console.error(
                            'Không thể tải khách sạn:',
                            error
                        );
                    }
                }
            }

            if (transportId) {
                try {
                    const response =
                        await TransportServices.getTransportById(
                            transportId
                        );

                    const result = getResponseData(response);

                    if (active) {
                        setTransport(
                            result && typeof result === 'object'
                                ? result
                                : {}
                        );
                    }
                } catch (error) {
                    if (active) {
                        console.error(
                            'Không thể tải phương tiện:',
                            error
                        );
                    }
                }
            }
        };

        loadRelatedServices();

        return () => {
            active = false;
        };
    }, [
        tourDetail?.hotelId,
        tourDetail?.transportId,
    ]);

    /* ======================================================
       BOOK TOUR
    ====================================================== */

    const handleBooking = () => {
        if (!canBook) {
            message.info(
                'Tour này chưa có lịch khởi hành đang mở. Vui lòng bổ sung lịch trước khi đặt.'
            );
            return;
        }

        const selectedDetailId =
            selectedDay != null
                ? tourDetail?._id ?? tourDetail?.id
                : null;

        const bookingId =
            selectedDetailId ??
            firstBookableDay?.getId ??
            firstBookableDay?._id ??
            firstBookableDay?.id;

        if (!bookingId) {
            message.warning(
                'Không tìm thấy ID lịch khởi hành. Vui lòng chọn lại ngày.'
            );
            return;
        }

        navigate(`${config.routes.booking}${bookingId}`);
    };

    const selectedMonthLabel = selectedMonth
        ? config.webConfig.convertMonthYear(selectedMonth)
        : 'Chưa có lịch khởi hành';

    /* ======================================================
       RENDER
    ====================================================== */

    return (
        <>
            {/* ẢNH TOUR VÀ THÔNG TIN CƠ BẢN */}
            <div className="flex flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row lg:px-8">
                <div className="w-full min-w-0">
                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        <div className="col-span-1 aspect-[3/2] overflow-hidden rounded-xl bg-gray-100 shadow-lg sm:col-span-1 lg:col-span-3">
                            {mainImage ? (
                                <Image
                                    src={mainImage}
                                    alt={data?.title ?? 'Ảnh tour'}
                                    width="100%"
                                    height="100%"
                                    className="h-full w-full object-cover"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="flex min-h-48 h-full items-center justify-center text-sm text-gray-500">
                                    Chưa có ảnh tour
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                            {secondaryImages.map((image, index) => {
                                const imageUrl = getImageUrl(image);

                                if (!imageUrl) return null;

                                return (
                                    <Image
                                        key={`${imageUrl}-${index}`}
                                        src={imageUrl}
                                        alt={`Ảnh tour ${index + 2}`}
                                        width="100%"
                                        height={150}
                                        className="rounded-xl object-cover shadow-lg"
                                        style={{ objectFit: 'cover' }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Card className="h-fit w-full rounded-2xl p-4 shadow-xl sm:max-w-md lg:sticky lg:top-20 lg:max-w-sm lg:shrink-0">
                    <h2 className="mb-4 text-xl font-semibold text-red-600 sm:text-2xl">
                        Giá:{' '}
                        {displayPrice != null
                            ? config.webConfig.getCurrency(displayPrice)
                            : 'Chưa có thông tin'}{' '}
                        / Người
                    </h2>

                    <div className="space-y-2 text-sm sm:text-base">
                        <p>
                            <strong>Mã tour:</strong>{' '}
                            {tourId ?? 'Chưa có mã tour'}
                        </p>

                        <p>
                            <strong>Điểm đến:</strong>{' '}
                            {displayLocation}
                        </p>

                        <p>
                            <strong>Ngày khởi hành:</strong>{' '}
                            {formatDateSafe(
                                tourDetail?.startDate ??
                                    tourDetail?.departureDate ??
                                    tourDetail?.date ??
                                    tourDetail?.tourDate
                            )}
                        </p>

                        <p>
                            <strong>Thời gian:</strong>{' '}
                            {displayDuration}
                        </p>

                        <p>
                            <strong>Số lượng:</strong>{' '}
                            {availableSeats != null
                                ? `${availableSeats} chỗ`
                                : 'Chưa có thông tin'}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <strong>Trung bình đánh giá:</strong>

                            <Rate
                                allowHalf
                                value={displayRating}
                                disabled
                                style={{ color: '#faad14' }}
                            />

                            <span className="text-gray-600">
                                {displayRating > 0
                                    ? `${displayRating.toFixed(1)}/5`
                                    : 'Chưa có đánh giá'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex">
                        <Button
                            disabled={!canBook}
                            onClick={handleBooking}
                            type="primary"
                            className="w-full !bg-red-500"
                        >
                            {canBook ? 'Đặt tour' : 'Chưa có lịch khởi hành'}
                        </Button>
                    </div>

                    <div className="mt-4">
                        <Button
                            icon={<PhoneOutlined />}
                            className="w-full bg-gray-100 text-sm sm:text-base"
                            onClick={() =>
                                message.info(
                                    'Chức năng gọi trực tuyến chưa được tích hợp. Cần cấu hình số điện thoại hoặc dịch vụ gọi trước khi sử dụng.'
                                )
                            }
                        >
                            Gọi miễn phí qua internet
                        </Button>
                    </div>
                </Card>
            </div>

            <Divider className="my-6 sm:my-8">
                <p className="text-center text-xl font-bold uppercase text-orange-400 sm:text-2xl lg:text-3xl">
                    Lịch trình khởi hành
                </p>
            </Divider>

            {/* CHỌN THÁNG VÀ XEM LỊCH */}
            <div className="flex flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:flex-row lg:px-8">
                <Card className="h-fit w-full p-3 shadow-lg sm:p-4 lg:w-1/4">
                    <h2 className="mb-2 text-base font-bold sm:text-lg">
                        Chọn tháng
                    </h2>

                    {month.length > 0 ? (
                        <Menu
                            selectedKeys={
                                selectedMonth
                                    ? [String(selectedMonth)]
                                    : []
                            }
                            mode="vertical"
                            className="text-sm sm:text-base"
                        >
                            {month.map((item, index) => {
                                const monthValue =
                                    getMonthValue(item);

                                if (!monthValue) return null;

                                return (
                                    <Menu.Item
                                        key={String(monthValue)}
                                        onClick={() =>
                                            handleSelectedMonth(monthValue)
                                        }
                                        className="font-bold text-blue-500"
                                    >
                                        {config.webConfig.convertMonthYear(
                                            monthValue
                                        )}
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Chưa có lịch khởi hành"
                        />
                    )}
                </Card>

                <div className="w-full min-w-0">
                    {month.length === 0 ? (
                        <Card className="flex min-h-64 items-center justify-center shadow-lg">
                            <Empty description="Tour này chưa có lịch khởi hành. Vui lòng bổ sung lịch trước khi đặt tour." />
                        </Card>
                    ) : toggle ? (
                        <Card className="w-full shadow-lg">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-sm text-gray-500">
                                    Chọn ngày có viền đỏ để xem chi tiết lịch.
                                </span>

                                {loading && (
                                    <span className="text-sm text-gray-500">
                                        Đang tải lịch...
                                    </span>
                                )}
                            </div>

                            <Calendar
                                value={
                                    selectedMonth
                                        ? dayjs(`${selectedMonth}-01`)
                                        : dayjs()
                                }
                                fullscreen={false}
                                onPanelChange={(date) => {
                                    handleSelectedMonth(
                                        date.format('YYYY-MM')
                                    );
                                }}
                                headerRender={() => null}
                                fullCellRender={(date) => {
                                    const dayNumber = date.date();
                                    const monthYear =
                                        date.format('YYYY-MM');

                                    const currentMonth =
                                        selectedMonth ??
                                        dayjs().format('YYYY-MM');

                                    const validDay =
                                        monthYear === currentMonth
                                            ? days.find(
                                                  (item) =>
                                                      Number(
                                                          item?.getDate
                                                      ) === dayNumber
                                              )
                                            : null;

                                    const isOpen =
                                        validDay?.status === 'OPEN';

                                    const isSelected =
                                        isOpen &&
                                        selectedDay === dayNumber;

                                    let buttonClass =
                                        'border border-transparent text-gray-400';

                                    if (monthYear !== currentMonth) {
                                        buttonClass =
                                            'border border-transparent text-gray-300';
                                    } else if (isOpen) {
                                        buttonClass =
                                            'border border-red-500 text-red-600 hover:bg-red-50 cursor-pointer';
                                    } else if (
                                        validDay?.status === 'IN_PROGRESS'
                                    ) {
                                        buttonClass =
                                            'border border-orange-400 text-orange-500 cursor-not-allowed';
                                    } else if (
                                        validDay?.status === 'CLOSED'
                                    ) {
                                        buttonClass =
                                            'border border-gray-300 text-gray-400 cursor-not-allowed';
                                    } else {
                                        buttonClass =
                                            'border border-transparent text-gray-700';
                                    }

                                    if (isSelected) {
                                        buttonClass +=
                                            ' !bg-red-500 !text-white';
                                    }

                                    return (
                                        <button
                                            type="button"
                                            disabled={!isOpen}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDayClick(validDay);
                                            }}
                                            aria-label={
                                                isOpen
                                                    ? `Chọn ngày ${dayNumber}`
                                                    : `Ngày ${dayNumber} không có lịch mở`
                                            }
                                            className={`flex min-h-12 w-full flex-col items-center justify-center rounded-lg p-1 text-center text-xs transition-colors sm:p-2 sm:text-sm ${buttonClass}`}
                                        >
                                            <span className="font-semibold">
                                                {dayNumber}
                                            </span>

                                            {validDay && (
                                                <span className="mt-1 text-[9px] font-bold leading-tight sm:text-[10px]">
                                                    {isOpen
                                                        ? 'Còn chỗ'
                                                        : validDay.status ===
                                                            'IN_PROGRESS'
                                                          ? 'Đang diễn ra'
                                                          : 'Đã đóng'}
                                                </span>
                                            )}
                                        </button>
                                    );
                                }}
                            />

                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600 sm:text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded border border-red-500" />
                                    Còn chỗ
                                </span>

                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded border border-orange-400" />
                                    Đang diễn ra
                                </span>

                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded border border-gray-300" />
                                    Đã đóng
                                </span>
                            </div>
                        </Card>
                    ) : (
                        <Card className="w-full rounded-xl p-4 shadow-lg sm:p-6">
                            {loading ? (
                                <Skeleton
                                    active
                                    paragraph={{ rows: 10 }}
                                    style={{ padding: 20 }}
                                />
                            ) : (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <Button
                                            onClick={() => {
                                                setToggle(true);
                                                setSelectedDay(null);
                                            }}
                                        >
                                            ← Quay lại lịch
                                        </Button>

                                        <h2 className="text-xl font-bold text-red-500 sm:text-2xl lg:text-3xl">
                                            {selectedDay != null
                                                ? `${selectedDay}/${selectedMonthLabel}`
                                                : selectedMonthLabel}
                                        </h2>
                                    </div>

                                    <div className="mt-4">
                                        <h2 className="text-center text-base font-bold uppercase text-orange-500 sm:text-lg lg:text-xl">
                                            Thông tin khởi hành
                                        </h2>

                                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2 sm:gap-4 sm:text-base lg:grid-cols-3">
                                            <div className="flex flex-col gap-2 font-semibold">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <FaHotel className="text-orange-500" />
                                                    Khách sạn:
                                                    <span className="text-gray-500">
                                                        {hotel?.name ??
                                                            tourDetail?.hotel?.name ??
                                                            'Chưa có thông tin'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <FaMoneyBill className="text-orange-500" />
                                                    Giá:
                                                    <span className="text-gray-500">
                                                        {hotel?.cost != null
                                                            ? config.webConfig.getCurrency(
                                                                  hotel.cost
                                                              )
                                                            : 'Chưa có thông tin'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 font-semibold">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <FaBus className="text-orange-500" />
                                                    Phương tiện:
                                                    <span className="text-gray-500">
                                                        {transport?.name ??
                                                            tourDetail?.transport?.name ??
                                                            'Chưa có thông tin'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <FaMoneyBill className="text-orange-500" />
                                                    Giá:
                                                    <span className="text-gray-500">
                                                        {transport?.cost != null
                                                            ? config.webConfig.getCurrency(
                                                                  transport.cost
                                                              )
                                                            : 'Chưa có thông tin'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 font-semibold">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <FaCalendarAlt className="text-orange-500" />
                                                    Ngày khởi hành:
                                                    <span className="text-gray-500">
                                                        {formatDateSafe(
                                                            tourDetail?.startDate ??
                                                                tourDetail?.departureDate ??
                                                                tourDetail?.date ??
                                                                tourDetail?.tourDate
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <FaCalendarAlt className="text-orange-500" />
                                                    Ngày về:
                                                    <span className="text-gray-500">
                                                        {formatDateSafe(
                                                            tourDetail?.endDate
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    <h2 className="text-center text-base font-bold uppercase text-orange-500 sm:text-lg lg:text-xl">
                                        Giá tour
                                    </h2>

                                    <div className="grid grid-cols-1 gap-3 p-3 text-sm sm:grid-cols-2 sm:gap-6 sm:p-4 sm:text-base">
                                        <div className="space-y-3">
                                            <p className="flex items-center gap-2 font-semibold">
                                                <FaUser className="text-red-500" />
                                                Người lớn:
                                                <span className="text-red-500">
                                                    {(
                                                        tourDetail?.priceAdults ??
                                                        tourDetail?.price ??
                                                        data?.price
                                                    ) != null
                                                        ? config.webConfig.getCurrency(
                                                              tourDetail?.priceAdults ??
                                                                  tourDetail?.price ??
                                                                  data?.price
                                                          )
                                                        : 'Chưa có thông tin'}
                                                </span>
                                            </p>

                                            <p className="flex items-center gap-2 font-semibold">
                                                <FaChild className="text-red-500" />
                                                Trẻ em:
                                                <span className="text-red-500">
                                                    {tourDetail?.priceChildren != null
                                                        ? config.webConfig.getCurrency(
                                                              tourDetail.priceChildren
                                                          )
                                                        : 'Chưa có thông tin'}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="flex items-center gap-2 font-semibold">
                                                <FaHotel className="text-red-500" />
                                                Giá khách sạn:
                                                <span className="text-red-500">
                                                    {hotel?.cost != null
                                                        ? config.webConfig.getCurrency(
                                                              hotel.cost
                                                          )
                                                        : 'Chưa có thông tin'}
                                                </span>
                                            </p>

                                            <p className="flex items-center gap-2 font-semibold">
                                                <FaBus className="text-red-500" />
                                                Giá phương tiện:
                                                <span className="text-red-500">
                                                    {transport?.cost != null
                                                        ? config.webConfig.getCurrency(
                                                              transport.cost
                                                          )
                                                        : 'Chưa có thông tin'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <Divider />

                                    <p className="mx-auto rounded-lg bg-blue-50 p-3 text-center text-sm font-bold italic text-red-500 sm:p-4 sm:text-base">
                                        Giá tour mỗi người có thể chưa bao
                                        gồm khách sạn, dịch vụ và phương
                                        tiện. Vui lòng kiểm tra chi tiết
                                        trước khi đặt tour.
                                    </p>

                                    <Button
                                        type="primary"
                                        className="mt-4 w-full !bg-red-500"
                                        disabled={
                                            !(
                                                tourDetail?._id ||
                                                tourDetail?.id
                                            )
                                        }
                                        onClick={handleBooking}
                                    >
                                        Đặt lịch khởi hành này
                                    </Button>
                                </>
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default CalendarSection;
