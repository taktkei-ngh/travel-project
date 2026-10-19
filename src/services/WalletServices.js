import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const WalletServices = {
    getBalance: async (params) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.get(config.api.wallet + '/balance', {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return Promise.reject(error);
        }
    },

    getTransactions: async (userId) => {
        try {
            // const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.get(config.api.wallet + '/transactions?userId=' + userId);
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return Promise.reject(error);
        }
    },

    withdrawWallet: async (amount) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.post(config.api.wallet + '/withdraw?amount=' + amount, {}, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error withdrawing money:', error);
            return Promise.reject(error);
        }
    },

    depositWallet: async (amount) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.post(config.api.wallet + `/deposit?amount=${amount}`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error depositing money:', error);
            return Promise.reject(error);
        }
    },

    refund: async (body) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.post(config.api.wallet + '/refund', body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error refunding money:', error);
            return Promise.reject(error);
        }
    },


    approve: async (body) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.post(config.api.wallet + '/approve-refund', body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error approving transaction:', error);
            return Promise.reject(error);
        }
    },

    getRequests: async () => {
        try {
            const response = await axiosConfig.get(config.api.wallet + '/refund-requests');
            return response.data;
        } catch (error) {
            console.error('Error fetching requests:', error);
            return Promise.reject(error);
        }
    },

    getSystemBalance: async () => {
        try {
            const response = await axiosConfig.get(config.api.wallet + '/system-balance');
            return response.data;
        } catch (error) {
            console.error('Error fetching system balance:', error);
            return Promise.reject(error);
        }
    },

    withDrawSystem: async (amount) => {
        try {
            const response = await axiosConfig.post(config.api.wallet + `/withdraw-system?amount=${amount}`);
            return response.data;
        }catch (error) {
            console.error('Error withdrawing system money:', error);
            return Promise.reject(error);
        }
    },

    depositSystem: async (amount) => {
        try {
            const response = await axiosConfig.post(config.api.wallet + `/deposit-system?amount=${amount}`);
            return response.data;
        } catch (error) {
            console.error('Error depositing system money:', error);
            return Promise.reject(error);
        }
    },
};

export default WalletServices;