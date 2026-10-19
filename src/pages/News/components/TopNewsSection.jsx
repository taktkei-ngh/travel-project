import { motion } from 'framer-motion';
import { Divider, Spin, Empty, Button } from 'antd';
import { FireOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { TopNews } from './TopNews';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            when: 'beforeChildren',
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export const TopNewsSection = ({ blogs, loading, isSearching }) => {
    // Get top news: blogs with viewCount >= 50 or likeCount >= 50, limited to 4
    const getTopNews = () => {
        return blogs
            .filter((blog) => blog.viewCount >= 50 || blog.likeCount >= 50)
            .slice(0, 4);
    };

    const topNews = getTopNews();

    // Hide section during search
    if (isSearching) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FireOutlined className="text-red-500 text-lg mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Tin nổi bật</h2>
                    </div>
                    <Button type="link" className="text-orange-600 hover:text-orange-800">
                        Xem tất cả <ArrowRightOutlined />
                    </Button>
                </div>
                <Divider className="my-3 border-orange-200" />
            </motion.div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-8">
                        <Spin size="large" tip="Đang tải..." />
                    </div>
                ) : topNews.length === 0 ? (
                    <Empty description="Chưa có tin nổi bật" className="col-span-full py-8" />
                ) : (
                    topNews.map((article) => (
                        <motion.div key={article.id} variants={itemVariants}>
                            <TopNews news={article} />
                        </motion.div>
                    ))
                )}
            </motion.div>
        </section>
    );
};