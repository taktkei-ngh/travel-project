import AxiosConfig from '~/config/axiosConfig';
import config from '~/config';

const WishlistServices = {
    AddToWishlist: async (id, token) => {
        try {
            const resp = await AxiosConfig.post(config.api.wishlist + `/add/${id}`, {} ,  {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            return resp.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    getWishlist: async (token) => {
        try {
            const resp = await AxiosConfig.get(config.api.wishlist + `/all`,{
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            return resp.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    removeWishlist: async (id, token) => {
        try {
            const resp = await AxiosConfig.delete(config.api.wishlist + `/delete/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            return resp.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
};
export default WishlistServices;