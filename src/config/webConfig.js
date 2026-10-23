
import config from '~/config/index';

const formatSafeDate = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    // Hỗ trợ Date, timestamp, chuỗi ngày và dữ liệu MongoDB dạng {$date: ...}.
    let dateValue = value;

    if (
        typeof value === 'object' &&
        !(value instanceof Date)
    ) {
        dateValue =
            value.$date ??
            value.date ??
            value.value ??
            null;
    }

    if (
        dateValue === null ||
        dateValue === undefined ||
        dateValue === ''
    ) {
        return null;
    }

    const parsedDate =
        dateValue instanceof Date
            ? dateValue
            : new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        console.warn('Bỏ qua dữ liệu ngày không hợp lệ:', value);
        return null;
    }

    return parsedDate;
};

const webConfig = {
    defaultUser: 'defaultL.png',
    banner1: '/img/Pages/TourLists/bg.jpg',
    banner2: '/img/carousel-1.jpg',
    banner3: '/img/carousel-2.jpg',
    defaultLogo: '/img/logo-roam.svg',
    defaultTour: '/img/user_null.png',
    defaultTitle: 'ROAM - Discover Your Next Journey | By Kei',
    defaultQrCode: '103-RmMCZ1D3qJujRSOu02I65_gNdgIFW',

    getCurrency: (price) => {
        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice)) {
            return 'Chưa có thông tin';
        }

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'code',
        }).format(numericPrice);
    },

    convertDate: (date) => {
        const parsedDate = formatSafeDate(date);

        if (!parsedDate) return 'N/A';

        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
        }).format(parsedDate);
    },

    convertLocalDateTime: (date) => {
        const parsedDate = formatSafeDate(date);

        if (!parsedDate) return 'N/A';

        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(parsedDate);
    },

    // Không để ngày không hợp lệ làm crash toàn bộ giao diện.
    convertDateNoTime: (date) => {
        const parsedDate = formatSafeDate(date);

        if (!parsedDate) return 'N/A';

        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(parsedDate);
    },

    convertMonthYear: (monthYear) => {
        if (typeof monthYear !== 'string') {
            return 'Chưa có lịch';
        }

        const match = monthYear.match(/^(\d{4})-(\d{1,2})$/);

        if (!match) {
            return 'Chưa có lịch';
        }

        const year = Number(match[1]);
        const month = Number(match[2]);

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12
        ) {
            return 'Chưa có lịch';
        }

        return `${month}/${year}`;
    },

    getTourDetailQrUrl: (tourId) => {
        if (!tourId) return '';

        const baseUrl =
            typeof window !== 'undefined'
                ? window.location.origin
                : 'https://pacific-vn.vercel.app';

        return `${baseUrl}${config.routes.tourDetail}${tourId}`;
    },
};

export default webConfig;
