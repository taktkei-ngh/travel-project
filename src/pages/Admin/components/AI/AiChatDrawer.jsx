
import { useEffect, useState } from 'react';
import Orb from '~/component/Animation/Orb';
import {
    Input,
    Button,
    Spin,
    message,
    Drawer,
    Collapse,
    List,
} from 'antd';
import ReactMarkdown from 'react-markdown';
import AiServices from '~/services/AiServices';
import DestinationServices from '~/services/DestinationServices';
import { Link } from 'react-router-dom';
import '~/pages/Admin/sections/HomePage/HomePage.css';
import {
    MessageOutlined,
    CheckCircleOutlined,
    QuestionCircleOutlined,
    DoubleRightOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

const DEFAULT_SUGGESTIONS = [
    'Tour nào giá rẻ?',
    'Tour cho cặp đôi?',
    'Tôi có booking nào?',
    'Tour nào được đặt nhiều?',
    'Chi tiết tour Đà Nẵng 3N2Đ?',
    'Tour đi Đà Nẵng?',
    'Tour đi Hà Nội?',
];

const readChatHistory = () => {
    try {
        const saved = localStorage.getItem('userChatHistory');

        if (!saved) return [];

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Không thể đọc lịch sử chat:', error);
        return [];
    }
};

const getDestinationsArray = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.destinations)) {
        return response.destinations;
    }

    if (Array.isArray(response?.data?.destinations)) {
        return response.data.destinations;
    }

    return [];
};

const getAnswerText = (response) => {
    if (typeof response === 'string') {
        return response;
    }

    if (typeof response?.answer === 'string') {
        return response.answer;
    }

    if (typeof response?.response === 'string') {
        return response.response;
    }

    if (typeof response?.message === 'string') {
        return response.message;
    }

    if (typeof response?.text === 'string') {
        return response.text;
    }

    return 'Trợ lý chưa trả về nội dung. Vui lòng thử lại.';
};

