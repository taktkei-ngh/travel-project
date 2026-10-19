import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const DestinationServices = {
    getAll: async () => {
        try {
            const response = await axiosConfig.get(config.api.destinations + '/all');
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosConfig.get(config.api.destinations + `/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    addDestination: async (params) => {
        try {
            const resp = await axiosConfig.post(config.api.destinations + '/create', params);
            return resp.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    updateDestination: async (id, params) => {
        try {
            const resp = await axiosConfig.put(config.api.destinations + `/update/${id}`, params);
            return resp.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    deleteDestination: async (id) => {
        try {
            const resp = await axiosConfig.delete(config.api.destinations + `/delete/${id}`);
            return resp.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    getTopDestinations: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.get(config.api.destinations + '/top-destinations', {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
}

export default DestinationServices;