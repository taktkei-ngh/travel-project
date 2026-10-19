import axiosConfig from '~/config/axiosConfig';

const AiServices = {
	askAi: async (query) => {
		try {
			const token = localStorage.getItem('accessToken');
			const redirectTo = window.location.origin;
			const response = await axiosConfig.post('/api/ai-query', { query }, {
				params: {
					redirectTo: redirectTo,
				},
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			return response.data;
		} catch (err) {
			console.error(err);
			return Promise.reject(err);
		}
	},
};

export default AiServices;