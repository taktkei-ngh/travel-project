import AxiosConfig from '~/config/axiosConfig';
import config from '~/config';

const TourDetailServices = {
    getTourDetail: async () => {
        try{
            const response = await AxiosConfig.get(config.api.tourDetail + '/all');
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
    getTourDetailById: async (id) => {
        try{
            const response = await AxiosConfig.get(config.api.tourDetail + `/${id}`);
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
    getTourDetailByTourId: async (tourId) => {
        try{
            const response = await AxiosConfig.get(config.api.tourDetail + `/tour/${tourId}`);
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
    addTourDetail: async (params) => {
        try{
            const resp = await AxiosConfig.post(config.api.tourDetail + '/add', params);
            return resp.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
    updateTourDetail: async (id, body) => {
        try{
            const response = await AxiosConfig.post(config.api.tourDetail + `/update/${id}`, body);
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
}

export default TourDetailServices;