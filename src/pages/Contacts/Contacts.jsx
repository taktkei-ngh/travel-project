
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, notification } from 'antd';
import {
    FaEnvelope,
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaPaperPlane,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import SupportService from '~/services/SupportService';

const { TextArea } = Input;

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.subject.trim() ||
            !formData.message.trim()
        ) {
            notification.warning({
                message: 'Chưa đủ thông tin',
                description: 'Vui lòng điền đầy đủ các trường bắt buộc.',
                placement: 'bottomRight',
            });
            return;
        }

        setSubmitStatus('loading');

        try {
            await SupportService.createSupport({
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                userEmail: formData.email.trim(),
            });

            setSubmitStatus('success');

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });

            notification.success({
                message: 'Gửi yêu cầu thành công',
                description: 'Cảm ơn bạn đã liên hệ với ROAM.',
                placement: 'bottomRight',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');

            notification.error({
                message: 'Không thể gửi yêu cầu',
                description: 'Vui lòng thử lại sau.',
                placement: 'bottomRight',
            });
        }
    };

    // Giữ tọa độ hiện tại của bản đồ; cập nhật nếu ROAM có địa chỉ chính thức.
    const mapCenter = [10.7769, 106.7009];
    const markerPosition = [10.7769, 106.7009];

    const contactCards = [
        {
            icon: FaMapMarkerAlt,
            title: t('contact.ti2'),
            content: t('contact.ti3'),
            accent: 'bg-emerald-50 text-emerald-700',
        },
        {
            icon: FaPhoneAlt,
            title: t('contact.ti4'),
            content: '+84786176537',
            link: 'tel:+84786176537',
            accent: 'bg-orange-50 text-orange-600',
        },
        {
            icon: FaEnvelope,
            title: 'Email',
            content: 'huykeii47@gmail.com',
            link: 'mailto:huykeii47@gmail.com',
            accent: 'bg-blue-50 text-blue-600',
        },
        {
            icon: FaGithub,
            title: 'GitHub',
            content: 'taktkei-ngh/travel-project',
            link: 'https://github.com/taktkei-ngh/travel-project',
            external: true,
            accent: 'bg-gray-100 text-gray-800',
        },
    ];

    const revealVariants = {
        hidden: {
            opacity: 0,
            y: 22,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <main className="min-h-screen bg-[#f7f6f0]">
            {/* Contact hero */}
            <section className="relative isolate overflow-hidden bg-[#12271d] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-24">
                <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={revealVariants}
                    className="mx-auto max-w-7xl"
                >
                    <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-300 sm:text-sm">
                        <span className="h-px w-9 bg-orange-300" />
                        ROAM · GET IN TOUCH
                    </p>

                    <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl">
                        {t('contact.ti1')}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                        Bạn cần hỗ trợ về chuyến đi hoặc muốn tìm hiểu thêm
                        về ROAM? Hãy gửi lời nhắn cho chúng mình.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3 text-xs text-white/65 sm:text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2">
                            <FaEnvelope className="text-orange-300" />
                            Hỗ trợ qua email
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2">
                            <FaMapMarkerAlt className="text-orange-300" />
                            Kết nối cùng ROAM
                        </span>
                    </div>
                </motion.div>
            </section>

            {/* Contact info */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {contactCards.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.article
                                key={`${item.title}-${index}`}
                                variants={revealVariants}
                                whileHover={{ y: -5 }}
                                className="group rounded-2xl border border-white bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-900/5 sm:p-6"
                            >
                                <div
                                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${item.accent}`}
                                >
                                    <Icon size={19} />
                                </div>

                                <h2 className="text-sm font-bold text-gray-500">
                                    {item.title}
                                </h2>

                                {item.link ? (
                                    <a
                                        href={item.link}
                                        target={item.external ? '_blank' : undefined}
                                        rel={
                                            item.external
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        className="mt-2 block break-words text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-orange-600"
                                    >
                                        {item.content}
                                    </a>
                                ) : (
                                    <p className="mt-2 break-words text-sm font-semibold leading-6 text-gray-900">
                                        {item.content}
                                    </p>
                                )}
                            </motion.article>
                        );
                    })}
                </motion.div>
            </section>

            {/* Contact form and map */}
            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
                    {/* Message form */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-3xl border border-white bg-white p-5 shadow-sm sm:p-8"
                    >
                        <div className="mb-7">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                <FaPaperPlane size={19} />
                            </div>

                            <h2 className="text-2xl font-black tracking-tight text-gray-900">
                                {t('contact.ti5')}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Để lại thông tin và nội dung cần hỗ trợ.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    {t('contact.ti6')}
                                </label>

                                <Input
                                    id="contact-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.ti6')}
                                    size="large"
                                    autoComplete="name"
                                    required
                                    className="!rounded-xl"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-email"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    {t('contact.ti7')}
                                </label>

                                <Input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.ti7')}
                                    size="large"
                                    autoComplete="email"
                                    required
                                    className="!rounded-xl"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-subject"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    {t('contact.ti8')}
                                </label>

                                <Input
                                    id="contact-subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.ti8')}
                                    size="large"
                                    required
                                    className="!rounded-xl"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    {t('contact.ti9')}
                                </label>

                                <TextArea
                                    id="contact-message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder={t('contact.ti9')}
                                    rows={5}
                                    required
                                    showCount
                                    maxLength={2000}
                                    className="!rounded-xl"
                                />
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={submitStatus === 'loading'}
                                icon={<FaPaperPlane />}
                                className="!h-12 !w-full !rounded-xl !border-0 !bg-[#174333] !font-bold hover:!bg-[#245740]"
                            >
                                {submitStatus === 'loading'
                                    ? 'Đang gửi...'
                                    : 'Gửi yêu cầu'}
                            </Button>

                            {submitStatus === 'success' && (
                                <p
                                    role="status"
                                    className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700"
                                >
                                    Gửi yêu cầu thành công!
                                </p>
                            )}

                            {submitStatus === 'error' && (
                                <p
                                    role="alert"
                                    className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"
                                >
                                    Có lỗi xảy ra, vui lòng thử lại!
                                </p>
                            )}
                        </form>
                    </motion.section>

                    {/* Map */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white bg-white p-4 shadow-sm sm:p-6"
                    >
                        <div className="mb-5 flex items-center gap-3 px-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <FaMapMarkerAlt size={18} />
                            </div>

                            <div>
                                <h2 className="text-lg font-extrabold text-gray-900">
                                    Tìm chúng tôi
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Vị trí đang được cấu hình trên bản đồ.
                                </p>
                            </div>
                        </div>

                        <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-2xl border border-gray-100">
                            <MapContainer
                                center={mapCenter}
                                zoom={14}
                                scrollWheelZoom={false}
                                style={{
                                    height: '420px',
                                    width: '100%',
                                    zIndex: 0,
                                }}
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

                        <p className="mt-4 text-xs leading-6 text-gray-400">
                            Bản đồ đang dùng tọa độ mẫu hiện có trong dự án.
                            Hãy thay bằng vị trí chính thức của ROAM trước
                            khi công khai website.
                        </p>
                    </motion.section>
                </div>

                {/* Social links */}
                <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#13271d] p-6 text-white sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <h2 className="text-lg font-extrabold">
                            Kết nối với ROAM
                        </h2>
                        <p className="mt-2 text-sm text-white/60">
                            Theo dõi chúng tôi để cập nhật thông tin và hành trình mới.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href="https://www.facebook.com/profile.php?id=61592129280513"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-orange-400 hover:text-gray-900"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="https://www.instagram.com/takt.keii/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-orange-400 hover:text-gray-900"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="https://github.com/taktkei-ngh/travel-project"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-orange-400 hover:text-gray-900"
                        >
                            <FaGithub />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contacts;
