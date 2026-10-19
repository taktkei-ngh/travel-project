import config from '~/config';
import axiosConfig from '~/config/axiosConfig';

const UserServices = {
    register : async (username, password, firstName, lastName, email) => {
        try{
            const response = await axiosConfig.post(config.api.user + '/register', {
                username,
                password,
                firstName,
                lastName,
                email,
            });
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    login: async (username, password) => {
        try{
            const response = await axiosConfig.post(config.api.user + '/login', {
                username,
                password,
            });
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    sendVerifyEmail : async (email) => {
        try{
            const response = await axiosConfig.post(config.api.user + `/send-reset-password-mail?email=${email}`, {} , {
                timeout : 5000,
            })
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    verifyEmail : async (email,otp) => {
        try{
            const response = await axiosConfig.post(config.api.user + '/verify-reset-password', {
                email,
                otp,
            });
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    resetPassword : async (email,newPassword,confirmPaswword) => {
        try{
            const response = await axiosConfig.post(config.api.user + '/reset-password', {
                email,
                newPassword,
                confirmPaswword,
            });
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    getAllUsers : async () => {
        try{
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.get(config.api.user + '/all', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }});
            return response.data;
        }catch (error){
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },


    updateUser: async (body) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosConfig.post(config.api.user + `/update-profile`, body, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật user:', error);
            return Promise.reject(error);
        }
    },


    // Cập nhật trạng thái (active/inactive)
    updateUserStatus: async (id, status) => {
        try {
            const response = await axiosConfig.patch(config.api.user + `/updateStatus/${id}`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating user status:', error);
            return Promise.reject(error);
        }
    },

    getCountUsers: async () => {
        try{
            const response = await axiosConfig.get(config.api.user + '/count/users');
            return response.data;
        }catch (err){
            console.error('Error:', err);
            return Promise.reject(err);
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosConfig.get(config.api.user + `/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    },

    getTopBookedUsers: async (limit) => {
        try {
            const response = await axiosConfig.get(config.api.user + `/top-booked-users?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    }
}

export default UserServices;
