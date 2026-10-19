import AxiosConfig from '~/config/axiosConfig';
import config from '~/config';

const AdminServices = {
// ADMIN HOMEPAGE REVENUE
    getBookingRevenue: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/revenue', { params });
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getBookingRevenueMonthByYear: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/revenue/month', { params });
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },

    getBookingRevenuesByYear: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/revenue/year', { params });
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },

//     GUIDE MANAGEMENT
    getGuides: async () => {
        try {
            const resp = await AxiosConfig.get(config.api.guide + '/all');
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },
    getGuideById: async (id) => {
        try {
            const resp = await AxiosConfig.get(config.api.guide + `/${id}`);
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getBookingCount: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/bookingCount', { params });
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getBookingStatusStats: async () => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/booking-status-stats');
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getRevenueStats: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/stats', {params});
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },

    getReviewStats: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/review-stats', { params });
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getDetailReviewStats: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/review-detail-stats', { params });
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getTopBookedTours: async (params) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/top-booked', { params });
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },

    getBookingYearlyStats: async () => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/revenue-booking/yearly');
            return resp.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    },


//     EXPORT
    getExport: async (params, onProgress) => {
        try {
            const resp = await AxiosConfig.get(config.api.report + '/export-excel', {
                params, // Đảm bảo params được gửi đúng
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
                onDownloadProgress: onProgress, // Truyền callback để cập nhật tiến trình
            });
            return resp; // Trả về toàn bộ response (bao gồm data và headers)
        } catch (err) {
            console.error('Lỗi khi gọi API export:', err);
            return Promise.reject(err);
        }
    },
};

export default AdminServices;