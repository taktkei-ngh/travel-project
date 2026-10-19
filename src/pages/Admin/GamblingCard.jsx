import { useState } from 'react';
import { Button, InputNumber, notification, Card, Space, Typography, Spin, Tooltip } from 'antd';
import WalletServices from '~/services/WalletServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';

const { Text, Title } = Typography;

const icons = ['🍎', '🍋', '⭐', '7️⃣'];

export const GamblingCard = ({ onUpdateWallet }) => {
    const [stake, setStake] = useState(null);
    const [slots, setSlots] = useState(['🎰', '🎰', '🎰']);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);

    const spinSlots = async () => {
        if (!stake || stake <= 0) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Vui lòng nhập số tiền cược hợp lệ.',
            });
            return;
        }

        setSpinning(true);
        setResult(null);

        // Giả lập hiệu ứng quay
        for (let i = 0; i < 5; i++) {
            setSlots([
                icons[Math.floor(Math.random() * icons.length)],
                icons[Math.floor(Math.random() * icons.length)],
                icons[Math.floor(Math.random() * icons.length)],
            ]);
            await new Promise((resolve) => setTimeout(resolve, 400));
        }

        // Kết quả cuối cùng
        const finalSlots = [
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)],
        ];
        setSlots(finalSlots);

        const isJackpot = finalSlots.every((icon) => icon === '7️⃣');

        try {
            if (isJackpot) {
                // Thắng: x7 tiền cược
                const winnings = stake * 7;
                await WalletServices.depositSystem(winnings);
                setResult(`JACKPOT! Bạn thắng ${winnings.toLocaleString('vi-VN')} VND! 🎉`);
                notification.success({
                    message: 'Chúc mừng!',
                    description: `Bạn trúng jackpot: +${winnings.toLocaleString('vi-VN')} VND.`,
                });
            } else if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
                // Thắng: x2 tiền cược
                const winnings = stake * 2;
                await WalletServices.depositSystem(winnings);
                setResult(`Thắng! Bạn thắng ${winnings.toLocaleString('vi-VN')} VND! 🎉`);
                notification.success({
                    message: 'Chúc mừng!',
                    description: `Bạn thắng: +${winnings.toLocaleString('vi-VN')} VND.`,
                });
            } else {
                // Thua: rút tiền cược
                await WalletServices.withDrawSystem(stake);
                setResult(`Thua! Bạn mất ${stake.toLocaleString('vi-VN')} VND. 😢`);
                notification.error({
                    message: 'Chúc bạn may mắn lần sau!',
                    description: `Bạn mất ${stake.toLocaleString('vi-VN')} VND.`,
                });
            }
            onUpdateWallet(); // Làm mới số dư ví hệ thống
        } catch (error) {
            console.error('Error processing gambling result:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xử lý kết quả. Vui lòng thử lại.',
            });
        } finally {
            setSpinning(false);
        }
    };

    return (
        <Card
            className="mb-6 max-w-lg shadow-md border border-gray-200"
            title={
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCheckToSlot} />
                    <Text strong>GAMBLER</Text>
                </div>
            }
            extra={
                <Tooltip title="Chỉ dành cho admin TuanNguyen">
                    <Text className="text-gray-500 italic">Tiền ảo</Text>
                </Tooltip>
            }
        >
            <div className="p-4">
                <Space direction="vertical" size="large" className="w-full">
                    {/* Input số tiền cược */}
                    <div>
                        <Text className="block mb-2">Số tiền cược:</Text>
                        <InputNumber
                            min={0}
                            value={stake}
                            onChange={(value) => setStake(value)}
                            placeholder="Nhập số tiền cược"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            className="w-full"
                            size="large"
                            disabled={spinning}
                        />
                    </div>

                    {/* Hiển thị slot */}
                    <div className="flex justify-center space-x-4">
                        {slots.map((icon, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 flex items-center justify-center text-3xl bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
                            >
                                {icon}
                            </div>
                        ))}
                    </div>

                    {/* Nút quay */}
                    <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faCheckToSlot} />}
                        onClick={spinSlots}
                        loading={spinning}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                        size={'large'}
                        block
                    >
                        Quay
                    </Button>

                    {/* Kết quả */}
                    {result && (
                        <Text className={result.includes('JACKPOT') ? 'text-green-600' : 'text-red-600'} strong>
                            {result}
                        </Text>
                    )}
                </Space>
            </div>
        </Card>
    );
};