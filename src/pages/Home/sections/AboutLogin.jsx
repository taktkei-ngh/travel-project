
import React from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import Particles from '~/component/Animation/AnimatedUI/Background/Particles';
import { motion, useReducedMotion } from 'framer-motion';
import {
    FaArrowRight,
    FaCompass,
    FaHeart,
    FaMapMarkerAlt,
    FaPlane,
    FaSuitcaseRolling,
} from 'react-icons/fa';

export const AboutLogin = () => {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: reduceMotion ? 0 : 0.65,
                when: 'beforeChildren',
                staggerChildren: reduceMotion ? 0 : 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: {
            y: reduceMotion ? 0 : 22,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: reduceMotion ? 0 : 0.55,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="relative isolate overflow-hidden bg-[#f7f6f0] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
            {/* Background particles */}
            <Particles
                particleColors={['#f59e0b', '#10b981', '#d97706']}
                particleCount={90}
                particleSpread={12}
                speed={0.12}
                particleBaseSize={70}
                moveParticlesOnHover={true}
                alphaParticles={true}
                disableRotation={false}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40"
            />

            {/* Soft background lights */}
            <div className="pointer-events-none absolute -right-32 top-0 z-0 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-0 z-0 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

            {/* Main banner: replaces the existing AboutLogin design */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="relative z-10 mx-auto grid max-w-7xl items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#11271e] shadow-2xl shadow-emerald-950/15 lg:grid-cols-[1.05fr_0.95fr]"
            >
                {/* Decorative gradients inside the banner */}
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      x: [0, -20, 0],
                                      y: [0, 18, 0],
                                  }
                        }
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.05),transparent_38%)]" />
                </div>

                {/* Text and account actions */}
                <motion.div
                    variants={itemVariants}
                    className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2">
                        <FaCompass className="text-orange-300" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100 sm:text-xs">
                            ROAM · MEMBER BENEFITS
                        </span>
                    </div>

                    <motion.h2
                        variants={itemVariants}
                        className="max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                        Đi nhiều hơn,
                        <span className="mt-1 block text-orange-300">
                            chi ít hơn.
                        </span>
                    </motion.h2>

                    <motion.h3
                        variants={itemVariants}
                        className="mt-6 text-lg font-bold text-white sm:text-xl"
                    >
                        Đăng nhập để tiết kiệm
                    </motion.h3>

                    <motion.p
                        variants={itemVariants}
                        className="mt-3 max-w-xl text-sm leading-7 text-gray-300 sm:text-base"
                    >
                        Chỉ cần tìm kiếm Genius xanh lam để tiết kiệm 10% trở
                        lên ở những chỗ nghỉ có tham gia.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8 flex flex-wrap gap-3"
                    >
                        <motion.button
                            type="button"
                            whileHover={
                                reduceMotion ? undefined : { y: -3 }
                            }
                            whileTap={
                                reduceMotion ? undefined : { scale: 0.97 }
                            }
                            onClick={() => navigate(config.routes.login)}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-3 text-sm font-bold text-[#17271f] shadow-lg shadow-orange-950/15 transition-colors hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11271e]"
                        >
                            Đăng nhập
                            <FaArrowRight size={12} />
                        </motion.button>

                        <motion.button
                            type="button"
                            whileHover={
                                reduceMotion ? undefined : { y: -3 }
                            }
                            whileTap={
                                reduceMotion ? undefined : { scale: 0.97 }
                            }
                            onClick={() => navigate(config.routes.register)}
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[0.05] px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            Đăng ký
                        </motion.button>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-gray-400"
                    >
                        <span className="inline-flex items-center gap-2">
                            <FaHeart className="text-orange-300" />
                            Lưu hành trình yêu thích
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <FaMapMarkerAlt className="text-orange-300" />
                            Khám phá điểm đến mới
                        </span>
                    </motion.div>
                </motion.div>

                {/* Animated travel graphic */}
                <motion.div
                    variants={itemVariants}
                    className="relative mx-auto flex h-[320px] w-full max-w-[440px] items-center justify-center px-4 sm:h-[370px] lg:h-[430px] lg:max-w-none"
                >
                    {/* Orbit rings */}
                    <div className="absolute h-[205px] w-[205px] rounded-full border border-dashed border-emerald-100/20 sm:h-[260px] sm:w-[260px] lg:h-[290px] lg:w-[290px]" />
                    <div className="absolute h-[155px] w-[155px] rounded-full border border-white/10 sm:h-[200px] sm:w-[200px]" />

                    {/* Plane moves around the orbit */}
                    <motion.div
                        className="absolute inset-0 flex items-start justify-center"
                        animate={
                            reduceMotion ? undefined : { rotate: 360 }
                        }
                        transition={{
                            duration: 24,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <div className="mt-7 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#1b3b2d] text-orange-300 shadow-lg sm:mt-9">
                            <FaPlane size={18} />
                        </div>
                    </motion.div>

                    {/* Central travel illustration */}
                    <motion.div
                        className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#315943] to-[#173426] shadow-2xl shadow-black/25 sm:h-44 sm:w-44"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      y: [0, -8, 0],
                                      rotate: [0, 1.5, 0],
                                  }
                        }
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400 text-[#17271f] shadow-lg sm:h-16 sm:w-16">
                            <FaSuitcaseRolling size={26} />
                        </div>
                        <span className="text-sm font-black tracking-[0.2em] text-white">
                            ROAM
                        </span>
                        <span className="mt-1 text-[9px] uppercase tracking-[0.15em] text-emerald-100/65">
                            Explore more
                        </span>
                    </motion.div>

                    {/* Floating destination card */}
                    <motion.div
                        className="absolute left-2 top-7 z-20 rounded-2xl border border-white/15 bg-[#203b2e]/95 p-3 shadow-xl backdrop-blur-md sm:left-5 sm:top-10 sm:p-4"
                        animate={
                            reduceMotion ? undefined : { y: [0, -7, 0] }
                        }
                        transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/15 text-orange-300">
                                <FaMapMarkerAlt size={15} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white sm:text-xs">
                                    Your next destination
                                </p>
                                <p className="mt-1 text-[9px] text-gray-400">
                                    Waiting to be discovered
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating favorite card */}
                    <motion.div
                        className="absolute bottom-7 right-1 z-20 rounded-2xl border border-white/15 bg-[#203b2e]/95 p-3 shadow-xl backdrop-blur-md sm:bottom-9 sm:right-4 sm:p-4"
                        animate={
                            reduceMotion
                                ? undefined
                                : { y: [0, 8, 0], rotate: [0, 1.5, 0] }
                        }
                        transition={{
                            duration: 4.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300">
                                <FaHeart size={15} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white sm:text-xs">
                                    Your favorites
                                </p>
                                <p className="mt-1 text-[9px] text-gray-400">
                                    Keep your ideas close
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Small decorative lights */}
                    <motion.span
                        className="absolute right-12 top-5 h-3 w-3 rounded-full bg-orange-300/80"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      scale: [1, 1.5, 1],
                                      opacity: [0.45, 1, 0.45],
                                  }
                        }
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <motion.span
                        className="absolute bottom-12 left-9 h-2 w-2 rounded-full bg-emerald-200"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      scale: [1, 1.7, 1],
                                      opacity: [0.4, 1, 0.4],
                                  }
                        }
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Main graphic caption */}
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                            Tìm kiếm chỗ ở yêu thích
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};
