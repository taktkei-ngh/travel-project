import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const API_BASE = config.api.adminVoucher;

const VoucherServices = {
	getAllVouchers: async () => {
		try {
			const response = await axiosConfig.get(`${API_BASE}/all`);
			return response.data;
		} catch (error) {
			console.error('Lỗi khi lấy danh sách voucher:', error);
			return Promise.reject(error);
		}
	},

	getVoucherByCode: async (codeVoucher) => {
		try {
			const response = await axiosConfig.get(`${API_BASE}/by-code`, {
				params: { codeVoucher },  // Sử dụng query param thay vì path param
			});
			return response.data;
		} catch (error) {
			console.error(`Lỗi khi lấy voucher với code: ${codeVoucher}`, error);
			return Promise.reject(error);
		}
	},

	updateVoucher: async (id, voucherData) => {
		try {
			const response = await axiosConfig.put(config.api.adminVoucher + `/update/` + id, voucherData);
			return response.data;
		} catch (error) {
			console.error(`Lỗi khi cập nhật voucher:`, error.response?.data || error.message);
			return Promise.reject(error);
		}
	},


	updateVoucherStatus: async (id, status) => {
		try {
			const response = await axiosConfig.patch(config.api.adminVoucher + `/updateStatus/${id}?status=${status}`);
			return response.data;
		} catch (error) {
			console.error(`Lỗi khi cập nhật trạng thái voucher ID ${id}:`, error);
			return Promise.reject(error);
		}
	},

	addVoucher: async (body) => {
		try {
			const response = await axiosConfig.post(config.api.adminVoucher + '/create', body);
			return response.data;
		} catch (error) {
			console.error('Lỗi khi thêm voucher:', error);
			return Promise.reject(error);
		}
	},

	deleteVoucher: async (id, active) => {
		try {
			const response = await axiosConfig.delete(config.api.adminVoucher + `/delete/${id}`, {
				params: { active }, // Gửi active như một query parameter
			});
			return response.data;
		} catch (error) {
			console.error(`Lỗi khi xóa voucher ID ${id}:`, error);
			return Promise.reject(error);
		}
	},

	deleteVoucherForce: async (id) => {
		try {
			const response = await axiosConfig.delete(config.api.adminVoucher + `/delete-force/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Lỗi khi xóa voucher ID ${id}:`, error);
			return Promise.reject(error);
		}
	},

	checkVoucher: async (params) => {
		try {
			const token = localStorage.getItem('accessToken');
			const response = await axiosConfig.get(`${API_BASE}/check-voucher`, {
				params,
				headers: {
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			});
			return response.data;
		} catch (error) {
			console.error('Lỗi khi kiểm tra voucher:', error);
			return Promise.reject(error);
		}
	},

	getById: async (id) => {
		try {
			const response = await axiosConfig.get(`${API_BASE}/${id}`);
			return response.data;
		} catch (err) {
			console.error('Lỗi khi lấy voucher theo ID:', err);
			return Promise.reject(err);
		}
	},

	getVoucher: async (codeVoucher) => {
		try {
			const token = localStorage.getItem('accessToken');
			const response = await axiosConfig.get(`${API_BASE}/codeVoucher`, {
				params: { codeVoucher },
				headers: {
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			});
			return response.data;
		} catch (error) {
			console.error('Lỗi khi lấy voucher:', error);
			return Promise.reject(error);
		}
	},

	getVouchersByIds: async (ids) => {
		try {
			const response = await axiosConfig.post(`${API_BASE}/all/ids`, ids);
			return response.data;
		} catch (error) {
			console.error('Lỗi khi lấy voucher:', error);
			return Promise.reject(error);
		}
	},
};

export default VoucherServices;
