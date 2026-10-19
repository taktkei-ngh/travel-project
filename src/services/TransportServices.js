import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const handleError = (error, context) => {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định";
    console.error(`[TransportServices] ${context} error:`, errorMessage);
    throw new Error(errorMessage);
};

const validateTransportData = (data) => {
    if (!data) throw new Error("Dữ liệu phương tiện không được để trống");
    if (!data.name || typeof data.name !== 'string') throw new Error("Tên phương tiện không hợp lệ");
    if (typeof data.cost !== 'number' || isNaN(data.cost)) throw new Error("Chi phí phải là số hợp lệ");
    if (!data.typeTransport || typeof data.typeTransport !== 'string') throw new Error("Loại phương tiện không hợp lệ");
    if (typeof data.active !== 'boolean') throw new Error("Trạng thái không hợp lệ");
};

const TransportServices = {
    getTransports: async () => {
        try {
            const response = await axiosConfig.get(`${config.api.transport}/all`);
            return response.data || [];
        } catch (error) {
            handleError(error, "Lấy danh sách phương tiện");
        }
    },

    getTransportById: async (id) => {
        try{
            const resp = await axiosConfig.get(config.api.transport + `/${id}` );
            return resp.data;
        }catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    },
    addTransport: async (body) => {
        try {
            const response = await axiosConfig.post(config.api.transport + '/add', body,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            handleError(error, "Thêm phương tiện");
        }
    },

    updateTransport: async (id, transportData) => {
        try {
            const response = await axiosConfig.put(`${config.api.transport}/update/${id}`, transportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            handleError(error, "Cập nhật phương tiện");
        }
    },

    uploadTransportImage: async (id, imageFile) => {
        try {
            if (!id || typeof id !== 'string') throw new Error("ID phương tiện không hợp lệ");
            if (!imageFile || !(imageFile instanceof File)) throw new Error("File ảnh không hợp lệ");

            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await axiosConfig.post(
                `${config.api.transport}/addTransportImages/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data?.imageUrl || response.data?.url || response.data;
        } catch (error) {
            handleError(error, "Tải lên ảnh phương tiện");
        }
    },

    updateTransportStatus: async (id) => {
        try {
            if (!id || typeof id !== 'string') throw new Error("ID phương tiện không hợp lệ");
            const response = await axiosConfig.put(`${config.api.transport}/updateStatus/${id}`);
            return response.data;
        } catch (error) {
            handleError(error, "Cập nhật trạng thái phương tiện");
        }
    },

    deleteTransport: async (id) => {
        try {
            if (!id || typeof id !== 'string') throw new Error("ID phương tiện không hợp lệ");
            const response = await axiosConfig.delete(`${config.api.transport}/delete/${id}`);
            return response.data;
        } catch (error) {
            handleError(error, "Xóa phương tiện");
        }
    },
};

export default TransportServices;