
import localImagePaths from '~/config/localImagePaths';

const FALLBACK_IMAGE = '/img/destination-1.jpg';
const FALLBACK_AVATAR = '/img/user_null.png';
const LEGACY_HOST = 'khangyuno.id.vn';

function isLegacyImageUrl(value) {
    if (!/^https?:\/\//i.test(value)) return false;

    try {
        const url = new URL(value);

        return (
            url.hostname.toLowerCase() === LEGACY_HOST ||
            url.pathname.toLowerCase().includes('/api/image')
        );
    } catch {
        return false;
    }
}

function extractImageId(value) {
    const raw = String(value || '').trim();

    if (!raw) return '';

    try {
        if (/^https?:\/\//i.test(raw) || raw.startsWith('/api/image')) {
            const url = new URL(raw, 'https://local.invalid');

            if (url.pathname.toLowerCase().includes('/api/image')) {
                return (
                    url.searchParams.get('id') ||
                    decodeURIComponent(url.pathname.split('/').pop() || '')
                );
            }

            if (url.hostname.toLowerCase() === LEGACY_HOST) {
                return decodeURIComponent(url.pathname.split('/').pop() || '');
            }

            if (/^https?:\/\//i.test(raw)) return '';
        }
    } catch {
        return raw;
    }

    return raw;
}

function findLocalImage(value) {
    const raw = String(value || '').trim();

    if (!raw) return '';

    if (raw.startsWith('/img/') || raw === '/defaultL.png') {
        return localImagePaths.includes(raw) ? raw : '';
    }

    const candidate = extractImageId(raw);

    if (!candidate) return '';

    if (candidate.startsWith('/img/')) {
        return localImagePaths.includes(candidate) ? candidate : '';
    }

    let filename;

    try {
        filename = decodeURIComponent(candidate)
            .replace(/\\/g, '/')
            .split('/')
            .pop()
            .toLowerCase();
    } catch {
        filename = candidate.toLowerCase();
    }

    const stem = filename.replace(/\.[^.]+$/, '');

    const exactMatch = localImagePaths.find((path) => {
        const name = path.split('/').pop().toLowerCase();
        const localStem = name.replace(/\.[^.]+$/, '');

        return name === filename || localStem === stem;
    });

    if (exactMatch) return exactMatch;

    // Ho tro ID la phan dau cua ten file local, vi du UUID.
    if (stem.length >= 8) {
        const prefixMatch = localImagePaths.find((path) => {
            const name = path.split('/').pop().toLowerCase();
            const localStem = name.replace(/\.[^.]+$/, '');

            return localStem.startsWith(stem);
        });

        if (prefixMatch) return prefixMatch;
    }

    return '';
}

const imageConfig = {
    getImage(imageId) {
        if (!imageId) return '';

        const raw = String(imageId).trim();

        if (/^(data:|blob:)/i.test(raw)) return raw;

        // Giu nguyen cac URL anh ben ngoai khong thuoc server cu.
        if (/^https?:\/\//i.test(raw) && !isLegacyImageUrl(raw)) {
            return raw;
        }

        return findLocalImage(raw) || FALLBACK_IMAGE;
    },

    getAvatar(imageId) {
        if (!imageId) return FALLBACK_AVATAR;

        const raw = String(imageId).trim();

        if (/^(data:|blob:)/i.test(raw)) return raw;

        if (/^https?:\/\//i.test(raw) && !isLegacyImageUrl(raw)) {
            return raw;
        }

        const localImage = findLocalImage(raw);

        if (localImage) return localImage;

        // Neu la ID anh Google, giu cach tao URL avatar cu.
        if (!/^https?:\/\//i.test(raw) && !raw.startsWith('/api/image')) {
            return `https://lh3.googleusercontent.com/a/${encodeURIComponent(raw)}`;
        }

        return FALLBACK_AVATAR;
    },
};

export default imageConfig;
