import sha256 from 'crypto-js/sha256';
import config from '~/config';
import axiosConfig from '~/config/axiosConfig';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

const BookingServices = {
    checkOut: async (params) => {
        try {
            const redirectTo = window.location.origin;

            const response = await axiosConfig.get(
                `${config.api.booking}/checkout`,
                {
                    params: {
                        ...params,
                        redirectTo,
                    },
                    headers: getAuthHeaders(),
                }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể khởi tạo thanh toán:', error);
            throw error;
        }
    },

    returnCheckout: async () => {
        try {
            const response = await axiosConfig.get(
                `${config.api.booking}/vnpay-payment-return`
            );

            return response.data;
        } catch (error) {
            console.error('Không thể nhận kết quả thanh toán:', error);
            throw error;
        }
    },

    // Lấy các tháng có lịch khởi hành của tour.
    getInfoMonth: async (id) => {
        try {
            const response = await axiosConfig.get(
                `${config.api.tourDetail}/month/${id}`
            );

            return response.data;
        } catch (error) {
            console.error('Không thể tải tháng khởi hành:', error);
            throw error;
        }
    },

    // Lấy các ngày khởi hành trong tháng.
    getInfoDay: async (params) => {
        try {
            const response = await axiosConfig.get(
                `${config.api.tourDetail}/day`,
                { params }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể tải ngày khởi hành:', error);
            throw error;
        }
    },

    // Đặt tour theo ID chi tiết lịch khởi hành.
    bookTourByTourDetailId: async (id, body) => {
        try {
            const token = localStorage.getItem('accessToken');
            const timestamp = Date.now();

            const dataToHash = JSON.stringify({
                ...body,
                timestamp,
            });

            const idempotencyKey = sha256(dataToHash).toString();

            const response = await axiosConfig.post(
                `${config.api.booking}/tour/${id}`,
                body,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json',
                        'X-Idempotency-Key': idempotencyKey,
                        ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể đặt tour:', error);
            throw error;
        }
    },

    getBookingList: async (token) => {
        try {
            const authToken =
                token || localStorage.getItem('accessToken');

            const response = await axiosConfig.get(
                `${config.api.booking}/book/user`,
                {
                    headers: authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {},
                }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể tải danh sách booking:', error);
            throw error;
        }
    },

    cancelBooking: async (id, body) => {
        try {
            const response = await axiosConfig.post(
                `${config.api.booking}/cancel/${id}`,
                body,
                { headers: getAuthHeaders() }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể hủy booking:', error);
            throw error;
        }
    },

    cancelBookingAd: async (id, body) => {
        try {
            const response = await axiosConfig.post(
                `${config.api.booking}/ad/cancel/${id}`,
                body,
                { headers: getAuthHeaders() }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể hủy booking quản trị:', error);
            throw error;
        }
    },

    getAll: async () => {
        try {
            const response = await axiosConfig.get(
                `${config.api.booking}/all`,
                { headers: getAuthHeaders() }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể tải tất cả booking:', error);
            throw error;
        }
    },

    getAllByStatus: async (status) => {
        try {
            const response = await axiosConfig.get(
                `${config.api.booking}/status`,
                {
                    params: { status },
                    headers: getAuthHeaders(),
                }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể lọc booking theo trạng thái:', error);
            throw error;
        }
    },

    getBookingByBookingId: async (id) => {
        try {
            const response = await axiosConfig.get(
                `${config.api.booking}/book/${id}`,
                { headers: getAuthHeaders() }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể tải chi tiết booking:', error);
            throw error;
        }
    },
};

export default BookingServices;
