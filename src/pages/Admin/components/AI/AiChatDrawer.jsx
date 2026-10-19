import {useEffect, useState} from 'react';
import Orb from '~/component/Animation/Orb';
import {Input, Button, Spin, message, Drawer, Collapse, List} from 'antd';
import ReactMarkdown from 'react-markdown';
import AiServices from '~/services/AiServices';
import DestinationServices from '~/services/DestinationServices';
import {Link} from "react-router-dom";
import '~/pages/Admin/sections/HomePage/HomePage.css';
import { MessageOutlined, CheckCircleOutlined, QuestionCircleOutlined, DoubleRightOutlined } from '@ant-design/icons';

const {Panel} = Collapse;

const AiChatDrawer = ({open, onClose}) => {
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState(() => {
        const saved = localStorage.getItem('userChatHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [suggestions, setSuggestions] = useState([
        'Tour nào giá rẻ?',
        'Tour cho cặp đôi?',
        'Tôi có booking nào?',
    ]);
    const [orbHue, setOrbHue] = useState(270); // Màu tím mặc định

    useEffect(() => {
        DestinationServices.getTopDestinations()
            .then((res) => {
                const dynamicSuggestions = res.map((dest) => `Tour đi ${dest.city}?`);
                setSuggestions([
                    'Tour nào giá rẻ?',
                    ...dynamicSuggestions.slice(0, 3),
                    'Tour cho cặp đôi?',
                    'Tôi có booking nào?',
                    'Tour nào được đặt nhiều?',
                    'Chi tiết tour Đà Nẵng 3N2Đ?',
                ]);
            })
            .catch((err) => {
                console.error('Lỗi khi lấy top destinations:', err);
                setSuggestions([
                    'Tour nào giá rẻ?',
                    'Tour đi Đà Lạt?',
                    'Tour đi Đà Nẵng?',
                    'Tour đi Hà Nội?',
                    'Tour cho cặp đôi?',
                    'Tôi có booking nào?',
                    'Tour nào được đặt nhiều?',
                    'Chi tiết tour Đà Nẵng 3N2Đ?',
                ]);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('userChatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    // Cuộn tự động đến câu trả lời mới
    useEffect(() => {
        const chatContainer = document.querySelector('.chat-history');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chatHistory]);

    const handleAiQuery = async () => {
        if (!aiQuery.trim()) {
            message.warning('Vui lòng nhập câu hỏi!');
            return;
        }
        setIsLoading(true);
        try {
            const responseText = await AiServices.askAi(aiQuery);
            const newChat = {query: aiQuery, response: responseText};
            setChatHistory([...chatHistory, newChat]);
            setAiResponse(responseText);
            setOrbHue(Math.floor(Math.random() * 360));
            if (responseText.includes('không có tour') || responseText.includes('Chưa có dữ liệu')) {
                message.warning('Hiện tại không có dữ liệu tour. Hãy thử câu hỏi khác!');
            } else if (responseText.includes('dữ liệu nội bộ')) {
                message.warning('Câu hỏi này không phù hợp. Hãy hỏi về tour du lịch!');
            } else {
                message.success('Câu trả lời đã sẵn sàng!');
            }
        } catch (err) {
            const errorResponse = 'Lỗi khi xử lý câu hỏi. Vui lòng thử lại.';
            setChatHistory([...chatHistory, {query: aiQuery, response: errorResponse}]);
            setAiResponse(errorResponse);
            setOrbHue(0);
            message.error('Có lỗi xảy ra!');
        } finally {
            setIsLoading(false);
            setAiQuery('');
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setAiQuery(suggestion);
    };

    const clearChatHistory = () => {
        setChatHistory([]);
        localStorage.removeItem('userChatHistory');
        setAiResponse('');
        message.success('Đã xóa lịch sử chat!');
    };

    // Hàm render trả lời dạng chuỗi, giữ nguyên gạch đầu dòng
    const renderResponse = (response) => {
        const lines = response.split('\n');
        return lines.map((line, index) => (
            <div key={index} className={line.startsWith('- ') ? 'ml-4 mb-2' : 'mb-2'}>
                <ReactMarkdown
                    components={{
                        a: ({node, href, ...props}) => {
                            return <Link onClick={() => onClose()} to={href} {...props} className="text-blue-600 underline"/>;
                        },
                        li: ({node, ...props}) => <li className="ml-4 list-disc" {...props} />,
                    }}
                >
                    {line}
                </ReactMarkdown>
            </div>
        ));
    };

    return (
        <Drawer
            title={
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Trợ lý du lịch AI</span>
                    <Button
                        danger
                        className="text-red-500 hover:bg-red-50 rounded-full"
                        onClick={clearChatHistory}
                    >
                        Xóa lịch sử
                    </Button>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={450}
            styles={{
                body: {padding: '20px', background: '#f9fafb'},
                header: {borderBottom: '1px solid #e5e7eb', padding: '16px 20px', background: '#ffffff'},
            }}
        >
            <div className="relative flex flex-col h-full">
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    hue={isLoading ? 180 : orbHue}
                    forceHoverState={isLoading}
                    className={`absolute top-0 left-0 w-full h-full opacity-10 ${isLoading ? 'animate-pulse scale-105' : ''}`}
                />
                <div className="relative z-10 flex flex-col h-full gap-4">
                    {/* Gợi ý trong Collapse */}
                    <Collapse
                        defaultActiveKey={['1']}
                        bordered={false}
                        expandIconPosition="right"
                        className="bg-white rounded-lg shadow-sm"
                    >
                        <Panel
                            header={<span className="text-sm font-medium text-gray-700">Gợi ý câu hỏi</span>}
                            key="1"
                            className="p-0"
                        >
                            <List
                                dataSource={suggestions}
                                renderItem={(suggestion, index) => (
                                    <List.Item
                                        className="border-none px-4 py-1 hover:bg-gray-50 cursor-pointer rounded-md"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <span className="text-sm text-purple-600 hover:text-purple-800">
                                            {suggestion}
                                        </span>
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse>

                    {/* Lịch sử chat */}
                    <div
                        className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 overflow-y-auto chat-history"
                        style={{maxHeight: '60vh', scrollBehavior: 'smooth'}}
                    >
                        {chatHistory.length > 0 ? (
                            chatHistory.map((chat, index) => (
                                <div key={index} className="mb-4">
                                    <p className="text-sm text-purple-600 font-medium mb-1 flex items-center">
                                        <span className="bg-purple-100 p-1 rounded-full mr-1">
                                            <MessageOutlined className="h-3 w-3" />
                                        </span>
                                        {chat.query}
                                    </p>
                                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg shadow-inner border-l-4 border-purple-400">
                                        <p className="font-medium mb-2 text-purple-700 flex items-center">
                                            <span className="bg-purple-100 p-1 rounded-full mr-1">
                                                <CheckCircleOutlined className="h-3 w-3" />
                                            </span>
                                            Trả lời:
                                        </p>
                                        <div className="markdown-content">
                                            {renderResponse(chat.response)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <MessageOutlined className="h-12 w-12 text-purple-200 mb-2" style={{ fontSize: '48px' }} />
                                <p className="text-sm text-gray-500">Chưa có câu hỏi nào. Hãy thử một gợi ý hoặc nhập câu hỏi của bạn!</p>
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex justify-center items-center absolute inset-0 bg-white bg-opacity-70 z-10">
                                <div className="text-center">
                                    <Spin tip="Đang tìm câu trả lời..." size="large" />
                                    <p className="mt-2 text-purple-600 font-medium">Vui lòng đợi một chút...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input và nút Hỏi */}
                    <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                        <div className="flex gap-2">
                            <Input
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="VD: Tour đi Đà Lạt giá bao nhiêu?"
                                onPressEnter={handleAiQuery}
                                className="border-gray-300 focus:ring-purple-500 rounded-lg shadow-sm"
                                prefix={
                                    <QuestionCircleOutlined className="h-5 w-5 text-purple-400" style={{ fontSize: '20px' }} />
                                }
                            />
                            <Button
                                type="primary"
                                onClick={handleAiQuery}
                                disabled={isLoading || !aiQuery.trim()}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-sm"
                                icon={<DoubleRightOutlined className="h-5 w-5" style={{ fontSize: '16px' }} />}
                            >
                                Hỏi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default AiChatDrawer;
