import React, { useEffect, useRef, useState } from 'react';
import NavbarMB from '~/component/Layout/MenuMB/NavbarMB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/config/AuthContext';
import { Avatar, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import config from '~/config';
import {
    faBell,
    faGlobe,
    faUser,
    faKey,
    faSignInAlt,
    faUserPlus,
    faCheck,
    faTimes,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useState(i18n.language);
    const [openPanel, setOpenPanel] = useState(null);

    const { handleLogout, currentUser, vouchers } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const navbarRef = useRef(null);

    useEffect(() => {
        setSelectedLang(i18n.language);
    }, [i18n.language]);

    // Đóng popup khi click bên ngoài navbar hoặc nhấn Escape.
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                navbarRef.current &&
                !navbarRef.current.contains(event.target)
            ) {
                setOpenPanel(null);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpenPanel(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const navItems = [
        {
            title: t('menu.title1'),
            href: config.routes.home,
        },
        {
            title: t('menu.title2'),
            href: config.routes.tourTrongNuoc,
        },
        {
            title: t('menu.title3'),
            href: config.routes.tourNgoaiNuoc,
        },
        {
            title: t('menu.title4'),
            href: config.routes.news,
        },
        {
            title: t('menu.title5'),
            href: config.routes.contacts,
        },
        {
            title: t('menu.title6'),
            href: config.routes.about,
        },
    ];

    const languages = [
        { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLang(lng);
        setOpenPanel(null);
    };

    const togglePanel = (panel) => {
        setOpenPanel((current) => (current === panel ? null : panel));
    };

    const NavItemsElm = ({ title, href }) => {
        const isActive =
            location.pathname === href ||
            (href !== config.routes.home &&
                location.pathname.startsWith(href));

        return (
            <div className="relative group">
                <Link
                    to={href}
                    onClick={() => setOpenPanel(null)}
                    className={`relative inline-flex items-center px-2 py-2 text-xs font-bold uppercase tracking-wide transition-colors duration-300 whitespace-nowrap ${
                        isActive
                            ? 'text-amber-600'
                            : 'text-gray-700 hover:text-amber-600'
                    }`}
                >
                    {title}

                    <span
                        className={`absolute bottom-0 left-2 right-2 h-0.5 origin-left rounded-full bg-amber-500 transition-transform duration-300 ${
                            isActive
                                ? 'scale-x-100'
                                : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                    />
                </Link>
            </div>
        );
    };

    // Xác định voucher còn hiệu lực trong ngày hôm nay.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeVouchers = (vouchers || []).filter((voucher) => {
        if (!voucher.startDate || !voucher.endDate) {
            return false;
        }

        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);

        if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime())
        ) {
            return false;
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return (
            today.getTime() >= startDate.getTime() &&
            today.getTime() <= endDate.getTime()
        );
    });

    // Chỉ hiển thị thông báo voucher một lần mỗi ngày.
    useEffect(() => {
        const todayKey = `voucher_notified_${new Date().toDateString()}`;
        const hasShownToday = localStorage.getItem(todayKey);

        if (!hasShownToday && activeVouchers.length > 0) {
            message.info(
                'ROAM có quà tặng bạn, hãy kiểm tra thông báo nhé!',
                2
            );

            localStorage.setItem(todayKey, 'true');
        }
    }, [vouchers, activeVouchers.length]);

    const [viewedVouchers, setViewedVouchers] = useState(() => {
        try {
            const saved = localStorage.getItem('viewedVouchers');
            const parsed = saved ? JSON.parse(saved) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    });

    const visibleVouchers = activeVouchers.filter(
        (voucher) => !viewedVouchers.includes(voucher.id)
    );

    const handleMarkAsViewed = (voucherId) => {
        const updatedViewedVouchers = [
            ...new Set([...viewedVouchers, voucherId]),
        ];

        setViewedVouchers(updatedViewedVouchers);

        localStorage.setItem(
            'viewedVouchers',
            JSON.stringify(updatedViewedVouchers)
        );
    };

    const handleClearAll = () => {
        const allVoucherIds = activeVouchers.map(
            (voucher) => voucher.id
        );

        const updatedViewedVouchers = [
            ...new Set([...viewedVouchers, ...allVoucherIds]),
        ];

        setViewedVouchers(updatedViewedVouchers);

        localStorage.setItem(
            'viewedVouchers',
            JSON.stringify(updatedViewedVouchers)
        );

        message.success('Xóa tất cả thông báo thành công', 1.5);
    };

    const handleLogoutClick = async () => {
        setOpenPanel(null);
        await handleLogout(navigate);
    };

    const panelAnimation = {
        initial: {
            opacity: 0,
            y: 8,
            scale: 0.98,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
        },
        exit: {
            opacity: 0,
            y: 6,
            scale: 0.98,
        },
        transition: {
            duration: 0.18,
            ease: 'easeOut',
        },
    };

    return (
        <header
            ref={navbarRef}
            className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md"
        >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-3">
                    {/* Logo */}
                    <Link
                        to={config.routes.home}
                        onClick={() => setOpenPanel(null)}
                        className="flex min-w-0 shrink-0 items-center"
                        aria-label="ROAM Travel - Trang chủ"
                    >
                        <img
                            className="hidden h-12 max-w-[150px] object-contain lg:block"
                            src={config.webConfig.defaultLogo}
                            alt="ROAM Travel"
                        />

                        <span className="text-xl font-extrabold tracking-tight text-indigo-700 lg:hidden">
                            ROAM
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex xl:gap-4">
                        {navItems.map((item) => (
                            <NavItemsElm
                                key={item.href}
                                title={item.title}
                                href={item.href}
                            />
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
                        {/* Language selector */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => togglePanel('language')}
                                aria-label="Change language"
                                aria-expanded={openPanel === 'language'}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                                    openPanel === 'language'
                                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    className="text-base"
                                />
                            </button>

                            <AnimatePresence>
                                {openPanel === 'language' && (
                                    <motion.div
                                        {...panelAnimation}
                                        className="absolute right-0 top-full z-[100] mt-3 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                                    >
                                        <div className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                                            Language
                                        </div>

                                        {languages.map((lang) => (
                                            <button
                                                type="button"
                                                key={lang.code}
                                                onClick={() =>
                                                    changeLanguage(lang.code)
                                                }
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                                                    selectedLang === lang.code
                                                        ? 'bg-indigo-50 font-semibold text-indigo-700'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className="text-base">
                                                    {lang.flag}
                                                </span>

                                                <span className="flex-1">
                                                    {lang.label}
                                                </span>

                                                {selectedLang === lang.code && (
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                        className="text-xs"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {currentUser ? (
                            <>
                                {/* Voucher notifications */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePanel('vouchers')
                                        }
                                        aria-label="Voucher notifications"
                                        aria-expanded={
                                            openPanel === 'vouchers'
                                        }
                                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                                            openPanel === 'vouchers'
                                                ? 'border-amber-200 bg-amber-50 text-amber-600'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600'
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faBell}
                                            className={`text-base ${
                                                visibleVouchers.length > 0
                                                    ? 'animate-pulse text-amber-500'
                                                    : ''
                                            }`}
                                        />

                                        {visibleVouchers.length > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                                                {visibleVouchers.length > 99
                                                    ? '99+'
                                                    : visibleVouchers.length}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {openPanel === 'vouchers' && (
                                            <motion.div
                                                {...panelAnimation}
                                                className="absolute right-0 top-full z-[100] mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
                                            >
                                                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            Thông báo voucher
                                                        </h3>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {visibleVouchers.length > 0
                                                                ? `Bạn có ${visibleVouchers.length} voucher chưa xem`
                                                                : 'Bạn đã xem tất cả voucher'}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenPanel(null)
                                                        }
                                                        aria-label="Close notifications"
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="max-h-96 overflow-y-auto">
                                                    {visibleVouchers.length > 0 ? (
                                                        <div className="divide-y divide-gray-100">
                                                            {visibleVouchers.map(
                                                                (voucher) => (
                                                                    <div
                                                                        key={voucher.id}
                                                                        className="p-4 transition-colors hover:bg-gray-50"
                                                                    >
                                                                        <div className="flex items-start justify-between gap-3">
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="break-words font-semibold text-indigo-700">
                                                                                    {voucher.title}
                                                                                </p>

                                                                                <p className="mt-2 text-xs text-gray-500">
                                                                                    Mã voucher
                                                                                </p>

                                                                                <button
                                                                                    type="button"
                                                                                    title="Nhấn để sao chép mã"
                                                                                    onClick={(
                                                                                        event
                                                                                    ) => {
                                                                                        event.stopPropagation();

                                                                                        if (
                                                                                            !navigator.clipboard
                                                                                        ) {
                                                                                            message.error(
                                                                                                'Trình duyệt không hỗ trợ sao chép mã.'
                                                                                            );
                                                                                            return;
                                                                                        }

                                                                                        navigator.clipboard
                                                                                            .writeText(
                                                                                                voucher.codeVoucher ||
                                                                                                    ''
                                                                                            )
                                                                                            .then(
                                                                                                () => {
                                                                                                    message.success(
                                                                                                        'Đã sao chép mã voucher!',
                                                                                                        1.5
                                                                                                    );
                                                                                                }
                                                                                            )
                                                                                            .catch(
                                                                                                () => {
                                                                                                    message.error(
                                                                                                        'Không thể sao chép mã voucher.'
                                                                                                    );
                                                                                                }
                                                                                            );
                                                                                    }}
                                                                                    className="mt-1 max-w-full break-all rounded-md bg-red-50 px-2 py-1 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                                                                                >
                                                                                    {voucher.codeVoucher}
                                                                                </button>

                                                                                <p className="mt-2 text-xs text-gray-500">
                                                                                    Giảm giá:{' '}
                                                                                    <span className="font-semibold text-emerald-600">
                                                                                        {voucher.discountValue}
                                                                                        %
                                                                                    </span>
                                                                                </p>

                                                                                <p className="mt-1 text-xs text-gray-500">
                                                                                    Trạng thái:{' '}
                                                                                    <span
                                                                                        className={`font-medium ${
                                                                                            voucher.isUsed
                                                                                                ? 'text-emerald-600'
                                                                                                : 'text-orange-600'
                                                                                        }`}
                                                                                    >
                                                                                        {voucher.isUsed
                                                                                            ? 'Đã sử dụng'
                                                                                            : 'Chưa sử dụng'}
                                                                                    </span>
                                                                                </p>

                                                                                <div className="mt-2 space-y-1 text-[11px] text-gray-400">
                                                                                    <p>
                                                                                        Bắt đầu:{' '}
                                                                                        {config.webConfig.convertDateNoTime(
                                                                                            voucher.startDate
                                                                                        )}
                                                                                    </p>

                                                                                    <p>
                                                                                        Kết thúc:{' '}
                                                                                        {config.webConfig.convertDateNoTime(
                                                                                            voucher.endDate
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleMarkAsViewed(
                                                                                        voucher.id
                                                                                    )
                                                                                }
                                                                                className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                                                            >
                                                                                Đã xem
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="px-5 py-10 text-center">
                                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faCheck
                                                                    }
                                                                />
                                                            </div>

                                                            <p className="mt-3 font-semibold text-gray-800">
                                                                Không có thông báo mới
                                                            </p>

                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Các voucher khả dụng của bạn đã được xem.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {visibleVouchers.length > 0 && (
                                                    <div className="border-t border-gray-100 p-3">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleClearAll
                                                            }
                                                            className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                                                        >
                                                            Đánh dấu tất cả đã xem
                                                        </button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Account menu */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePanel('account')
                                        }
                                        aria-expanded={
                                            openPanel === 'account'
                                        }
                                        className={`flex max-w-[210px] items-center gap-2 rounded-full border py-1.5 pl-2 pr-3 transition-all duration-200 ${
                                            openPanel === 'account'
                                                ? 'border-indigo-200 bg-indigo-50'
                                                : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50'
                                        }`}
                                    >
                                        <Avatar
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                />
                                            }
                                            className="flex shrink-0 items-center justify-center bg-indigo-600"
                                            size="small"
                                        />

                                        <span className="max-w-[145px] truncate text-sm font-semibold text-gray-700">
                                            {currentUser?.username ||
                                                currentUser?.email}
                                        </span>

                                        <span
                                            className={`ml-1 text-[10px] text-gray-400 transition-transform ${
                                                openPanel === 'account'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        >
                                            ▼
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {openPanel === 'account' && (
                                            <motion.div
                                                {...panelAnimation}
                                                className="absolute right-0 top-full z-[100] mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                                            >
                                                <div className="border-b border-gray-100 px-3 py-3">
                                                    <p className="truncate font-semibold text-gray-900">
                                                        {currentUser?.username ||
                                                            'Tài khoản ROAM'}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-gray-500">
                                                        {currentUser?.email}
                                                    </p>
                                                </div>

                                                <div className="py-2">
                                                    <Link
                                                        to={
                                                            config.routes.profile
                                                        }
                                                        onClick={() =>
                                                            setOpenPanel(null)
                                                        }
                                                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-indigo-700"
                                                    >
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                            <FontAwesomeIcon
                                                                icon={faUser}
                                                            />
                                                        </span>

                                                        <span className="flex-1 font-medium">
                                                            {t('menu.title7')}
                                                        </span>

                                                        <FontAwesomeIcon
                                                            icon={
                                                                faChevronRight
                                                            }
                                                            className="text-xs text-gray-300"
                                                        />
                                                    </Link>

                                                    <Link
                                                        to={
                                                            config.routes.changePassword
                                                        }
                                                        onClick={() =>
                                                            setOpenPanel(null)
                                                        }
                                                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-indigo-700"
                                                    >
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                                            <FontAwesomeIcon
                                                                icon={faKey}
                                                            />
                                                        </span>

                                                        <span className="flex-1 font-medium">
                                                            {t('menu.title8')}
                                                        </span>

                                                        <FontAwesomeIcon
                                                            icon={
                                                                faChevronRight
                                                            }
                                                            className="text-xs text-gray-300"
                                                        />
                                                    </Link>

                                                    {currentUser?.role ===
                                                        'ADMIN' && (
                                                        <Link
                                                            to={
                                                                config.routes.adminHome
                                                            }
                                                            onClick={() =>
                                                                setOpenPanel(
                                                                    null
                                                                )
                                                            }
                                                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-indigo-700"
                                                        >
                                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faKey
                                                                    }
                                                                />
                                                            </span>

                                                            <span>
                                                                Trang quản trị
                                                            </span>
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="border-t border-gray-100 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleLogoutClick
                                                        }
                                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                                    >
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faSignInAlt
                                                                }
                                                            />
                                                        </span>

                                                        {t('menu.title13')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={config.routes.login}
                                    onClick={() => setOpenPanel(null)}
                                    className="group inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                    <FontAwesomeIcon
                                        icon={faSignInAlt}
                                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                                    />

                                    <span>{t('menu.title14')}</span>
                                </Link>

                                <Link
                                    to={config.routes.register}
                                    onClick={() => setOpenPanel(null)}
                                    className="group inline-flex h-10 items-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
                                >
                                    <FontAwesomeIcon
                                        icon={faUserPlus}
                                        className="transition-transform duration-200 group-hover:scale-110"
                                    />

                                    <span>{t('menu.title15')}</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <NavbarMB />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;