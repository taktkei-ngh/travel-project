import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const BlogServices = {
    getAllBlogs: async () => {
        try {
            const response = await axiosConfig.get(config.api.blog + '/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            return Promise.reject(error);
        }
    },
    createBlog: async (body) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axiosConfig.post(config.api.blog + '/create', body, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token,
                },
            });
        } catch (error) {
            console.error('Error creating blog:', error);
            return Promise.reject(error);
        }
    },
    getBlogCategories: async () => {
        try {
            const response = await axiosConfig.get(config.api.blog + '/category/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching blog categories:', error);
            return Promise.reject(error);
        }
    },

    getBySlug: async (slug) => {
        try {
            const response = await axiosConfig.get(config.api.blog + `/slug?slug=` + slug);
            return response.data;
        } catch (error) {
            console.error('Error fetching blog by slug:', error);
            return Promise.reject(error);
        }
    },

    updateBlog: async (id, body) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axiosConfig.put(config.api.blog + `/update/${id}`, body, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating blog:', error);
            return Promise.reject(error);
        }
    },

    deleteBlog: async (id) => {
        try {
            const response = await axiosConfig.delete(config.api.blog + `/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting blog:', error);
            return Promise.reject(error);
        }
    },

    subscribeBlog: async (email, name) => {
        try {
            const response = await axiosConfig.post(config.api.blog + `/subscribe?email=${email}&name=${name}`);
            return response.data;
        } catch (error) {
            console.error('Error subscribing to blog:', error);
            return Promise.reject(error);
        }
    },

    createCategory: async (body) => {
        try {
            const response = await axiosConfig.post(config.api.blog + '/category/add', body);
            return response.data;
        } catch (error) {
            console.error('Error creating blog category:', error);
            return Promise.reject(error);
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await axiosConfig.delete(config.api.blog + `/category/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting blog category:', error);
            return Promise.reject(error);
        }
    },

    updateCategory: async (id, body) => {
        try {
            const response = await axiosConfig.post(config.api.blog + `/category/update/${id}`, body);
            return response.data;
        } catch (error) {
            console.error('Error updating blog category:', error);
            return Promise.reject(error);
        }
    },

};

export default BlogServices;