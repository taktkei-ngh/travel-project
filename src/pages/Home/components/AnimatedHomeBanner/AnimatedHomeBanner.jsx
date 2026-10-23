import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const easing = [0.22, 1, 0.36, 1];

const titleLetter = {
    initial: {
        opacity: 0,
        y: 45,
        filter: 'blur(8px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
    },
};

const GlobeO = () => (
    <motion.span
        variants={titleLetter}
        initial="initial"
        animate="animate"
        transition={{
            duration: 1.15,
            delay: 0.48,
            ease: easing,
        }}
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{
            width: '0.77em',
            height: '0.77em',
            marginInline: '0.045em',
            alignSelf: 'center',
            color: '#8de8f2',
        }}
        aria-label="O"
    >
        <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            fill="none"
            aria-hidden="true"
        >
            {/* Globe silhouette */}
            <circle
                cx="50"
                cy="50"
                r="43"
                stroke="currentColor"
                strokeWidth="5.5"
            />

            {/* Longitude */}
            <ellipse
                cx="50"
                cy="50"
                rx="19"
                ry="43"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.75"
            />

            {/* Latitude */}
            <path
                d="M12 36 C32 44 68 44 88 36"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.7"
            />

            <path
                d="M12 64 C32 56 68 56 88 64"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.7"
            />

            {/* Journey route */}
            <motion.path
                d="M22 68 C32 29 57 74 76 30"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="90"
                initial={{ strokeDashoffset: 90, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                    duration: 1.1,
                    delay: 1.05,
                    ease: 'easeInOut',
                }}
            />

            {/* Destination marker */}
            <motion.circle
                cx="76"
                cy="30"
                r="5"
                fill="#ffffff"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.3,
                    delay: 1.95,
                    ease: 'backOut',
                }}
            />
        </svg>
    </motion.span>
);

export const AnimatedHomeBanner = () => {
    return (
        <section
            className="relative isolate flex min-h-[620px] items-center justify-center overflow-hidden bg-[#101820] text-white sm:min-h-[700px] lg:min-h-[calc(100vh-76px)]"
            aria-label="Discover your next journey"
        >
            {/* Background image */}
            <motion.div
                className="absolute inset-0 -z-30"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 2.5,
                    ease: easing,
                }}
                style={{
                    backgroundImage: "url('/img/banner/3.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Cinematic overlay */}
            <div
                className="absolute inset-0 -z-20"
                style={{
                    background: `
                        linear-gradient(
                            180deg,
                            rgba(5, 13, 20, 0.30) 0%,
                            rgba(5, 13, 20, 0.20) 35%,
                            rgba(5, 13, 20, 0.66) 100%
                        ),
                        linear-gradient(
                            90deg,
                            rgba(5, 13, 20, 0.30),
                            transparent 85%
                        )
                    `,
                }}
            />

            {/* Soft atmosphere */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 42%, transparent 10%, rgba(0,0,0,0.20) 100%)',
                }}
            />

            {/* Hero content */}
            <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 py-28 text-center sm:px-8 lg:py-32">
                {/* Brand eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.15,
                        ease: easing,
                    }}
                    className="mb-9 flex items-center justify-center gap-3 sm:mb-12"
                >
                    <span className="h-px w-7 bg-white/50 sm:w-12" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.30em] text-white/85 sm:text-[11px]">
                        TRAVEL WITH KEII
                    </span>

                    <span className="h-px w-7 bg-white/50 sm:w-12" />
                </motion.div>

                {/* Custom ROAM wordmark */}
                <div
                    className="flex items-center justify-center whitespace-nowrap"
                    style={{
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        fontSize: 'clamp(4rem, 15vw, 11.5rem)',
                        fontWeight: 300,
                        lineHeight: 0.95,
                        letterSpacing: '-0.075em',
                    }}
                    aria-label="ROAM"
                >
                    {['R'].map((letter) => (
                        <motion.span
                            key={letter}
                            variants={titleLetter}
                            initial="initial"
                            animate="animate"
                            transition={{
                                duration: 1.1,
                                delay: 0.24,
                                ease: easing,
                            }}
                            style={{ display: 'inline-block' }}
                        >
                            {letter}
                        </motion.span>
                    ))}

                    <GlobeO />

                    {['A', 'M'].map((letter, index) => (
                        <motion.span
                            key={letter}
                            variants={titleLetter}
                            initial="initial"
                            animate="animate"
                            transition={{
                                duration: 1.1,
                                delay: 0.62 + index * 0.14,
                                ease: easing,
                            }}
                            style={{ display: 'inline-block' }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </div>

                {/* Signature line */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 42, opacity: 1 }}
                    transition={{
                        duration: 0.7,
                        delay: 1.3,
                        ease: easing,
                    }}
                    className="mt-7 h-[2px] rounded-full bg-[#8de8f2]"
                />

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.85,
                        delay: 1.05,
                        ease: easing,
                    }}
                    className="mt-6 text-[10px] font-medium uppercase tracking-[0.20em] text-white sm:text-xs md:text-sm md:tracking-[0.32em]"
                    style={{
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    }}
                >
                    The world is yours to explore
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 1.2,
                        ease: easing,
                    }}
                    className="mt-5 max-w-md text-sm font-normal leading-7 text-white/75 sm:text-base sm:leading-8"
                >
                    Find new places, follow your curiosity, and make every
                    journey your own.
                </motion.p>

                {/* Explore button */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 1.35,
                        ease: easing,
                    }}
                    className="mt-9"
                >
                    <Link
                        to="/tour-trong-nuoc"
                        className="group inline-flex min-h-[50px] items-center justify-center gap-5 rounded-full border border-white/70 bg-white px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#101820] transition-all duration-300 hover:-translate-y-1 hover:border-[#8de8f2] hover:bg-[#8de8f2] sm:px-9 sm:text-xs"
                    >
                        Explore journeys

                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                </motion.div>

                {/* Bottom signature */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.9,
                        delay: 1.65,
                    }}
                    className="mt-20 flex items-center gap-3 sm:mt-24"
                >
                    <span className="h-px w-5 bg-white/35" />

                    <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-white/60 sm:text-[9px]">
                        Find your own way
                    </span>

                    <span className="h-px w-5 bg-white/35" />
                </motion.div>
            </div>
        </section>
    );
};