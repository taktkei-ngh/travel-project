import config from '~/config';
import AxiosConfig from '~/config/axiosConfig';

const GuideServices = {
    getAllGuides: async () => {
        try {
            const { data } = await AxiosConfig.get(config.api.guide + '/all');
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    createGuide: async (guideData) => {
        try {
            const { data } = await AxiosConfig.post(config.api.guide + '/create', guideData);
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // getTourGuideById: async (id) => {
    //     try {
    //         const { data } = await axiosConfig.get(`${API_BASE}/guideTour/${id}`);
    //         return data;
    //     } catch (error) {
    //         return handleError(error);
    //     }
    // },

    updateGuide: async (id, userData) => {
        try {
            const { data } = await AxiosConfig.put(config.api.guide + `/update/${id}`, userData);
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    updateGuideStatus: async (id, status) => {
        try {
            const { data } = await AxiosConfig.patch(config.api.guide + `/updateStatus/${id}?active=${status}`);
            return data;
        } catch (error) {
            return handleError(error);
        }
    },
};

    // Hàm xử lý lỗi chung để tránh trùng lặp
    const handleError = (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
};

export default GuideServices;
