import React, { useState, useEffect } from 'react';
import { Drawer, Menu, Dropdown, Button, message, Tooltip, Badge, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/config/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import config from '~/config';
import { FaBars } from 'react-icons/fa';

const NavbarMB = () => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(i18n.language);
    const { handleLogout, currentUser, vouchers } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Cập nhật ngôn ngữ khi thay đổi
    useEffect(() => {
        setSelectedLang(i18n.language);
    }, [i18n.language]);

    // Các mục điều hướng
    const navItems = [
        { title: t('menu.title1'), href: config.routes.home },
        { title: t('menu.title2'), href: config.routes.tourTrongNuoc },
        { title: t('menu.title3'), href: config.routes.tourNgoaiNuoc },
        { title: t('menu.title4'), href: config.routes.news },
        { title: t('menu.title5'), href: config.routes.contacts },
        { title: t('menu.title6'), href: config.routes.about },
    ];

    // Các mục trong menu người dùng
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

    // Menu người dùng (giống Navbar chính)
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

    // Danh sách ngôn ngữ
    const languages = [
        { code: 'vi', label: 'Tiếng Việt' },
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'zh', label: '中文' },
        { code: 'ko', label: '한국어' },
    ];

    // Thay đổi ngôn ngữ
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLang(lng);
    };

    // Lọc voucher còn hiệu lực
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeVouchers = vouchers.filter((voucher) => {
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime();
    });

    // Quản lý trạng thái voucher đã xem
    const [viewedVouchers, setViewedVouchers] = useState(() => {
        const saved = localStorage.getItem('viewedVouchers');
        return saved ? JSON.parse(saved) : [];
    });

    // Lọc voucher chưa xem
    const visibleVouchers = activeVouchers.filter((voucher) => !viewedVouchers.includes(voucher.id));

    // Đánh dấu voucher đã xem
    const handleMarkAsViewed = (voucherId) => {
        const updatedViewedVouchers = [...viewedVouchers, voucherId];
        setViewedVouchers(updatedViewedVouchers);
        localStorage.setItem('viewedVouchers', JSON.stringify(updatedViewedVouchers));
    };

    // Xóa tất cả thông báo
    const handleClearAll = () => {
        const allVoucherIds = activeVouchers.map((voucher) => voucher.id);
        const updatedViewedVouchers = [...new Set([...viewedVouchers, ...allVoucherIds])];
        setViewedVouchers(updatedViewedVouchers);
        localStorage.setItem('viewedVouchers', JSON.stringify(updatedViewedVouchers));
        message.success('Xóa tất cả thông báo thành công', 1);
    };

    // Menu voucher (giống Navbar chính)
    const voucherMenu = (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            <div className="bg-white shadow-lg rounded-lg overflow-y-scroll">
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
                                            <p className="font-semibold text-blue-600 text-sm">{voucher.title}</p>
                                            <p className="text-gray-600 text-md">
                                                Mã voucher:{' '}
                                                <Tooltip placement="right" title="Nhấn để sao chép mã">
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
                                            <p className="text-gray-700 text-xs">
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
                            <Menu.Item className="bg-gray-100 hover:text-red-600 transition-all hover:bg-gray-50"
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

    // Menu ngôn ngữ
    const languageMenu = (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            <Menu>
                {languages.map((lang) => (
                    <Menu.Item
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="hover:bg-gray-100 transition-colors duration-200"
                    >
                        {lang.label}
                    </Menu.Item>
                ))}
            </Menu>
        </motion.div>
    );

    // Mở/đóng Drawer
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                type="text"
                onClick={showDrawer}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-md hover:shadow-lg text-blue-700 hover:text-yellow-600 hover:bg-blue-50 transition-all duration-300"
                icon={<FaBars className="text-lg" />}
                aria-label="Open menu"
            />
            <Drawer
                title={
                    <Link to={config.routes.home} className="flex items-center text-xl font-bold text-indigo-600">
                        <img
                            className="h-10 w-auto object-cover"
                            src={config.webConfig.defaultLogo}
                            alt="Pacific Travel"
                        />
                    </Link>
                }
                placement="right"
                onClose={onClose}
                open={open}
                width={250}
                className="mobile-drawer"
                bodyStyle={{ padding: 0 }}
                headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px' }}
                closeIcon={
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                }
            >
                <Menu mode="vertical" className="border-none py-2">
                    {/* Các mục điều hướng */}
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.href || 
                                        (item.href !== config.routes.home && location.pathname.startsWith(item.href));
                        return (
                            <Menu.Item 
                                key={index}
                                className={`relative ${isActive ? 'bg-blue-50' : ''}`}
                            >
                                <Link
                                    to={item.href}
                                    onClick={onClose}
                                    className={`flex items-center px-4 py-2 text-gray-700 hover:text-yellow-600 transition duration-300 uppercase font-bold whitespace-nowrap ${
                                        isActive ? 'text-yellow-600' : ''
                                    }`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-600 rounded-r-full"></span>
                                    )}
                                    {item.title}
                                </Link>
                            </Menu.Item>
                        );
                    })}

                    {/* Ngôn ngữ */}
                    <Menu.Item key="language" className="flex items-center">
                        <Dropdown 
                            overlay={
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
                            }
                            trigger={['click']} 
                            placement="bottomRight"
                        >
                            <button className="flex items-center px-4 py-2 text-gray-700 hover:text-yellow-600 w-full">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faGlobe} className="text-blue-600" />
                                    <span>{languages.find((lang) => lang.code === selectedLang)?.label || 'Ngôn ngữ'}</span>
                                </div>
                            </button>
                        </Dropdown>
                    </Menu.Item>

                    {/* Voucher */}
                    <Menu.Item key="voucher" className="flex items-center">
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
                            <button className="flex items-center px-4 py-2 text-gray-700 hover:text-yellow-600 w-full relative">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon 
                                        icon={faBell} 
                                        className={`${visibleVouchers.length > 0 ? 'text-yellow-600 animate-pulse' : 'text-blue-600'}`} 
                                    />
                                    <span>Voucher</span>
                                    {visibleVouchers.length > 0 && (
                                        <Badge
                                            count={visibleVouchers.length}
                                            overflowCount={99}
                                            style={{ backgroundColor: '#f5222d', color: '#fff' }}
                                            className="ml-1"
                                        />
                                    )}
                                </div>
                            </button>
                        </Dropdown>
                    </Menu.Item>

                    {/* Người dùng hoặc đăng nhập/đăng ký */}
                    {currentUser ? (
                        <>
                            <Menu.Divider className="my-2" />
                            <div className="px-4 py-2">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Avatar 
                                        icon={<FontAwesomeIcon icon={faUser} />} 
                                        className="bg-blue-500 flex items-center justify-center"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            {currentUser?.username || currentUser?.email}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {currentUser?.role === 'ADMIN' ? 'Administrator' : 'User'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Menu.Divider className="my-1" />

                            {menuItems.map((item) => (
                                <Menu.Item 
                                    key={item.key} 
                                    className="hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <Link
                                        to={item.href}
                                        onClick={onClose}
                                        className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
                                    >
                                        <span className="mr-2 text-blue-500">{item.icon}</span>
                                        {item.title}
                                    </Link>
                                </Menu.Item>
                            ))}

                            {currentUser?.role === 'ADMIN' && (
                                <Menu.Item 
                                    key="admin"
                                    className="hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <Link
                                        to={config.routes.adminHome}
                                        onClick={onClose}
                                        className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
                                    >
                                        <span className="mr-2 text-blue-500">
                                            <FontAwesomeIcon icon="shield-alt" />
                                        </span>
                                        Admin
                                    </Link>
                                </Menu.Item>
                            )}

                            <Menu.Divider className="my-1" />
                            <Menu.Item 
                                key="logout"
                                className="hover:bg-red-50 transition-colors duration-200"
                            >
                                <button
                                    onClick={() => {
                                        handleLogout(navigate);
                                        onClose();
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-red-600"
                                >
                                    <span className="mr-2 text-red-500">
                                        <FontAwesomeIcon icon="sign-out-alt" />
                                    </span>
                                    {t('menu.title13')}
                                </button>
                            </Menu.Item>
                        </>
                    ) : (
                        <>
                            <Menu.Divider className="my-2" />
                            <Menu.Item 
                                key="login"
                                className="hover:bg-blue-50 transition-colors duration-200"
                            >
                                <Link
                                    to={config.routes.login}
                                    onClick={onClose}
                                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
                                >
                                    <span className="mr-2 text-blue-500">
                                        <FontAwesomeIcon icon="sign-in-alt" />
                                    </span>
                                    {t('menu.title14')}
                                </Link>
                            </Menu.Item>
                            <Menu.Item 
                                key="register"
                                className="hover:bg-blue-50 transition-colors duration-200"
                            >
                                <Link
                                    to={config.routes.register}
                                    onClick={onClose}
                                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
                                >
                                    <span className="mr-2 text-blue-500">
                                        <FontAwesomeIcon icon="user-plus" />
                                    </span>
                                    {t('menu.title15')}
                                </Link>
                            </Menu.Item>
                        </>
                    )}
                </Menu>
            </Drawer>
        </>
    );
};

export default NavbarMB;
