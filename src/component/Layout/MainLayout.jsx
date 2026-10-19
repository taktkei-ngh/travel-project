import { Navbar } from '~/component/Layout/Navbar';
import { FloatButton, Tooltip } from 'antd';
import Footer from '~/component/Layout/Footer';
import { CommentOutlined } from '@ant-design/icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import AiChatDrawer from '~/pages/Admin/components/AI/AiChatDrawer';

const MainLayout = ({ children }) => {
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        document.title = 'Pacific Travel';
    }, []);

    return (
        <div className={'flex flex-col min-h-screen'}>
            {/* navbar */}
            <FloatButton.BackTop />
            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{
                    insetInlineEnd: 94,
                }}
                icon={<FontAwesomeIcon icon={faHeadset} />}
            >
                <Tooltip placement={"left"} title={"Hỏi AI về tour"}>
                    <FloatButton
                        icon={<CommentOutlined />}
                        onClick={() => setChatOpen(true)}
                    />
                </Tooltip>
            </FloatButton.Group>
            <Navbar />
            {/* Main Content */}
            <main className={'flex-grow'}>{children}</main>
            {/* Footer */}
            <Footer />
            {/* AI Chat Drawer */}
            <AiChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
};

export default MainLayout;