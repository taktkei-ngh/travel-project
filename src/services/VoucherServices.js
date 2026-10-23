import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const API_BASE = config.api.adminVoucher;

const getHeaders = () => {
    const token = localStorage.getItem('accessToken');

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

const VoucherServices = {
    getAllVouchers: async () => {
        const response = await axiosConfig.get(`${API_BASE}/all`, {
            headers: getHeaders(),
        });
        return response.data;
    },

    getVoucherByCode: async (codeVoucher) => {
        const response = await axiosConfig.get(`${API_BASE}/by-code`, {
            params: { codeVoucher },
        });
        return response.data;
    },

    updateVoucher: async (id, voucherData) => {
        const response = await axiosConfig.put(
            `${API_BASE}/update/${id}`,
            voucherData,
            { headers: getHeaders() }
        );
        return response.data;
    },

    updateVoucherStatus: async (id, status) => {
        const response = await axiosConfig.patch(
            `${API_BASE}/updateStatus/${id}`,
            null,
            {
                params: { status },
                headers: getHeaders(),
            }
        );
        return response.data;
    },

    addVoucher: async (body) => {
        const response = await axiosConfig.post(
            `${API_BASE}/create`,
            body,
            { headers: getHeaders() }
        );
        return response.data;
    },

    deleteVoucher: async (id, active) => {
        const response = await axiosConfig.delete(
            `${API_BASE}/delete/${id}`,
            {
                params: { active },
                headers: getHeaders(),
            }
        );
        return response.data;
    },

    deleteVoucherForce: async (id) => {
        const response = await axiosConfig.delete(
            `${API_BASE}/delete-force/${id}`,
            { headers: getHeaders() }
        );
        return response.data;
    },

    checkVoucher: async (params) => {
        const response = await axiosConfig.get(
            `${API_BASE}/check-voucher`,
            {
                params,
                headers: getHeaders(),
            }
        );
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosConfig.get(`${API_BASE}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },

    getVoucher: async (codeVoucher) => {
        const response = await axiosConfig.get(
            `${API_BASE}/codeVoucher`,
            {
                params: { codeVoucher },
                headers: getHeaders(),
            }
        );
        return response.data;
    },

    getVouchersByIds: async (ids) => {
        const response = await axiosConfig.post(
            `${API_BASE}/all/ids`,
            ids,
            { headers: getHeaders() }
        );
        return response.data;
    },
};

export default VoucherServices;
