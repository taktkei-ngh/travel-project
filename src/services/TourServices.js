import axiosConfig from '~/config/axiosConfig';
import AxiosConfig from '~/config/axiosConfig';
import config from '~/config';

const TourServices = {
	getAllTour: async (params) => {
		try {
			const response = await axiosConfig.get(config.api.tours + '/all', {
				params: {
					title: params.title || null,
					minPrice: params.minPrice || null,
					maxPrice: params.maxPrice || null,
					categoryId: params.categoryId || null,
					startDate: params.startDate || null,
					endDate: params.endDate || null,
					region: params.region || null,
				},
				timeout: 60000,
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
	getById: async (id) => {
		try {
			const response = await axiosConfig.get(config.api.tours + `/${id}`);
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
	AddTour: async (params) => {
		try {
			const resp = await AxiosConfig.post(config.api.tours + '/add', params, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				timeout: 60000,
			});
			return resp.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
	HideTour: async (id, active) => {
		try {
			const resp = await AxiosConfig.post(config.api.tours + `/delete/${id}?active=${active}`);
			return resp.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
	getTourByTourDetailId: async (id) => {
		try {
			const response = await axiosConfig.get(config.api.tours + `/tour-detail/${id}`);
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	updateTour: async (id, data) => {
		try {
			const response = await axiosConfig.post(config.api.tours + `/update/${id}`, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				timeout: 60000,
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	getToursByTourDetailIds: async (ids) => {
		try {
			const response = await axiosConfig.post(config.api.tours + `/tour-detail/ids`, ids);
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
};
export default TourServices;