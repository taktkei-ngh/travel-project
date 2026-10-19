import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SupportService from '~/services/SupportService';
import config from '~/config';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Contacts = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            await SupportService.createSupport({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                userEmail: formData.email,
            });
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitStatus(null), 3000);
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error submitting form:', error);
        }
    };

    // Coordinates for the map (example: Ho Chi Minh City, Vietnam)
    const mapCenter = [10.7769, 106.7009]; // Replace with your actual coordinates
    const markerPosition = [10.7769, 106.7009]; // Replace with your actual coordinates

    return (
        <div className="font-sans">
            {/* Contact Information */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('contact.ti1')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: 'fa-map-marker',
                                color: 'text-blue-500',
                                title: t('contact.ti2'),
                                content: t('contact.ti3'),
                            },
                            {
                                icon: 'fa-phone',
                                color: 'text-green-500',
                                title: t('contact.ti4'),
                                content: '+84 1900 1987',
                                link: 'tel://1234567920',
                            },
                            {
                                icon: 'fa-paper-plane',
                                color: 'text-red-500',
                                title: 'Email',
                                content: 'pacific.musketeers.tni@gmail.com',
                                link: 'mailto:fptpoly@fpt.vn.com',
                            },
                            {
                                icon: 'fa-globe',
                                color: 'text-yellow-500',
                                title: 'Website',
                                content: 'https://pacific-vn.vercel.app/',
                                link: '#',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white shadow-xl rounded-lg transform hover:scale-105 transition duration-300"
                            >
                                <div className={`text-5xl ${item.color} mb-3`}>
                                    <i className={`fa ${item.icon}`}></i>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                {item.link ? (
                                    <p>
                                        <a href={item.link} className="text-blue-600 hover:underline">
                                            {item.content}
                                        </a>
                                    </p>
                                ) : (
                                    <p>{item.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form and Map */}
            <section className="py-16">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 shadow-xl rounded-lg">
                        <h3 className="text-2xl font-bold mb-6">{t('contact.ti5')}</h3>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder={t('contact.ti6')}
                                className="w-full p-4 border rounded mb-4 focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('contact.ti7')}
                                className="w-full p-4 border rounded mb-4 focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder={t('contact.ti8')}
                                className="w-full p-4 border rounded mb-4 focus:ring-2 focus:ring-blue-400"
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t('contact.ti9')}
                                className="w-full p-4 border rounded mb-4 focus:ring-2 focus:ring-blue-400"
                                rows="4"
                            ></textarea>
                            <button
                                onClick={handleSubmit}
                                disabled={submitStatus === 'loading'}
                                className={`bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ${
                                    submitStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {submitStatus === 'loading' ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                            {submitStatus === 'success' && (
                                <p className="text-green-500 mt-2">Gửi yêu cầu thành công!</p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="text-red-500 mt-2">Có lỗi xảy ra, vui lòng thử lại!</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-8 shadow-xl rounded-lg">
                        {/* Interactive Map */}
                        <MapContainer
                            center={mapCenter}
                            zoom={15}
                            style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex:0 }}
                            className="rounded-lg"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={markerPosition}>
                                <Popup>{t('contact.ti3')}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contacts;