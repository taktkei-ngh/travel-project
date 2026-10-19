import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const handleError = (error, context) => {
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
    console.error(`[HotelServices] ${context} error:`, errorMessage);
    throw new Error(errorMessage);
};

const validateHotelData = (data) => {
    if (!data) throw new Error('Dữ liệu khách sạn không được để trống');
    if (!data.name || typeof data.name !== 'string') throw new Error('Tên khách sạn không hợp lệ');
    if (typeof data.cost !== 'number' || isNaN(data.cost)) throw new Error('Chi phí phải là số hợp lệ');
    if (!data.typeHotel || typeof data.typeHotel !== 'string') throw new Error('Loại khách sạn không hợp lệ');
    if (typeof data.rating !== 'number' || isNaN(data.rating) || data.rating < 1 || data.rating > 5) {
        throw new Error('Đánh giá phải từ 1-5 sao');
    }
};

const validateHotelId = (id) => {
    if (!id || typeof id !== 'string') throw new Error('ID khách sạn không hợp lệ');
};

const validateImageFile = (file) => {
    if (!file || !(file instanceof File)) throw new Error('File ảnh không hợp lệ');
};

const HotelServices = {
    getAllHotels: async () => {
        try {
            const response = await axiosConfig.get(config.api.hotel + '/all');
            return response.data;
        } catch (error) {
            handleError(error, 'Lấy danh sách khách sạn');
        }
    },

    getHotelById: async (id) => {
        try {
            validateHotelId(id);
            const response = await axiosConfig.get(`${config.api.hotel}/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            handleError(error, 'Lấy thông tin khách sạn');
        }
    },

    createHotel: async (body) => {
        try {
            const response = await axiosConfig.post(config.api.hotel + '/add', body, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            handleError(error, 'Thêm khách sạn');
        }
    },

    createHotelWithImage: async (hotelData, imageFile) => {
        try {
            validateHotelData(hotelData);
            validateImageFile(imageFile);

            const formData = new FormData();
            formData.append('request', JSON.stringify(hotelData));
            formData.append('image', imageFile);

            const response = await axiosConfig.post(
                `${config.api.hotel}/add-with-image`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            return response.data?.data || response.data;
        } catch (error) {
            handleError(error, 'Thêm khách sạn với ảnh');
        }
    },

    updateHotel: async (id, body) => {
        try {
            const response = await axiosConfig.post(config.api.hotel + `/update/${id}`, body, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            handleError(error, 'Cập nhật thông tin khách sạn');
        }
    },

    updateHotelImage: async (id, imageFile) => {
        try {
            validateHotelId(id);
            validateImageFile(imageFile);

            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axiosConfig.put(
                `${config.api.hotel}/update-image/${id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            return response.data?.data || response.data;
        } catch (error) {
            handleError(error, 'Cập nhật ảnh khách sạn');
        }
    },

    searchHotels: async (name, minPrice, maxPrice, typeHotel) => {
        try {
            const params = {
                name: name || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                typeHotel: typeHotel || undefined,
            };

            const response = await axiosConfig.get(`${config.api.hotel}/search`, { params });
            return response.data?.data || response.data || [];
        } catch (error) {
            handleError(error, 'Tìm kiếm khách sạn');
        }
    },

    deleteHotel: async (id) => {
        try {
            validateHotelId(id);
            const response = await axiosConfig.delete(`${config.api.hotel}/delete/${id}`);
            return response.data;
        } catch (error) {
            handleError(error, 'Xóa khách sạn');
        }
    },
};

export default HotelServices;