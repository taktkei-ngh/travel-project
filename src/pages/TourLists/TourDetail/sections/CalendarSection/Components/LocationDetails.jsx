import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix icon không hiển thị
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component để focus bản đồ vào marker
const MapFocus = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 15); // Zoom to marker when receiving new position
        }
    }, [position, map]);
    return null;
};

export const LocationDetails = () => {
    const [position, setPosition] = useState([10.8562822663519, 106.66939239703213]);
    const [address, setAddress] = useState('114/188/2 Tô Ngọc Vân, Gò Vấp, TP.HCM');
    const [socket, setSocket] = useState(null);

    const fetchCoordinates = async () => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                setPosition([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert('Không tìm thấy vị trí.');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API Nominatim:', error);
        }
    };

    useEffect(() => {
        fetchCoordinates();

        // Kết nối WebSocket
        const ws = new WebSocket('ws://localhost:8080'); // Thay bằng URL server WebSocket của bạn
        setSocket(ws);

        ws.onmessage = (message) => {
            const { lat, lon } = JSON.parse(message.data);
            setPosition([parseFloat(lat), parseFloat(lon)]);
        };

        return () => ws.close(); // Cleanup socket
    }, []);

    return (
        <div className="w-full h-96 mt-8 relative py-10">
            <h2 className="text-2xl font-semibold mb-4">Chi tiết địa điểm</h2>
            {/*<div className="flex items-center gap-4 mb-4">*/}
            {/*    <Input*/}
            {/*        value={address}*/}
            {/*        onChange={(e) => setAddress(e.target.value)}*/}
            {/*        placeholder="Nhập địa chỉ"*/}
            {/*        className="flex-1"*/}
            {/*    />*/}
            {/*    <Button type="primary" onClick={fetchCoordinates}>Tìm vị trí</Button>*/}
            {/*</div>*/}

            <MapContainer className={"z-40"} center={position} zoom={50} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>Vị trí đã chọn: {address}</Popup>
                </Marker>
                <MapFocus position={position} />
            </MapContainer>
        </div>
    );
};