const AiChatDrawer = ({ open, onClose }) => {
    const [aiQuery, setAiQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState(readChatHistory);
    const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
    const [orbHue, setOrbHue] = useState(270);

    // Tải địa điểm gợi ý từ API.
    useEffect(() => {
        let isMounted = true;

        const loadTopDestinations = async () => {
            try {
                const response =
                    await DestinationServices.getTopDestinations();

                if (!isMounted) return;

                const destinations = getDestinationsArray(response);

                const dynamicSuggestions = destinations
                    .map((destination) => {
                        const city =
                            destination?.city ??
                            destination?.name ??
                            destination?.location ??
                            destination?.title;

                        return city ? `Tour đi ${city}?` : null;
                    })
                    .filter(Boolean);

                const combinedSuggestions = [
                    'Tour nào giá rẻ?',
                    ...dynamicSuggestions.slice(0, 3),
                    ...DEFAULT_SUGGESTIONS.slice(1),
                ];

                setSuggestions([...new Set(combinedSuggestions)]);
            } catch (error) {
                if (!isMounted) return;

                console.error(
                    'Lỗi khi lấy top destinations:',
                    error
                );

                // Vẫn dùng gợi ý mặc định nếu API gặp lỗi.
                setSuggestions(DEFAULT_SUGGESTIONS);
            }
        };

        loadTopDestinations();

        return () => {
            isMounted = false;
        };
    }, []);

    // Lưu lịch sử chat.
    useEffect(() => {
        try {
            localStorage.setItem(
                'userChatHistory',
                JSON.stringify(chatHistory)
            );
        } catch (error) {
            console.error('Không thể lưu lịch sử chat:', error);
        }
    }, [chatHistory]);

    // Cuộn xuống câu trả lời mới nhất.
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
        const question = aiQuery.trim();

        if (!question) {
            message.warning('Vui lòng nhập câu hỏi!');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await AiServices.askAi(question);
            const responseText = getAnswerText(response);

            setChatHistory((previousHistory) => [
                ...previousHistory,
                {
                    query: question,
                    response: responseText,
                },
            ]);

            setOrbHue(Math.floor(Math.random() * 360));

            if (
                responseText.includes('không có tour') ||
                responseText.includes('Chưa có dữ liệu')
            ) {
                message.warning(
                    'Hiện tại không có dữ liệu tour. Hãy thử câu hỏi khác!'
                );
            } else if (responseText.includes('dữ liệu nội bộ')) {
                message.warning(
                    'Câu hỏi này không phù hợp. Hãy hỏi về tour du lịch!'
                );
            } else {
                message.success('Câu trả lời đã sẵn sàng!');
            }
        } catch (error) {
            console.error('Lỗi khi hỏi trợ lý AI:', error);

            const errorResponse =
                'Lỗi khi xử lý câu hỏi. Vui lòng kiểm tra kết nối và thử lại.';

            setChatHistory((previousHistory) => [
                ...previousHistory,
                {
                    query: question,
                    response: errorResponse,
                },
            ]);

            setOrbHue(0);
            message.error('Không thể xử lý câu hỏi lúc này.');
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

        try {
            localStorage.removeItem('userChatHistory');
        } catch (error) {
            console.error('Không thể xóa lịch sử chat:', error);
        }

        message.success('Đã xóa lịch sử chat!');
    };

    // Hiển thị câu trả lời Markdown.
    const renderResponse = (response) => {
        const text =
            typeof response === 'string'
                ? response
                : String(response ?? '');

        return text.split('\n').map((line, index) => (
            <div
                key={index}
                className={
                    line.startsWith('- ')
                        ? 'ml-4 mb-2'
                        : 'mb-2'
                }
            >
                <ReactMarkdown
                    components={{
                        a: ({ node, href, children, ...props }) => {
                            if (!href) {
                                return <span {...props}>{children}</span>;
                            }

                            if (/^https?:\/\//i.test(href)) {
                                return (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        {...props}
                                    >
                                        {children}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    to={href}
                                    onClick={onClose}
                                    {...props}
                                >
                                    {children}
                                </Link>
                            );
                        },
                        li: ({ node, ...props }) => (
                            <li className="ml-4 list-disc" {...props} />
                        ),
                    }}
                >
                    {line || ' '}
                </ReactMarkdown>
            </div>
        ));
    };

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold text-gray-800">
                        Trợ lý du lịch AI
                    </span>

                    <Button
                        danger
                        className="rounded-full text-red-500 hover:bg-red-50"
                        onClick={clearChatHistory}
                        disabled={chatHistory.length === 0}
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
                body: {
                    padding: 20,
                    background: '#f9fafb',
                },
                header: {
                    borderBottom: '1px solid #e5e7eb',
                    padding: '16px 20px',
                    background: '#ffffff',
                },
            }}
        >
            <div className="relative flex h-full flex-col">
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover
                    hue={isLoading ? 180 : orbHue}
                    forceHoverState={isLoading}
                    className={`absolute left-0 top-0 h-full w-full opacity-10 ${
                        isLoading ? 'animate-pulse scale-105' : ''
                    }`}
                />

                <div className="relative z-10 flex h-full flex-col gap-4">
                    {/* Gợi ý câu hỏi */}
                    <Collapse
                        defaultActiveKey={['1']}
                        bordered={false}
                        expandIconPosition="right"
                        className="rounded-lg bg-white shadow-sm"
                    >
                        <Panel
                            header={
                                <span className="text-sm font-medium text-gray-700">
                                    Gợi ý câu hỏi
                                </span>
                            }
                            key="1"
                        >
                            <List
                                dataSource={suggestions}
                                renderItem={(suggestion, index) => (
                                    <List.Item
                                        key={`${suggestion}-${index}`}
                                        className="cursor-pointer rounded-md border-none px-4 py-1 hover:bg-gray-50"
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }
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
                        className="chat-history relative flex-1 overflow-y-auto rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                        style={{
                            maxHeight: '60vh',
                            scrollBehavior: 'smooth',
                        }}
                    >
                        {chatHistory.length > 0 ? (
                            chatHistory.map((chat, index) => (
                                <div key={index} className="mb-4">
                                    <p className="mb-1 flex items-center text-sm font-medium text-purple-600">
                                        <span className="mr-1 rounded-full bg-purple-100 p-1">
                                            <MessageOutlined className="h-3 w-3" />
                                        </span>
                                        {chat.query}
                                    </p>

                                    <div className="rounded-lg border-l-4 border-purple-400 bg-gray-50 p-3 text-sm text-gray-700 shadow-inner">
                                        <p className="mb-2 flex items-center font-medium text-purple-700">
                                            <span className="mr-1 rounded-full bg-purple-100 p-1">
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
                            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                <MessageOutlined
                                    className="mb-2 text-purple-200"
                                    style={{ fontSize: 48 }}
                                />

                                <p className="text-sm text-gray-500">
                                    Chưa có câu hỏi nào. Hãy thử một gợi ý
                                    hoặc nhập câu hỏi của bạn!
                                </p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                                <div className="text-center">
                                    <Spin
                                        tip="Đang tìm câu trả lời..."
                                        size="large"
                                    />
                                    <p className="mt-2 font-medium text-purple-600">
                                        Vui lòng đợi một chút...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ô nhập câu hỏi */}
                    <div className="sticky bottom-0 rounded-lg border border-gray-100 bg-white p-4 shadow-md">
                        <div className="flex gap-2">
                            <Input
                                value={aiQuery}
                                onChange={(event) =>
                                    setAiQuery(event.target.value)
                                }
                                placeholder="VD: Tour đi Đà Lạt giá bao nhiêu?"
                                onPressEnter={handleAiQuery}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-purple-500"
                                prefix={
                                    <QuestionCircleOutlined
                                        className="text-purple-400"
                                        style={{ fontSize: 20 }}
                                    />
                                }
                                disabled={isLoading}
                            />

                            <Button
                                type="primary"
                                onClick={handleAiQuery}
                                disabled={isLoading || !aiQuery.trim()}
                                className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm hover:from-purple-600 hover:to-purple-700"
                                icon={
                                    <DoubleRightOutlined
                                        style={{ fontSize: 16 }}
                                    />
                                }
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
