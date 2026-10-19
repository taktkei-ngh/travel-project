import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const RatingServices = {
    addRating: async (body) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.post(config.api.rating + '/add',
                body,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
};

export default RatingServices;