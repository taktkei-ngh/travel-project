import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '~/component/Layout/Navbar';
import { FloatButton, Tooltip } from 'antd';
import Footer from '~/component/Layout/Footer';
import { CommentOutlined } from '@ant-design/icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AiChatDrawer from '~/pages/Admin/components/AI/AiChatDrawer';
import IntroOverlay from '~/component/Layout/IntroOverlay';

const MainLayout = ({ children }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [siteRevealing, setSiteRevealing] = useState(false);

    const handleIntroReveal = useCallback(() => {
        setSiteRevealing(true);
    }, []);

    useEffect(() => {
        document.title = 'TRAVEL WITH KEII - Discover Your Next Journey';
    }, []);

    // Additional safeguard for the page if the intro fails.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setSiteRevealing(true);
        }, 7000);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#ffffff',
                color: '#080808',
                overflowX: 'clip',
            }}
        >
            {/* Main website slides upward behind the intro panels. */}
            <motion.div
                className="flex min-h-screen flex-col"
                initial={{
                    opacity: 0,
                    y: 64,
                }}
                animate={{
                    opacity: siteRevealing ? 1 : 0,
                    y: siteRevealing ? 0 : 64,
                }}
                transition={{
                    opacity: {
                        duration: 0.75,
                        ease: 'easeOut',
                    },
                    y: {
                        duration: 1.15,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    willChange: 'transform, opacity',
                }}
            >
                <Navbar />

                <main className="flex-grow">
                    {children}
                </main>

                <Footer />
            </motion.div>

            {/* Floating controls remain outside the animated page wrapper. */}
            <FloatButton.BackTop />

            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{
                    insetInlineEnd: 94,
                }}
                icon={<FontAwesomeIcon icon={faHeadset} />}
            >
                <Tooltip placement="left" title="Hỏi AI về tour">
                    <FloatButton
                        icon={<CommentOutlined />}
                        onClick={() => setChatOpen(true)}
                    />
                </Tooltip>
            </FloatButton.Group>

            <AiChatDrawer
                open={chatOpen}
                onClose={() => setChatOpen(false)}
            />

            <IntroOverlay onReveal={handleIntroReveal} />
        </div>
    );
};

export default MainLayout;