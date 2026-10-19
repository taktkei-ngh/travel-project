import AxiosConfig from '~/config/axiosConfig';
import config from '~/config';

const CategoryServices = {
    getCategories: async () => {
        try {
            const resp = await AxiosConfig.get(config.api.category + '/all');
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },
    createCategories: async (data) => {
        try {
            const resp = await AxiosConfig.post(config.api.category + '/create', data);
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },

    updateCategories: async (id,data) => {
        try {
            const resp = await AxiosConfig.put(config.api.category + `/update/${id}`, data);
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },

    deleteCategories: async (id) => {
        try {
            const resp = await AxiosConfig.delete(config.api.category + `/delete/${id}`);
            return resp.data;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }
};

export default CategoryServices;