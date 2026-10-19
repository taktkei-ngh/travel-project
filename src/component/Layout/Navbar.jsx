import React, { useEffect, useState } from 'react';
import NavbarMB from '~/component/Layout/MenuMB/NavbarMB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/config/AuthContext';
import { Badge, Dropdown, Menu, message, Tooltip, Avatar } from 'antd';
import { motion } from 'framer-motion';
import config from '~/config';
import { faBell, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useState(i18n.language);
    const { handleLogout, currentUser, vouchers } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setSelectedLang(i18n.language);
    }, [i18n.language]);

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

    const NavItemsElm = ({ title, href }) => {
        const isActive = location.pathname === href ||
            (href !== config.routes.home && location.pathname.startsWith(href));

        return (
            <div className="relative group">
                <Link
                    to={href}
                    className={`px-2 py-2 rounded-md text-gray-700 hover:text-yellow-600 transition duration-300 uppercase font-bold whitespace-nowrap ${
                        isActive ? 'text-yellow-600' : ''
                    }`}
                >
                    {title}
                </Link>
                {/* Active indicator line */}
                <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-600 transform origin-left transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></div>
            </div>
        );
    };

    const menuItems = [
        {
            key: 'thong-tin-ca-nhan',
            title: t('menu.title7'),
            icon: <FontAwesomeIcon icon="user" />,
            href: config.routes.profile,
        },
        {
            key: 'doi-mat-khau',
            title: t('menu.title8'),
            icon: <FontAwesomeIcon icon="key" />,
            href: config.routes.changePassword,
        },
    ];
    const menuGroup = (
        <Menu>
            <Menu.ItemGroup title={t('menu.title10')}>
                {menuItems.map((item) => (
                    <Menu.Item icon={item.icon} key={item.key}>
                        <Link to={item.href}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                            {item.title}
                        </Link>
                    </Menu.Item>
                ))}
            </Menu.ItemGroup>
            <Menu.ItemGroup title={t('menu.title12')}>
                {currentUser?.role === 'ADMIN' && (
                    <Menu.Item key="admin">
                        <Link to={config.routes.adminHome}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Admin
                        </Link>
                    </Menu.Item>
                )}
                <Menu.Item key="logout">
                    <button
                        onClick={() => handleLogout(navigate)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        {t('menu.title13')}
                    </button>
                </Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    );

    const languages = [
        { code: 'vi', label: 'Tiếng Việt' },
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'zh', label: '中文' },
        { code: 'ko', label: '한국어' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLang(lng);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeVouchers = vouchers.filter((voucher) => {
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime();
    });


    useEffect(() => {
        const checkAndShowVoucherNotification = () => {
            const todayKey = `voucher_notified_${new Date().toDateString()}`;
            const hasShownToday = localStorage.getItem(todayKey);

            if (!hasShownToday && activeVouchers.length > 0) {
                message.info('Pacific có quà tặng bạn, hãy kiểm tra thông báo nhé!', 1);
                localStorage.setItem(todayKey, 'true');
            }
        };

        checkAndShowVoucherNotification();
    }, [vouchers, activeVouchers]);

// Khởi tạo trạng thái viewedVouchers
    const [viewedVouchers, setViewedVouchers] = useState(() => {
        const saved = localStorage.getItem('viewedVouchers');
        return saved ? JSON.parse(saved) : [];
    });

// Lọc các voucher chưa được xem
    const visibleVouchers = activeVouchers.filter((voucher) => !viewedVouchers.includes(voucher.id));

// Hàm xử lý khi nhấn nút "Đã xem"
    const handleMarkAsViewed = (voucherId) => {
        const updatedViewedVouchers = [...viewedVouchers, voucherId];
        setViewedVouchers(updatedViewedVouchers);
        localStorage.setItem('viewedVouchers', JSON.stringify(updatedViewedVouchers));
    };

    const handleClearAll = () => {
        // Lấy tất cả ID của activeVouchers
        const allVoucherIds = activeVouchers.map((voucher) => voucher.id);
        // Thêm tất cả ID vào viewedVouchers (coi như đã xem hết)
        const updatedViewedVouchers = [...new Set([...viewedVouchers, ...allVoucherIds])]; // Sử dụng Set để tránh trùng lặp
        setViewedVouchers(updatedViewedVouchers);
        localStorage.setItem('viewedVouchers', JSON.stringify(updatedViewedVouchers));
        message.success('Xóa tất cả thông báo thành công', 1);
    };

    const voucherMenu = (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            <div className={'bg-white shadow-lg rounded-lg'}>
                <Menu className="max-h-96">
                    {visibleVouchers.length > 0 ? (
                        <>
                            {visibleVouchers.map((voucher) => (
                                <Menu.Item
                                    key={voucher.id}
                                    className="hover:bg-gray-100 transition-colors duration-200"
                                    style={{ padding: '12px 16px' }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-blue-600 text-sm">
                                                {voucher.title}
                                            </p>

                                            <p className="text-gray-600 text-md">
                                                Mã voucher:{' '}
                                                <Tooltip placement={'right'} title={'Nhấn để sao chép mã'}>
                                                    <span
                                                        className="font-medium text-red-600 cursor-pointer hover:underline"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(voucher.codeVoucher);
                                                            message.success('Bạn đã lưu mã voucher vào bộ nhớ tạm!', 1);
                                                        }}
                                                    >
                                                          {voucher.codeVoucher}
                                                    </span>
                                                </Tooltip>
                                            </p>
                                            <p className={'text-gray-700 text-xs'}>
                                                Trạng thái: <span
                                                className={`font-medium ${voucher.isUsed ? 'text-green-600' : 'text-red-600'}`}>
                                                {voucher.isUsed ? 'Đã sử dụng' : 'Chưa sử dụng'}
                                            </span>
                                            </p>
                                            <p className="text-gray-700 text-xs">
                                                Giảm giá: <span
                                                className="font-medium text-green-600">{voucher.discountValue}%</span>
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                                Ngày bắt đầu: {config.webConfig.convertDateNoTime(voucher.startDate)}
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                                Ngày kết thúc: {config.webConfig.convertDateNoTime(voucher.endDate)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleMarkAsViewed(voucher.id)}
                                            className="text-xs text-white bg-red-500 hover:bg-red-600 rounded-full px-2 py-1 transition-colors duration-200"
                                        >
                                            Đã xem
                                        </button>
                                    </div>
                                </Menu.Item>
                            ))}
                            <Menu.Item className={'bg-gray-100 hover:text-red-600 transition-all hover:bg-gray-50'}
                                       style={{ padding: '12px 16px' }}>
                                <button
                                    onClick={handleClearAll}
                                    className="w-full text-center text-sm text-red-500 hover:text-red-600"
                                >
                                    Xóa tất cả thông báo
                                </button>
                            </Menu.Item>
                        </>
                    ) : (
                        <Menu.Item disabled style={{ padding: '12px 16px' }}>
                            <p className="text-red-500 text-sm font-medium">
                                Không có voucher nào khả dụng hôm nay
                            </p>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
        </motion.div>
    );

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to={config.routes.home} className="flex items-center text-xl font-bold text-indigo-600">
                            <img
                                className={'h-12 w-full hidden object-cover lg:block'}
                                src={config.webConfig.defaultLogo}
                                alt="Pacific Travel"
                            />
                            {/*<span className={'text-black font-light'}>Pacific</span>*/}
                        </Link>
                    </div>

                    {/* Menu Items */}
                    <div className="hidden md:flex space-x-4">
                        {navItems.map((item, index) => (
                            <NavItemsElm key={index} title={item.title} href={item.href} />
                        ))}
                    </div>
                    {/*<div className={'hidden md:flex space-x-4'}>*/}
                    <div className={'hidden md:flex space-x-4 items-center ml-auto'}>
                        <Dropdown
                            overlay={(
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="shadow-xl rounded-lg overflow-hidden"
                                >
                                    <Menu className="border border-gray-100">
                                        {languages.map(lang => (
                                            <Menu.Item
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`hover:bg-gray-50 transition-colors duration-200 ${
                                                    selectedLang === lang.code ? 'bg-blue-50 font-medium text-blue-600' : ''
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    {selectedLang === lang.code && (
                                                        <span className="w-1 h-5 bg-blue-500 rounded-full mr-2"></span>
                                                    )}
                                                    {lang.label}
                                                </div>
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                </motion.div>
                            )}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <button
                                className="w-10 h-10 flex items-center justify-center text-blue-700 hover:text-yellow-600 hover:bg-blue-50 transition-all duration-300 rounded-full border border-gray-200 shadow-md hover:shadow-lg"
                                aria-label="Change language"
                            >
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    className="text-lg"
                                />
                                <span className="sr-only">Change language</span>
                            </button>
                        </Dropdown>
                        {currentUser ? (
                            // Giữ nguyên phần code cho currentUser
                            <>
                                <Dropdown
                                    overlay={
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="shadow-xl rounded-lg overflow-hidden"
                                        >
                                            {voucherMenu}
                                        </motion.div>
                                    }
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <button
                                        className="w-10 h-10 flex items-center justify-center text-blue-700 hover:text-yellow-600 hover:bg-blue-50 transition-all duration-300 rounded-full border border-gray-200 shadow-md hover:shadow-lg relative"
                                        aria-label="Voucher notifications"
                                    >
                                        <FontAwesomeIcon
                                            icon={faBell}
                                            className={`text-lg ${visibleVouchers.length > 0 ? 'animate-pulse text-yellow-600' : ''}`}
                                        />
                                        {visibleVouchers.length > 0 && (
                                            <Badge
                                                count={visibleVouchers.length}
                                                overflowCount={99}
                                                style={{ backgroundColor: '#f5222d', color: '#fff' }}
                                                className="absolute -top-1 -right-2"
                                            />
                                        )}
                                        <span className="sr-only">Voucher notifications</span>
                                    </button>
                                </Dropdown>
                                <Dropdown
                                    overlay={
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="shadow-xl rounded-lg overflow-hidden"
                                        >
                                            {menuGroup}
                                        </motion.div>
                                    }
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <div
                                        onClick={(e) => e.preventDefault()}
                                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 shadow-md hover:shadow-lg cursor-pointer hover:bg-blue-50 transition-all duration-300"
                                    >
                                        <Avatar
                                            icon={<FontAwesomeIcon icon={faUser} />}
                                            className="bg-blue-500 flex items-center justify-center"
                                            size="small"
                                        />
                                        <span
                                            className="text-gray-700 hover:text-yellow-600 transition duration-300 font-medium">
                                            {currentUser?.username || currentUser?.email}
                                        </span>
                                    </div>
                                </Dropdown>
                            </>
                        ) : (
                            // Enhanced login/register buttons
                            <>
                                <Link
                                    to={config.routes.login}
                                    className="flex items-center px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon="sign-in-alt" className="mr-2" />
                                    {t('menu.title14')}
                                </Link>
                                <Link
                                    to={config.routes.register}
                                    className="flex items-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon="user-plus" className="mr-2" />
                                    {t('menu.title15')}
                                </Link>
                            </>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <NavbarMB />
                    </div>
                </div>
            </nav>
        </header>
    );
};
