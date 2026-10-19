import { StatusCard } from '~/pages/Admin/components/StatusCard';
import { ChartCard } from '~/pages/Admin/components/ChartCard';
import { StatisticSection } from '~/pages/Admin/sections/HomePage/Sections/StatisticSection';
import { StatisticTourSection } from '~/pages/Admin/sections/HomePage/Sections/StatisticTourSection';
import { useEffect, useState } from 'react';
import AdminServices from '~/services/AdminServices';
import Orb from '~/component/Animation/Orb';
import { Card, Input, Button, Spin, message } from 'antd';
import AiServices from '~/services/AiServices';
import ReactMarkdown from 'react-markdown';
import { QuestionCircleOutlined, MessageOutlined, DoubleRightOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';
import './HomePage.css';

export const HomePage = () => {
    const [revenueData, setRevenueData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]); // Lưu lịch sử chat
    const [isDataLoading, setIsDataLoading] = useState(true);

    // Hàm render trả lời dạng markdown
    const renderResponse = (response) => {
        const lines = response.split('\n');
        return lines.map((line, index) => (
            <div key={index} className={line.startsWith('- ') ? 'ml-4 mb-2' : 'mb-2'}>
                <ReactMarkdown
                    components={{
                        a: ({node, href, ...props}) => {
                            return <a href={href} {...props} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer"/>;
                        },
                        li: ({node, ...props}) => <li className="ml-4 list-disc" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-semibold mb-2" {...props} />,
                        code: ({node, ...props}) => <code className="bg-gray-100 px-1 rounded" {...props} />,
                    }}
                >
                    {line}
                </ReactMarkdown>
            </div>
        ));
    };

    // Danh sách gợi ý câu hỏi
    const suggestions = [
        'Tour nào rẻ nhất?',
        'Gợi ý tour ở Đà Nẵng?',
        'Tour phù hợp gia đình?',
        'Tour khởi hành tháng này?',
    ];

    useEffect(() => {
        setIsDataLoading(true);
        AdminServices.getBookingYearlyStats()
            .then((res) => {
                setRevenueData({
                    totalRevenue: res.data.totalRevenue,
                    revenueChange: res.data.revenueChange,
                    change: res.data.change,
                });
                setChartData(
                    res.data.monthlyRevenues.map((item) => ({
                        name: `Tháng ${item.month}`,
                        value: item.revenue,
                    })),
                );
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsDataLoading(false);
            });
    }, []);

    const handleAiQuery = async () => {
        if (!aiQuery.trim()) {
            message.warning('Vui lòng nhập câu hỏi!');
            return;
        }
        setIsLoading(true);
        try {
            const res = await AiServices.askAi(aiQuery);
            const newChat = { query: aiQuery, response: res };
            setChatHistory([...chatHistory, newChat]); // Thêm vào lịch sử
            setAiResponse(res);
            message.success('Đã nhận câu trả lời!');
        } catch (err) {
            const errorResponse = 'Lỗi khi xử lý câu hỏi. Vui lòng thử lại.';
            setChatHistory([...chatHistory, { query: aiQuery, response: errorResponse }]);
            setAiResponse(errorResponse);
            message.error('Có lỗi xảy ra!');
        } finally {
            setIsLoading(false);
            setAiQuery('');
        }
    };

    // Xử lý khi chọn gợi ý
    const handleSuggestionClick = (suggestion) => {
        setAiQuery(suggestion);
    };

    return (
        <div className="space-y-8 py-4">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
                {isDataLoading && <Spin tip="Đang tải dữ liệu..." />}
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatusCard
                    title="Tổng doanh thu năm nay"
                    totalAmount={revenueData.totalRevenue || 0}
                    change={revenueData.change || { value: 0, type: 'neutral' }}
                />
                <ChartCard
                    title="Doanh thu theo tháng"
                    totalAmount={revenueData.totalRevenue || 0}
                    change={revenueData.change || { value: 0, type: 'neutral' }}
                    chartData={chartData}
                />
                <Card
                    className="w-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden dashboard-card"
                    style={{ background: '#fff', minHeight: '400px' }}
                >
                    <Orb
                        hoverIntensity={0.5}
                        rotateOnHover={true}
                        hue={isLoading ? 180 : 0}
                        forceHoverState={isLoading}
                        className={`absolute top-0 left-0 w-full h-full opacity-30 ${isLoading ? 'animate-pulse scale-105' : ''}`}
                    />
                    <div className="relative z-10 p-5 flex flex-col h-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                                <QuestionCircleOutlined className="h-5 w-5" style={{ fontSize: '20px' }} />
                            </span>
                            Hỏi về Tour
                        </h3>

                        {/* Gợi ý câu hỏi */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestions.map((suggestion, index) => (
                                <Button
                                    key={index}
                                    type="text"
                                    className="text-blue-600 hover:bg-blue-50 rounded-full px-3 py-1 text-sm border border-blue-200"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>

                        {/* Lịch sử chat */}
                        <div className="flex-1 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner"
                             style={{ maxHeight: '220px' }}>
                            {chatHistory.length > 0 ? (
                                chatHistory.map((chat, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="text-sm text-blue-600 font-medium mb-1 flex items-center">
                                            <span className="bg-blue-100 p-1 rounded-full mr-1">
                                                <MessageOutlined className="h-3 w-3" />
                                            </span>
                                            {chat.query}
                                        </p>
                                        <div className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm overflow-y-auto border-l-4 border-blue-400"
                                           style={{ maxHeight: '150px' }}>
                                            <div className="markdown-content">
                                                {renderResponse(chat.response)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <MessageOutlined className="h-12 w-12 text-gray-300 mb-2" style={{ fontSize: '48px' }} />
                                    <p className="text-sm text-gray-500">Chưa có câu hỏi nào. Hãy thử một gợi ý hoặc nhập câu hỏi của bạn!</p>
                                </div>
                            )}
                            {isLoading && (
                                <div className="flex justify-center items-center absolute inset-0 bg-white bg-opacity-70 z-10">
                                    <div className="text-center">
                                        <Spin tip="Gemini đang xử lý..." size="large" />
                                        <p className="mt-2 text-blue-600 font-medium">Vui lòng đợi một chút...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Khung nhập câu hỏi */}
                        <div className="flex gap-2">
                            <Input
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="VD: Gợi ý tour ở Đà Nẵng?"
                                onPressEnter={handleAiQuery}
                                className="border-gray-300 focus:ring-blue-500 rounded-lg shadow-sm"
                                prefix={
                                    <QuestionCircleOutlined className="h-5 w-5 text-gray-400" style={{ fontSize: '20px' }} />
                                }
                            />
                            <Button
                                type="primary"
                                onClick={handleAiQuery}
                                disabled={isLoading || !aiQuery.trim()}
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                                icon={<DoubleRightOutlined className="h-5 w-5" style={{ fontSize: '16px' }} />}
                            >
                                Hỏi
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Statistics Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-orange-100 text-orange-600 p-1 rounded-md mr-2">
                        <BarChartOutlined className="h-5 w-5" style={{ fontSize: '20px' }} />
                    </span>
                    Thống kê doanh thu
                </h2>
                <StatisticSection />
            </div>

            {/* Tour Statistics Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-600 p-1 rounded-md mr-2">
                        <FileTextOutlined className="h-5 w-5" style={{ fontSize: '20px' }} />
                    </span>
                    Thống kê tour
                </h2>
                <StatisticTourSection />
            </div>
        </div>
    );
};
