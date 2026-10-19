import sha256 from 'crypto-js/sha256';
import config from '~/config';
import axiosConfig from '~/config/axiosConfig';

const BookingServices = {
	checkOut: async (params, token) => {
		try {
			const token = localStorage.getItem('accessToken');
			const redirectTo = window.location.origin;
			const response = await axiosConfig.get(config.api.booking + '/checkout', {
				params: {
					...params,
					redirectTo: redirectTo,
				},
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
	returnCheckout: async () => {
		try {
			const response = await axiosConfig.get(config.api.booking + `/vnpay-payment-return`);
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

//     NGHIEP VU BOOK TOUR
	getInfoMonth: async (id) => {
		try {
			const resp = await axiosConfig.get(config.api.tourDetail + `/month/${id}`);
			return resp.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	getInfoDay: async (params) => {
		try {
			const resp = await axiosConfig.get(config.api.tourDetail + '/day', { params });
			return resp.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	bookTourByTourDetailId: async (id, body) => {
		try {
			const token = localStorage.getItem('accessToken');
			const timestamp = new Date().getTime();
			const dataToHash = JSON.stringify({ ...body, timestamp });
			const idempotencyKey = sha256(dataToHash).toString();
			const resp = await axiosConfig.post(config.api.booking + `/tour/${id}`,
				body,
				{
					headers: {
						'Authorization': 'Bearer ' + token,
						'Content-Type': 'application/json',
						'X-Idempotency-Key': idempotencyKey,
					},
				},
			);
			return resp.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},
	// getBookingByUser: async (token) => {
	//     try{
	//         const response = await axiosConfig.get(config.api.booking + '/book/user', {
	//             headers: {
	//                 'Authorization': 'Bearer ' + token,
	//             },
	//         });
	//         return response.data;
	//     }catch (error) {
	//         console.error('Error:', error);
	//         return Promise.reject(error);
	//     }
	// },
	getBookingList: async (token) => {
		try {
			const response = await axiosConfig.get(config.api.booking + '/book/user', {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	cancelBooking: async (id, body) => {
		const token = localStorage.getItem('accessToken');
		try {
			const response = await axiosConfig.post(config.api.booking + `/cancel/${id}`, body, {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	cancelBookingAd: async (id, body) => {
		const token = localStorage.getItem('accessToken');
		try {
			const response = await axiosConfig.post(config.api.booking + `/ad/cancel/${id}`, body, {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	getAll: async () => {
		const token = localStorage.getItem('accessToken');
		try {
			const response = await axiosConfig.get(config.api.booking + '/all', {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	getAllByStatus: async (status) => {
		try {
			const response = await axiosConfig.get(config.api.booking + `/status?status=${status}`);
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

	getBookingByBookingId: async (id) => {
		try {
			const response = await axiosConfig.get(config.api.booking + `/book/${id}`);
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			return Promise.reject(error);
		}
	},

};

export default BookingServices;