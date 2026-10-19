import axiosConfig from '~/config/axiosConfig';
import config from '~/config';

const ImageServices = {
    getImageById: async (imageId) => {
        try {
            const response = await axiosConfig.get(config.api.imageAPI + imageId);
            console.log(`Response for imageId ${imageId}:`, response.data); // Debug
            return response.data.ImageUrl || '/img/a.gif'; // Adjust field name as needed
        } catch (error) {
            console.error(`Error fetching image with ID ${imageId}:`, error);
            return '/img/a.gif';
        }
    },
};

export default ImageServices;