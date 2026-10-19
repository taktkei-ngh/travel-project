const getCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        } else {
            console.error('Không tìm thấy tọa độ cho địa chỉ này.');
        }
    } catch (error) {
        console.error('Lỗi khi gọi Nominatim API:', error);
    }
};

export default getCoordinates;