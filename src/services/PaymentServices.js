import AxiosConfig from '~/config/axiosConfig';
import config from '~/config';

const PaymentServices = {
    getHistoryPayments: async (token) => {
        try{
            const resp = await AxiosConfig.get(config.api.payment + '/all', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            return resp.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },
}

export default PaymentServices;