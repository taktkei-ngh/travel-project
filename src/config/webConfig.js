import config from '~/config/index';

const webConfig = {
    defaultUser: 'defaultL.png',
    banner1: '/img/Pages/TourLists/bg.jpg',
    banner2: '/img/carousel-1.jpg',
    banner3: '/img/carousel-2.jpg',
    defaultLogo: '/img/logo.jpg',
    defaultTour: '/img/user_null.png',
    defaultTitle: 'Pacific - Hành trình khám phá mọi nơi',
    defaultQrCode: '103-RmMCZ1D3qJujRSOu02I65_gNdgIFW',
    getCurrency: (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'code',
        }).format(price);
    },
    convertDate: (date) => {
        return new Intl.DateTimeFormat('vi-VN').format(date);
    },
    convertLocalDateTime: (date) => {
        if (!date || typeof date !== 'string') return 'N/A';
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) return 'N/A';
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(parsedDate); // Bỏ giờ, phút, giây
        } catch (error) {
            console.error('Error converting date:', error);
            return 'N/A';
        }
    },


    convertDateNoTime: (date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date(date));
    },
    convertMonthYear: (monthYear) => {
        let [year, month] = monthYear.split('-');
        let date = new Date(year, month - 1);
        return new Intl.DateTimeFormat('vi-VN', {
            month: 'numeric',
            year: 'numeric',
        }).format(new Date(date)).replace('-', '/');
    },
    //getQRCODE
    getTourDetailQrUrl: (tourId) => {
        if (!tourId) return ''; // Return empty string if no tourId
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pacific-vn.vercel.app'; // Fallback for SSR
        // const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'localhost:3000'; // Fallback for SSR
        return `${baseUrl}${config.routes.tourDetail}${tourId}`;
    },
};

export default webConfig;