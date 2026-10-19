import { MdAdminPanelSettings, MdEdit, MdEmail } from 'react-icons/md';
import { Avatar, Card, Divider, Tooltip, Skeleton, Image } from 'antd';
import { PhoneCall } from 'lucide-react';
import config from '~/config';
import { FaCheckCircle } from 'react-icons/fa';

export const ProfileCard = ({ data, switchTab, isLoading }) => {
    const renderValue = (value, defaultText = 'Chưa cập nhật') => {
        return value ? value : <span className="text-gray-400 italic">{defaultText}</span>;
    };

    const renderGender = (gender) => {
        if (gender === null || gender === undefined) {
            return <span className="text-gray-400 italic">Chưa cập nhật</span>;
        }
        return gender === 'FEMALE' ? 'Nữ' : 'Nam'; // Điều chỉnh để khớp với AccountInformation
    };

    if (isLoading) {
        return (
            <Card className="shadow-lg sticky top-20 rounded-xl border border-gray-200">
                <div className="flex flex-col items-center text-center">
                    <Skeleton.Avatar active size={100} shape="circle" />
                    <Skeleton paragraph={{ rows: 2, width: ['60%', '80%'] }} title={false} active className="mt-4" />
                    <Skeleton.Button active size="small" shape="round" className="mt-2" />
                </div>
                <Divider className="my-6" />
                <Skeleton paragraph={{ rows: 3, width: ['100%', '80%', '90%'] }} title={{ width: '50%' }} active />
                <Divider className="my-6" />
                <Skeleton paragraph={{ rows: 2, width: ['80%', '90%'] }} title={{ width: '50%' }} active />
            </Card>
        );
    }

    return (
        <Card
            className="shadow-lg sticky top-20 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-xl w-full sm:w-80 md:w-96"
            bodyStyle={{ padding: '16px sm:p-6' }}
        >
            <div className="flex flex-col items-center text-center">
                {/*<Avatar*/}
                {/*    size={{ xs: 80, sm: 100, lg: 120, xl: 120 }}*/}
                {/*    src={config.imageConfig.getImage(data.avatar) || config.imageConfig.getImage(data.avatar)}*/}
                {/*    className="border-4 border-orange-100 shadow-md"*/}
                {/*/>*/}
                <img
                    src={config.imageConfig.getImage(data.avatar)}
                    alt="Avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-orange-100 shadow-md"
                />
                <h2 className="mt-4 flex flex-wrap items-center gap-2 text-lg sm:text-xl font-bold text-gray-800">
                    {renderValue(data.username, 'Bạn chưa cập nhật tên')}
                    {data?.role === 'ADMIN' && (
                        <Tooltip title="Quản trị viên">
                            <MdAdminPanelSettings className="text-yellow-500 text-xl sm:text-2xl" />
                        </Tooltip>
                    )}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {renderValue(
                        data.firstName || data.lastName
                            ? `${data.firstName || ''} ${data.lastName || ''}`.trim()
                            : null,
                        'Chưa cập nhật họ tên',
                    )}
                </p>
                <div className="mt-2">
                    <Tooltip title="Chỉnh sửa hồ sơ">
                        <button
                            onClick={() => switchTab('1')}
                            className="flex items-center gap-1 px-3 py-1 text-xs sm:text-sm text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-200"
                        >
                            <MdEdit size={16} /> Chỉnh sửa
                        </button>
                    </Tooltip>
                </div>
            </div>
            <Divider className="my-4 sm:my-6" />
            <div className="space-y-3 text-sm sm:text-base">
                <h3 className="font-bold text-base sm:text-lg text-orange-500">Giới thiệu</h3>
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-gray-700 w-24">Ngày sinh:</label>
                    <p className="text-gray-600">
                        {renderValue(
                            data.birthday ? config.webConfig.convertDateNoTime(data.birthday) : null,
                            'Chưa cập nhật',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-gray-700 w-24">Giới tính:</label>
                    <p className="text-gray-600">{renderGender(data.gender)}</p>
                </div>
                <div className="flex items-start gap-2">
                    <label className="font-semibold text-gray-700 w-24">Địa chỉ:</label>
                    <p className="text-gray-600">{renderValue(data.address)}</p>
                </div>
            </div>
            <Divider className="my-6" />
            <div className="mt-6 space-y-3">
                <h3 className="font-bold text-lg text-orange-500">Liên hệ</h3>
                <div className="flex items-center gap-3">
                    <PhoneCall size={20} className="text-gray-500" />
                    <p className="text-gray-600">{renderValue(data.phone)}</p>
                    {data?.phoneVerified && (
                        <FaCheckCircle className={'text-green-500 text-xl font-semibold'} />
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <MdEmail size={20} className="text-gray-500" />
                    <p className="text-gray-600">{renderValue(data.email)}</p>
                    {data?.emailVerified && (
                        <FaCheckCircle className={'text-green-500 text-xl font-semibold'} />
                    )}
                </div>
            </div>
        </Card>
    );
};