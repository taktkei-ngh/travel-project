import { Tabs } from 'antd';
import { useState } from 'react';
import { ProfileCard } from '~/pages/Account/ProfileUI/components/ProfileCard';
import { BookedTour } from '~/pages/Account/historyBooked/BookedTour';
import { useAuth } from '~/config/AuthContext';
import { WishListIndex } from '~/pages/Account/ProfileUI/sections/WishList/WishListIndex';
import { VerifyInformation } from '~/pages/Account/ProfileUI/sections/ProfileInformation/components/VerifyInfomation';
import {
	AccountInformation,
} from '~/pages/Account/ProfileUI/sections/ProfileInformation/components/AccountInformation';
import { Menu, X } from 'lucide-react';
import { PersonalWallet } from '~/pages/Account/ProfileUI/sections/PersonalWallet/PersonalWallet';
import { useLocation } from 'react-router-dom';

const { TabPane } = Tabs;

export const ProfileUI = () => {
	const { currentUser, setCurrentUser } = useAuth();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState(location.state?.activeTab || '1');
	const [isLoading, setIsLoading] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const switchTab = (tabKey) => {
		setActiveTab(tabKey);
		setIsMenuOpen(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleUserUpdate = (updatedUser) => {
		setIsLoading(true);
		setCurrentUser(updatedUser);
		setTimeout(() => setIsLoading(false), 500);
	};

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const menuItems = [
		{ key: '1', label: 'Chỉnh sửa thông tin' },
		{ key: '2', label: 'Xác thực thông tin' },
		{ key: '3', label: 'Lịch sử đặt tour' },
		{ key: '4', label: 'Danh sách yêu thích' },
		{ key: '5', label: 'Ví cá nhân' },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case '1':
				return (
					<AccountInformation
						data={currentUser}
						onUserUpdate={handleUserUpdate}
						setParentLoading={setIsLoading}
						switchTab={switchTab}
					/>
				);
			case '2':
				return <VerifyInformation data={currentUser} onUserUpdate={handleUserUpdate} />;
			case '3':
				return <BookedTour />;
			case '4':
				return <WishListIndex />;
			case '5':
				return <PersonalWallet />;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-100 min-h-screen">
			{/* Sidebar */}
			<div className="w-full lg:w-1/4">
				<ProfileCard data={currentUser} isLoading={isLoading} switchTab={switchTab} />
			</div>

			{/* Main Content */}
			<div className="w-full lg:flex-1">
				{/* Mobile/Tablet Menu */}
				<div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
					<button
						onClick={toggleMenu}
						className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
						aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
					<span className="text-base font-semibold">
                        {menuItems.find((item) => item.key === activeTab)?.label || 'Menu'}
                    </span>
					<div className="w-6" />
				</div>

				{/* Mobile/Tablet Menu Dropdown */}
				{isMenuOpen && (
					<div className="lg:hidden bg-white p-4 rounded-lg shadow-md mb-4">
						{menuItems.map((item) => (
							<button
								key={item.key}
								onClick={() => switchTab(item.key)}
								className={`block w-full text-left py-2 px-4 rounded-md text-sm sm:text-base ${
									activeTab === item.key
										? 'bg-orange-100 text-orange-600 font-semibold'
										: 'hover:bg-gray-100'
								}`}
								aria-label={`Chuyển đến ${item.label}`}
							>
								{item.label}
							</button>
						))}
					</div>
				)}

				{/* Desktop Tabs */}
				<div className="hidden lg:block">
					<Tabs
						animated={{ inkBar: true, tabPane: true }}
						onChange={switchTab}
						activeKey={activeTab}
						className="bg-white p-4 rounded-lg shadow-md"
						tabBarStyle={{ fontSize: '14px', padding: '0 8px' }}
					>
						<TabPane tab="Chỉnh sửa thông tin" key="1">
							<AccountInformation
								data={currentUser}
								onUserUpdate={handleUserUpdate}
								setParentLoading={setIsLoading}
								switchTab={switchTab}
							/>
						</TabPane>
						<TabPane tab="Xác thực thông tin" key="2">
							<VerifyInformation data={currentUser} onUserUpdate={handleUserUpdate} />
						</TabPane>
						<TabPane tab="Lịch sử đặt tour" key="3">
							<BookedTour />
						</TabPane>
						<TabPane tab="Danh sách yêu thích" key="4">
							<WishListIndex />
						</TabPane>
						<TabPane tab="Ví cá nhân" key="5">
							<PersonalWallet />
						</TabPane>
					</Tabs>
				</div>

				{/* Mobile/Tablet Content */}
				<div className="lg:hidden bg-white p-4 sm:p-6 rounded-lg shadow-md">
					{renderTabContent()}
				</div>
			</div>
		</div>
	);
};