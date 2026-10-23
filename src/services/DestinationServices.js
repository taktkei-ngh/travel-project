
import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const DestinationServices = {
    getAll: async () => {
        try {
            const response = await axiosConfig.get(
                `${config.api.destinations}/all`
            );
            return response.data;
        } catch (error) {
            console.error('Không thể tải danh sách điểm đến:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosConfig.get(
                `${config.api.destinations}/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Không thể tải điểm đến:', error);
            throw error;
        }
    },

    addDestination: async (params) => {
        try {
            const response = await axiosConfig.post(
                `${config.api.destinations}/create`,
                params
            );
            return response.data;
        } catch (error) {
            console.error('Không thể tạo điểm đến:', error);
            throw error;
        }
    },

    updateDestination: async (id, params) => {
        try {
            const response = await axiosConfig.put(
                `${config.api.destinations}/update/${id}`,
                params
            );
            return response.data;
        } catch (error) {
            console.error('Không thể cập nhật điểm đến:', error);
            throw error;
        }
    },

    deleteDestination: async (id) => {
        try {
            const response = await axiosConfig.delete(
                `${config.api.destinations}/delete/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Không thể xóa điểm đến:', error);
            throw error;
        }
    },

    getTopDestinations: async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {};

            const response = await axiosConfig.get(
                `${config.api.destinations}/top-destinations`,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Không thể tải điểm đến nổi bật:', error);
            throw error;
        }
    },
};

export default DestinationServices;
