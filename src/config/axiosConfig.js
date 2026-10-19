import axios from 'axios';
import i18next from 'i18next';
import config from './index';

const axiosInstance = axios.create({
	baseURL: config.api.base,
	timeout: 60000,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.response.use(
	response => response,
	error => {
		console.error('Error:', error);
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.request.use(
	(config) => {
		console.log('Request:', config);
		return config;
	},
	(error) => {
		console.error('Error:', error);
		return Promise.reject(error);
	},
);

// Interceptor để gán "Accept-Language" vào mọi request
axiosInstance.interceptors.request.use((config) => {
	config.headers['Accept-Language'] = i18next.language || 'vi';
	return config;
});

export default axiosInstance;

