import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const BAR_COUNT = 5;

export default function IntroOverlay({ onReveal }) {
    const [visible, setVisible] = useState(true);
    const [revealing, setRevealing] = useState(false);

    const textControls = useAnimationControls();
    const hasRevealed = useRef(false);

    // Load the same font family used by the reference portfolio.
    useEffect(() => {
        const fontId = 'keii-intro-inter-font';

        if (!document.getElementById(fontId)) {
            const link = document.createElement('link');

            link.id = fontId;
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

            document.head.appendChild(link);
        }
    }, []);

    // Prevent scrolling while the intro is visible.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = previousOverflow;
        }

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [visible]);

    useEffect(() => {
        let cancelled = false;
        const timers = new Set();

        const wait = (duration) =>
            new Promise((resolve) => {
                const timer = window.setTimeout(() => {
                    timers.delete(timer);
                    resolve();
                }, duration);

                timers.add(timer);
            });

        const revealWebsite = () => {
            if (hasRevealed.current) return;

            hasRevealed.current = true;

            // Move the website into position as the panels open.
            onReveal?.();
            setRevealing(true);
        };

        const runIntro = async () => {
            // 1. Text rises into view.
            await textControls.start({
                opacity: 1,
                y: 0,
                transition: {
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                },
            });

            if (cancelled) return;

            // 2. Hold the title.
            await wait(1500);

            if (cancelled) return;

            // 3. Text fades and moves upward.
            await textControls.start({
                opacity: 0,
                y: -50,
                transition: {
                    duration: 0.5,
                    ease: [0.55, 0, 1, 0.45],
                },
            });

            if (cancelled) return;

            // 4. Reveal the website with the five panels.
            revealWebsite();
        };

        // Safety fallback so the page cannot remain hidden indefinitely.
        const failsafe = window.setTimeout(() => {
            if (cancelled) return;

            revealWebsite();
            setVisible(false);
        }, 7500);

        runIntro().catch((error) => {
            console.error('Intro animation error:', error);

            if (!cancelled) {
                revealWebsite();
                setVisible(false);
            }
        });

        return () => {
            cancelled = true;
            window.clearTimeout(failsafe);
            timers.forEach((timer) => window.clearTimeout(timer));
            textControls.stop();
        };
    }, [onReveal, textControls]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0"
            aria-label="Welcome BY KEI intro"
            style={{
                zIndex: 99999,
                overflow: 'hidden',
                pointerEvents: 'auto',
            }}
        >
            {/* Five white panels shrink upward, revealing the website below. */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {Array.from({ length: BAR_COUNT }, (_, index) => (
                    <motion.div
                        key={index}
                        initial={{ height: '100%' }}
                        animate={{
                            height: revealing ? '0%' : '100%',
                        }}
                        transition={{
                            height: {
                                duration: 0.8,
                                delay: revealing ? index * 0.1 : 0,
                                ease: [0.76, 0, 0.24, 1],
                            },
                        }}
                        onAnimationComplete={() => {
                            if (
                                revealing &&
                                index === BAR_COUNT - 1
                            ) {
                                setVisible(false);
                            }
                        }}
                        style={{
                            flex: '1 1 20%',
                            minWidth: 0,
                            height: '100%',
                            background: '#ffffff',
                            marginRight: '-1px',
                            willChange: 'height',
                        }}
                    />
                ))}
            </div>

            {/* Minimal black text using Inter, matching your chosen design. */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 50,
                }}
                animate={textControls}
                style={{
                    position: 'absolute',
                    zIndex: 2,
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    background: 'transparent',
                    pointerEvents: 'none',
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        color: '#080808',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 'clamp(34px, 6vw, 76px)',
                        lineHeight: 1.15,
                        fontWeight: 300,
                        letterSpacing: '-0.065em',
                    }}
                >
                    WELCOME
                </h1>
            </motion.div>
        </div>
    );
}