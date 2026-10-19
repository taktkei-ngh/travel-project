import config from '~/config';
import axiosConfig from '~/config/axiosConfig';

const WebServices = {
    getProvinces: async () => {
        try {
            const response = await axiosConfig.get(config.api.provinces);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    }
}
export default WebServices;
