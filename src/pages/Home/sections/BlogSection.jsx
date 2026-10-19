import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlogServices from '~/services/BlogServices';
import Particles from '~/component/Animation/AnimatedUI/Background/Particles';
import { Divider, Spin } from 'antd';
import { Link } from 'react-router-dom';
import config from '~/config';
import { BlogCard } from '~/pages/Home/components/BlogCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            when: 'beforeChildren',
            staggerChildren: 0.2,
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

export const BlogSection = () => {
    const { t } = useTranslation();
    const ITEMS_PER_PAGE = 6;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [isMounted, setIsMounted] = useState(false); // Track if component is mounted

    const fetcherBlogs = async () => {
        setLoading(true);
        try {
            const response = await BlogServices.getAllBlogs();
            const published = response.data.filter((blog) => blog.status === 'PUBLISHED');
            const paginatedBlogs = published.slice(0, ITEMS_PER_PAGE);
            setBlogs(paginatedBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetcherBlogs();
        setIsMounted(true); // Mark component as mounted
    }, []);

    // Determine initial state for motion based on loading and blogs
    const getInitialState = () => {
        if (loading || !isMounted) return 'hidden'; // Start hidden if loading or not mounted
        if (blogs.length > 0) return false; // Skip initial animation if data exists
        return 'visible'; // Show immediately for no posts message
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <Particles
                particleColors={['#d66e03', '#e8874c']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={false}
                alphaParticles={false}
                disableRotation={false}
                className="-z-10 absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial={getInitialState()}
                        animate="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-12"
                    >
                        <Divider
                            className="font-bold uppercase"
                            style={{ borderColor: '#7cb305' }}
                            orientation="center"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-lime-500">
                                {t('index.ind5') || 'Những tin tức, blog mới nhất'}
                            </h2>
                            <p className="text-sm sm:text-lg text-gray-600 mt-2">
                                {t('index.ind6') || 'Theo dõi tin tức, blog để có những trải nghiệm thú vị'}
                            </p>
                        </Divider>
                    </motion.div>
                )}

                {/* Blog Cards */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial={getInitialState()}
                        animate="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <motion.div key={blog.slug} variants={itemVariants} className="h-full">
                                    <BlogCard blog={blog} />
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">
                                {t('blog.noPosts') || 'Hiện chưa có bài viết nào.'}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* View More Button */}
                {!loading && (
                    <motion.div
                        variants={containerVariants}
                        initial={getInitialState()}
                        animate="visible"
                        viewport={{ once: true }}
                        className="mt-12 text-center"
                    >
                        <Link
                            to={config.routes.news}
                            className="inline-block bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:from-green-600 hover:to-lime-600 transition-all duration-300"
                        >
                            <motion.span whileHover={{ x: 5 }} className="inline-block">
                                Xem thêm →
                            </motion.span>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};