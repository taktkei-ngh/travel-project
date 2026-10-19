import config from '~/config/index';

const imageConfig = {
    getImage: (imageId) => {
            if (!imageId) return "";

    if (imageId.startsWith("http") || imageId.startsWith("https")) {
        return imageId;
    }

    return `${config.api.base}/api/image?id=${encodeURIComponent(imageId)}`;
    },
    getAvatar: (imageId) => {
        return `https://lh3.googleusercontent.com/a/${imageId}`;
    },
};

export default imageConfig;