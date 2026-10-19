import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import config from '~/config';
import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Radio,
} from 'antd';
import BookingServices from '~/services/BookingServices';
import { ModalTerms } from '~/pages/Terms/ModalTerms';
import { FaTags } from 'react-icons/fa';
import TourService from '~/services/TourServices';
import { useAuth } from '~/config/AuthContext';
import VoucherServices from '~/services/VoucherServices';
import HotelServices from '~/services/HotelServices';
import TransportServices from '~/services/TransportServices';
import { TourInfoCard } from '~/pages/Booking/components/bookingInfo1/components/TourInfoCard';

const { TextArea } = Input;

export const BookingInfo1 = ({ data }) => {
    const { id } = useParams();
    const { currentUser } = useAuth();

    const [booking, setBooking] = useState({});
    const [fullName, setFullName] = useState(currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [note, setNote] = useState('');
    const [confirm, setConfirm] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [voucherValid, setVoucherValid] = useState(false);
    const [open, setOpen] = useState(false);
    const [voucher, setVoucher] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [maxDiscountAmount, setMaxDiscountAmount] = useState(0);
    const [tour, setTour] = useState({});
    const [bookingDetails, setBookingDetails] = useState([]);
    const [hotel, setHotel] = useState({});
    const [transport, setTransport] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loadingBook, setLoadingBook] = useState(false);
    const [maxTotalPassengers, setMaxTotalPassengers] = useState(data?.quantity || 10);
    const [actualDiscountAmount, setActualDiscountAmount] = useState(0); // Thêm state để lưu số tiền giảm thực tế

    // Fetch hotel, transport, and tour (giữ nguyên từ mã trước)
    const fetchHotelAndTransport = useCallback(async () => {
        try {
            const requests = [];
            if (data?.hotelId) {
                requests.push(HotelServices.getHotelById(data.hotelId));
            }
            if (data?.transportId) {
                requests.push(TransportServices.getTransportById(data.transportId));
            }
            requests.push(TourService.getTourByTourDetailId(id));

            const [hotelRes, transportRes, tourRes] = await Promise.all(
                requests.map((req) => req.catch((err) => ({ error: err })))
            );

            if (hotelRes && !hotelRes.error) setHotel(hotelRes);
            if (transportRes && !transportRes.error) setTransport(transportRes);
            if (tourRes && !tourRes.error) setTour(tourRes.data);
            if (hotelRes?.error || transportRes?.error || tourRes?.error) {
                message.error('Không thể tải đầy đủ thông tin khách sạn, phương tiện hoặc tour!');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            message.error('Có lỗi xảy ra khi tải thông tin!');
        }
    }, [data?.hotelId, data?.transportId, id]);

    useEffect(() => {
        fetchHotelAndTransport();
    }, [fetchHotelAndTransport]);

    // Cập nhật maxTotalPassengers
    useEffect(() => {
        if (data?.quantity) {
            setMaxTotalPassengers(data.quantity);
        }
    }, [data?.quantity]);

    const handleAdultsChange = useCallback(
        (value) => {
            const total = value + children;
            if (total > maxTotalPassengers) {
                message.warning(`Tổng số hành khách không được vượt quá ${maxTotalPassengers}`);
                setAdults(maxTotalPassengers - children);
            } else {
                setAdults(value);
            }
        },
        [children, maxTotalPassengers]
    );

    const handleChildrenChange = useCallback(
        (value) => {
            const total = adults + value;
            if (total > maxTotalPassengers) {
                message.warning(`Tổng số hành khách không được vượt quá ${maxTotalPassengers}`);
                setChildren(maxTotalPassengers - adults);
            } else {
                setChildren(value);
            }
        },
        [adults, maxTotalPassengers]
    );

    // Manage booking details (giữ nguyên)
    useEffect(() => {
        setBookingDetails((prev) => {
            const newDetails = [];
            for (let i = 0; i < adults; i++) {
                newDetails.push({
                    id: `adult-${i}`,
                    fullName: prev.find((item) => item.id === `adult-${i}`)?.fullName || '',
                    email: prev.find((item) => item.id === `adult-${i}`)?.email || '',
                    phoneNumber: prev.find((item) => item.id === `adult-${i}`)?.phoneNumber || '',
                    gender: prev.find((item) => item.id === `adult-${i}`)?.gender || 'MALE',
                    birthday: prev.find((item) => item.id === `adult-${i}`)?.birthday || '',
                    ageGroup: 'ADULT',
                    price: data.priceAdults,
                });
            }
            for (let i = 0; i < children; i++) {
                newDetails.push({
                    id: `child-${i}`,
                    fullName: prev.find((item) => item.id === `child-${i}`)?.fullName || '',
                    email: '',
                    phoneNumber: prev.find((item) => item.id === `child-${i}`)?.phoneNumber || '',
                    gender: prev.find((item) => item.id === `child-${i}`)?.gender || 'MALE',
                    birthday: prev.find((item) => item.id === `child-${i}`)?.birthday || '',
                    ageGroup: 'CHILD',
                    price: data.priceChildren,
                });
            }
            return newDetails;
        });
    }, [adults, children, data.priceAdults, data.priceChildren]);

    // Apply voucher
    const applyVoucher = useCallback(
        async (voucherCode) => {
            if (!voucherCode) {
                setDiscount(0);
                setVoucherValid(false);
                setMaxDiscountAmount(0);
                setVoucherCode('');
                setActualDiscountAmount(0);
                return;
            }
            try {
                const checkResponse = await VoucherServices.checkVoucher({
                    codeVoucher: voucherCode,
                    tourId: id || null,
                    orderValue: totalPrice || 0,
                });
                if (checkResponse.data.valid === true) {
                    setDiscount(checkResponse.data.discountValue);
                    setMaxDiscountAmount(checkResponse.data.maxDiscountAmount);
                    setVoucherCode(checkResponse.data.voucherCode);
                    setVoucherValid(true);
                    message.success('Áp dụng voucher thành công!');
                } else {
                    setDiscount(0);
                    setVoucherValid(false);
                    setMaxDiscountAmount(0);
                    setVoucherCode('');
                    setActualDiscountAmount(0);
                    message.error('Mã voucher không hợp lệ hoặc không đủ điều kiện!');
                }
            } catch (err) {
                setDiscount(0);
                setVoucherValid(false);
                setMaxDiscountAmount(0);
                setVoucherCode('');
                setActualDiscountAmount(0);
                message.error(err.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra voucher!');
                console.error(err);
            }
        },
        [id, totalPrice]
    );

    // Update total price
    useEffect(() => {
        const basePrice = adults * data.priceAdults + children * data.priceChildren;
        const hotelCost = hotel.cost || 0;
        const transportCost = transport.cost || 0;
        const totalBasePrice = basePrice + hotelCost + transportCost;

        let discountedPrice = totalBasePrice;
        let actualDiscount = 0;

        if (voucherValid) {
            const discountAmount = totalBasePrice * (discount / 100); // Số tiền giảm theo phần trăm
            actualDiscount = Math.min(discountAmount, maxDiscountAmount || Infinity); // Giới hạn bởi maxDiscountAmount
            discountedPrice = totalBasePrice - actualDiscount;
        }

        setTotalPrice(discountedPrice);
        setActualDiscountAmount(actualDiscount);
    }, [adults, children, data.priceAdults, data.priceChildren, hotel.cost, transport.cost, discount, voucherValid, maxDiscountAmount]);

    const updateBookingDetail = useCallback((id, field, value) => {
        setBookingDetails((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((item) => item.id === id);
            if (index !== -1) {
                updated[index][field] = value;
            }
            return updated;
        });
    }, []);

    // Book tour
    const BookTour = useCallback(async () => {
        setLoadingBook(true);
        const basePrice = adults * data.priceAdults + children * data.priceChildren + (hotel.cost || 0) + (transport.cost || 0);
        let finalPrice = basePrice;

        if (voucherValid) {
            const discountAmount = basePrice * (discount / 100);
            const actualDiscount = Math.min(discountAmount, maxDiscountAmount || Infinity);
            finalPrice = basePrice - actualDiscount;
        }

        const body = {
            bookerFullName: fullName || '',
            bookerEmail: email || '',
            bookerPhoneNumber: phone || '',
            bookerAddress: address || '',
            paymentMethod: 'VNPAY',
            specialRequests: note || 'NO',
            totalAmount: finalPrice,
            voucherCode: voucherValid ? voucher : null,
            bookingDetails: bookingDetails.map((detail) => ({
                fullName: detail.fullName || '',
                email: detail.email || '',
                phoneNumber: detail.phoneNumber || '',
                gender: detail.gender || 'MALE',
                birthday: detail.birthday ? new Date(detail.birthday).toISOString() : null,
                ageGroup: detail.ageGroup || 'ADULT',
                price: detail.price || 0,
            })),
        };

        try {
            const bookingResponse = await BookingServices.bookTourByTourDetailId(data.id, body);
            const bookingData = bookingResponse.data;
            setBooking(bookingData);

            const checkoutResponse = await BookingServices.checkOut({
                amount: bookingData.totalAmount,
                orderInfo: `${bookingData.bookingNo}`,
            });
            window.location.href = checkoutResponse;
        } catch (err) {
            console.error('Error booking tour:', err);
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Đặt tour thất bại!';
            message.error(errorMessage);
        } finally {
            setLoadingBook(false);
        }
    }, [
        adults,
        children,
        data.id,
        data.priceAdults,
        data.priceChildren,
        hotel.cost,
        transport.cost,
        fullName,
        email,
        phone,
        address,
        note,
        voucherValid,
        voucher,
        discount,
        maxDiscountAmount,
        bookingDetails,
    ]);

    const [form] = Form.useForm();

    return (
        <div className="container mx-auto px-4 sm:px-6 my-8 sm:my-12">
            <h1 className="text-3xl sm:text-5xl font-light text-orange-600 mb-4 text-center">Đặt tour</h1>
            <h2 className="text-xl sm:text-2xl font-light text-orange-600 mb-4 text-center">
                THÔNG TIN CHI TIẾT TOUR
            </h2>
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4">
                {/* Form Section */}
                <div className="w-full md:w-[600px] lg:w-[700px]">
                    <div className="mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg uppercase border">
                        <Form form={form} layout="vertical" initialValues={{ people: 1 }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="font-bold">Họ và tên</label>
                                    <Input
                                        placeholder="Nhập họ và tên"
                                        onChange={(e) => setFullName(e.target.value)}
                                        value={fullName}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-bold">Số điện thoại</label>
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-bold">Email</label>
                                    <Input
                                        placeholder="Nhập email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-bold">Địa chỉ</label>
                                    <Input
                                        placeholder="Nhập địa chỉ"
                                        onChange={(e) => setAddress(e.target.value)}
                                        value={address}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold text-orange-500">Hành khách</h2>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Card className="flex-1 bg-gray-50 shadow-lg">
                                        <div className="text-lg font-semibold flex flex-col">
                                            Người lớn
                                            <span className="text-red-300 text-sm font-mono">
                        {config.webConfig.getCurrency(data.priceAdults)}/Người
                      </span>
                                        </div>
                                        <InputNumber
                                            className="w-full mt-2"
                                            min={1}
                                            max={maxTotalPassengers - children}
                                            value={adults}
                                            onChange={handleAdultsChange}
                                        />
                                    </Card>
                                    <Card className="flex-1 bg-gray-50 shadow-lg">
                                        <div className="text-lg font-semibold flex flex-col">
                                            Trẻ em
                                            <span className="text-red-300 text-sm font-mono">
                        (30% giá người lớn)
                      </span>
                                            <span className="text-red-300 text-sm font-mono">
                        {config.webConfig.getCurrency(data.priceChildren)}/Người
                      </span>
                                        </div>
                                        <InputNumber
                                            className="w-full mt-2"
                                            min={0}
                                            max={maxTotalPassengers - adults}
                                            value={children}
                                            onChange={handleChildrenChange}
                                        />
                                    </Card>
                                </div>
                            </div>
                            <Divider />
                            <h2 className="text-lg font-semibold text-orange-500">Thông tin từng hành khách</h2>
                            <div className="space-y-4 p-4 max-h-96 overflow-y-auto">
                                {bookingDetails.map((item, index) => {
                                    const isAdult = item.ageGroup === 'ADULT';
                                    const passengerNumber = isAdult
                                        ? index +
                                        1 -
                                        bookingDetails.filter(
                                            (i, idx) => i.ageGroup === 'CHILD' && idx < index,
                                        ).length
                                        : index +
                                        1 -
                                        bookingDetails.filter(
                                            (i, idx) => i.ageGroup === 'ADULT' && idx < index,
                                        ).length;

                                    return (
                                        <Card
                                            title={
                                                isAdult
                                                    ? `Người lớn ${passengerNumber} - ${config.webConfig.getCurrency(
                                                        data.priceAdults,
                                                    )}`
                                                    : `Trẻ em ${passengerNumber} - ${config.webConfig.getCurrency(
                                                        data.priceChildren,
                                                    )}`
                                            }
                                            key={item.id}
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border bg-orange-50 rounded-lg shadow-lg">
                                                <div className="flex flex-col mb-2">
                                                    <label className="font-bold">Họ và tên</label>
                                                    <Input
                                                        placeholder="Nhập họ và tên"
                                                        value={item.fullName}
                                                        onChange={(e) =>
                                                            updateBookingDetail(
                                                                item.id,
                                                                'fullName',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {isAdult && (
                                                    <>
                                                        <div className="flex flex-col mb-2">
                                                            <label className="font-bold">Số điện thoại</label>
                                                            <Input
                                                                placeholder="Nhập số điện thoại"
                                                                value={item.phoneNumber}
                                                                onChange={(e) =>
                                                                    updateBookingDetail(
                                                                        item.id,
                                                                        'phoneNumber',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex flex-col mb-2">
                                                            <label className="font-bold">Email</label>
                                                            <Input
                                                                placeholder="Nhập email"
                                                                value={item.email}
                                                                onChange={(e) =>
                                                                    updateBookingDetail(
                                                                        item.id,
                                                                        'email',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex flex-col mb-2">
                                                    <label className="font-bold">Ngày sinh</label>
                                                    <DatePicker
                                                        placeholder="Nhập ngày sinh"
                                                        onChange={(date, dateString) =>
                                                            updateBookingDetail(
                                                                item.id,
                                                                'birthday',
                                                                dateString,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col mb-2">
                                                    <label className="font-bold">Giới tính</label>
                                                    <Radio.Group
                                                        value={item.gender}
                                                        onChange={(e) =>
                                                            updateBookingDetail(
                                                                item.id,
                                                                'gender',
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        <Radio className="text-sm" value="MALE">
                                                            Nam
                                                        </Radio>
                                                        <Radio className="text-sm" value="FEMALE">
                                                            Nữ
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                            <Divider />
                            <Form.Item label="Ghi chú" name="note">
                                <TextArea
                                    rootClassName="max-h-32"
                                    rows={3}
                                    placeholder="Ghi chú"
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Form.Item>
                            <Divider />
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <FaTags className="text-blue-500 text-lg" />
                                    <a className="font-semibold text-blue-500">Thêm mã giảm giá</a>
                                </div>
                                <Input
                                    placeholder="Nhập mã giảm giá"
                                    allowClear
                                    value={voucher}
                                    onChange={(e) => {
                                        setVoucher(e.target.value);
                                        if (!e.target.value) {
                                            setDiscount(0);
                                            setVoucherValid(false);
                                            setMaxDiscountAmount(0);
                                            setVoucherCode('');
                                            setActualDiscountAmount(0);
                                        }
                                    }}
                                    onBlur={() => applyVoucher(voucher)}
                                />
                                {voucherValid && (
                                    <>
                    <span className="text-green-500 text-sm font-semibold">
                      Voucher hợp lệ! Giảm {discount}% (tối đa {config.webConfig.getCurrency(maxDiscountAmount)}).
                      Số tiền giảm: {config.webConfig.getCurrency(actualDiscountAmount)}
                    </span>
                                    </>
                                )}
                                {!voucherValid && voucher && (
                                    <span className="text-red-500 text-sm font-semibold">
                    Voucher không hợp lệ hoặc không đủ điều kiện!
                  </span>
                                )}
                            </div>
                            <div className="justify-start flex items-center mb-3 mt-4">
                                <Checkbox
                                    rootClassName="text-red-500"
                                    onChange={() => setConfirm(!confirm)}
                                >
                                    Tôi đã đọc và đồng ý với các
                                </Checkbox>
                                <a
                                    onClick={() => setOpen(!open)}
                                    className="text-indigo-500 underline"
                                >
                                    chính sách và điều khoản.
                                </a>
                            </div>
                            <Divider />
                            <div className="text-lg font-semibold text-orange-500 mt-2">
                                Tổng tiền cần thanh toán:{' '}
                                {voucherValid ? (
                                    <>
                                        {config.webConfig.getCurrency(totalPrice)}{' '}
                                        <span className="text-xs text-green-500">
                      (Giảm {config.webConfig.getCurrency(actualDiscountAmount)})
                    </span>
                                    </>
                                ) : (
                                    config.webConfig.getCurrency(totalPrice)
                                )}
                            </div>
                            <span className="text-xs text-red-500 block mt-2">
                * Giá trên đã bao gồm các phụ thu: giá dịch vụ, giá vé máy bay, giá
                khách sạn, giá ăn uống, giá vận chuyển, giá phí tham quan, giá phí
                hướng dẫn viên, giá phí bảo hiểm, giá phí visa, giá phí phục vụ, giá
                phí khác.
              </span>
                            <Form.Item>
                                <Button
                                    disabled={!confirm}
                                    onClick={BookTour}
                                    loading={loadingBook}
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-orange-500 w-full mt-4"
                                >
                                    Xác nhận đặt tour
                                </Button>
                            </Form.Item>
                        </Form>
                        <Modal
                            open={open}
                            footer={null}
                            width={800}
                            onCancel={() => setOpen(!open)}
                            title="Điều khoản và điều kiện"
                        >
                            <Card className="overflow-y-scroll max-h-screen">
                                <ModalTerms />
                            </Card>
                        </Modal>
                    </div>
                </div>

                {/* TourInfoCard for Desktop */}
                <div className="hidden md:block w-full md:w-[500px]">
                    <TourInfoCard
                        detailData={data}
                        children={children}
                        adults={adults}
                        totalPrice={totalPrice}
                        data={tour}
                        voucherValid={voucherValid}
                        discount={discount}
                        hotel={hotel}
                        transport={transport}
                        actualDiscountAmount={actualDiscountAmount} // Truyền thêm prop
                    />
                </div>

                {/* Drawer Trigger Button for Mobile */}
                <div className="md:hidden fixed top-20 right-4 z-50">
                    <Button
                        type="primary"
                        className="bg-orange-500"
                        onClick={() => setDrawerVisible(true)}
                    >
                        Xem tóm tắt chuyến đi
                    </Button>
                </div>

                {/* Drawer for Mobile */}
                <Drawer
                    title="Tóm tắt chuyến đi"
                    placement="right"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width="90%"
                    className="md:hidden"
                >
                    <TourInfoCard
                        detailData={data}
                        children={children}
                        adults={adults}
                        totalPrice={totalPrice}
                        data={tour}
                        voucherValid={voucherValid}
                        discount={discount}
                        hotel={hotel}
                        transport={transport}
                        actualDiscountAmount={actualDiscountAmount} // Truyền thêm prop
                    />
                </Drawer>
            </div>
        </div>
    );
};