import config from '~/config';
import axiosConfig from '~/config/axiosConfig';

const API_BASE = config.api.adminRating;

const RatingService = {
    getAllRatings: async () => {
        try {
            const { data } = await axiosConfig.get(`${API_BASE}/getall`);
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    getRatingsByTourId: async (tourId) => {
        try {
            const { data } = await axiosConfig.get(`${API_BASE}/tour/${tourId}`); // Corrected URL
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    updateRatingStatus: async (id, status) => {
        try {
            console.log(`Updating status: ${status} for ID: ${id}`);
            const response = await axiosConfig.patch(`${API_BASE}/updateStatus/${id}?status=${status}`);
            console.log("Response data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating status:", error.response?.data || error.message);
            return handleError(error);
        }
    },


    deleteRating: async (id) => {
        try {
            await axiosConfig.delete(`${API_BASE}/delete/${id}`);
            return true;
        } catch (error) {
            return handleError(error);
        }
    },


};


const handleError = (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
};


export default RatingService;