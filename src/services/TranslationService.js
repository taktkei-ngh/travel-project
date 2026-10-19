import axiosInstance from '~/config/axiosConfig';

const fetchTranslations = async (lang) => {
    try {
        const response = await axiosInstance.get("/api/translator", { params: { lang } });
        return response.data; // Dữ liệu từ BE
    } catch (error) {
        console.error("Error fetching translations:", error);
        return {};
    }
};

export default fetchTranslations;
