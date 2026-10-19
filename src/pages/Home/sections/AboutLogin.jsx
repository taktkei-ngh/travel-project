import { Button, Typography } from 'antd';
import Particles from '~/component/Animation/AnimatedUI/Background/Particles';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export const AboutLogin = () => {
    const navigate = useNavigate();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="relative py-16 overflow-hidden">
            <div className="flex items-center justify-center bg-white">
                <Particles
                    particleColors={['#ff7e1d', '#ff9a56']}
                    particleCount={250}
                    particleSpread={15}
                    speed={0.15}
                    particleBaseSize={120}
                    moveParticlesOnHover={true}
                    alphaParticles={true}
                    disableRotation={false}
                    className="-z-10 absolute top-0 left-0 w-full h-full object-cover"/>

                {/* Main card container */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex z-40 flex-col md:flex-row items-center max-w-5xl w-full mx-4 p-8 rounded-2xl 
                               shadow-[0_20px_50px_rgba(8,112,184,0.1)] bg-white/90 backdrop-blur-sm
                               border border-blue-100/50 overflow-hidden"
                >
                    {/* Text and Button section */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex-1 text-left pr-4"
                    >
                        <motion.div variants={itemVariants}>
                            <Title level={2} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 font-bold mb-3">
                                Đi nhiều hơn, chi ít hơn
                            </Title>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Title level={4} className="text-blue-600 mb-4 font-medium">
                                Đăng nhập để tiết kiệm
                            </Title>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Text className="text-gray-700 mb-8 block text-lg leading-relaxed">
                                Chỉ cần tìm kiếm Genius xanh lam để tiết kiệm 10% trở lên ở những chỗ nghỉ có tham gia
                            </Text>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="flex space-x-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-gradient-to-r from-blue-700 to-blue-500 border-0 hover:from-blue-800 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-6 h-auto"
                                    onClick={() => navigate(config.routes.login)}
                                >
                                    Đăng nhập
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="default"
                                    size="large"
                                    className="border-2 border-blue-500 text-blue-600 hover:border-blue-700 hover:text-blue-700 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-6 h-auto"
                                    onClick={() => navigate(config.routes.register)}
                                >
                                    Đăng ký
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Illustration section */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex-1 flex justify-center items-center mt-10 md:mt-0 md:pl-6"
                    >
                        <div className="relative w-full h-72">
                            {/* Background circle */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0.8 }}
                                animate={{ 
                                    scale: [0.8, 0.85, 0.8],
                                    opacity: [0.8, 1, 0.8]
                                }}
                                transition={{ 
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full transform translate-x-10 translate-y-10 shadow-xl" 
                            />

                            {/* Small yellow circle */}
                            <motion.div 
                                initial={{ y: 0 }}
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg" 
                            />

                            {/* Main illustration */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                    initial={{ rotate: 12 }}
                                    animate={{ rotate: [12, 8, 12] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-36 h-36 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-xl shadow-lg" 
                                />

                                {/* Chair */}
                                <motion.div 
                                    initial={{ y: 0 }}
                                    animate={{ y: [-3, 3, -3] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="w-14 h-14 bg-gradient-to-br from-blue-800 to-blue-600 rounded-full absolute bottom-10 right-20 shadow-md" 
                                />
                            </div>

                            {/* Text in illustration */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Text className="text-white font-bold text-xl text-center drop-shadow-md">
                                    Tìm kiếm <br /> chỗ ở yêu thích
                                </Text>
                            </div>

                            {/* Genius badge and gift */}
                            <div className="absolute top-0 right-0 flex items-center space-x-3">
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <Text className="text-white font-bold text-sm">Genius</Text>
                                </motion.div>

                                <motion.div 
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                    className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-md" 
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
