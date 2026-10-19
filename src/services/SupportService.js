import config from '~/config';
import axiosConfig from '~/config/axiosConfig';

const API_BASE = config.api.adminSupport;

const SupportService = {
    getAllSupports: async () => {
        try {
            const { data } = await axiosConfig.get(`${API_BASE}/all`);
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng cần hỗ trợ:', error);
            throw error.response?.data || error.message;
        }
    },


    updateSupportStatus: async (id, status) => {
        try {
            console.log("Gửi yêu cầu cập nhật trạng thái với ID:", id, "và trạng thái:", status);
            const { data } = await axiosConfig.patch(`${API_BASE}/updateStatus/${id}`, { status });
            console.log("Kết quả trả về từ API cập nhật trạng thái:", data);
            return data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái support ID ${id}:`, error);
            throw error.response?.data || error.message;
        }
    },


    sendMail: async (name, email, subject, message, status = 'pending') => {
        try {
            const payload = { name, email, subject, message, status };
            const { data } = await axiosConfig.post(`${API_BASE}/send-mail`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            return data;
        } catch (error) {
            console.error("Lỗi khi gửi mail:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },

    createSupport: async ({ name, email, subject, message }) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const payload = {
                name,
                email,
                subject,
                message,
                userEmail: user?.email || email,
                status: "pending"
            };
            console.log("Payload gửi lên:", payload);

            const { data } = await axiosConfig.post(`${API_BASE}/create`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            return data;
        } catch (error) {
            console.error("Lỗi khi tạo yêu cầu hỗ trợ:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },

    // Phản hồi của Admin
    respondToSupport: async (data) => {
        try {
            const { id, ...payload } = data;
            const { data: response } = await axiosConfig.put(`${API_BASE}/${id}/response`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            return response;
        } catch (error) {
            console.error("Lỗi khi phản hồi support:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }
};

export default SupportService;
