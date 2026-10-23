
import React from 'react';
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaCompass,
    FaArrowRight,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const reduceMotion = useReducedMotion();

    const informationLinks = [
        t('footer.ti4'),
        t('footer.ti5'),
        t('footer.ti6'),
        t('footer.ti7'),
        t('footer.ti8'),
        t('footer.ti9'),
    ];

    const experienceLinks = [
        t('footer.ti11'),
        t('footer.ti12'),
        t('footer.ti13'),
        t('footer.ti14'),
        t('footer.ti15'),
        t('footer.ti16'),
    ];

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: reduceMotion ? 0 : 22,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: reduceMotion ? 0 : 0.55,
                ease: 'easeOut',
            },
        },
    };

    const socialLinks = [
        {
            label: 'Facebook',
            href: 'https://www.facebook.com/profile.php?id=61592129280513',
            icon: FaFacebookF,
        },
        {
            label: 'Instagram',
            href: 'https://www.instagram.com/takt.keii/',
            icon: FaInstagram,
        },
        {
            label: 'Twitter',
            href: '#',
            icon: FaTwitter,
        },
    ];

    const linkClass =
        'group inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-300 hover:text-orange-300';

    return (
        <footer
            id="site-footer"
            className="relative isolate overflow-hidden bg-[#0d1914] text-white"
        >
            {/* Subtle original background image */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-[0.12]"
                style={{ backgroundImage: "url('/img/bg.jpg')" }}
            />

            {/* Dark overlay keeps text readable */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0d1914]/95 via-[#13241b]/95 to-[#0a130f]/95" />

            {/* Decorative lights */}
            <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-400/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-96 w-96 rounded-full bg-orange-400/[0.06] blur-3xl" />

            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: reduceMotion ? 0 : 0.1,
                        },
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-10 pt-14 sm:grid-cols-2 sm:gap-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:gap-14 lg:px-10 lg:pt-20"
            >
                {/* Brand and social links */}
                <motion.div variants={fadeUp}>
                    <a
                        href="#top"
                        aria-label="ROAM về đầu trang"
                        className="group mb-5 inline-flex items-center gap-3"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400 text-[#13231b] shadow-lg shadow-orange-950/20 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
                            <FaCompass size={24} />
                        </span>

                        <span>
                            <span className="block text-2xl font-black tracking-[0.12em] text-white">
                                ROAM
                            </span>
                            <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.25em] text-orange-300">
                                Find your next journey
                            </span>
                        </span>
                    </a>

                    <h3 className="mb-3 text-base font-bold text-white sm:text-lg">
                        {t('footer.ti1')}
                    </h3>

                    <p className="max-w-sm text-sm leading-7 text-white/60">
                        {t('footer.ti2')}
                    </p>

                    <div className="mt-6 flex gap-3">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            const isPlaceholder = social.href === '#';

                            return (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    target={
                                        isPlaceholder ? undefined : '_blank'
                                    }
                                    rel={
                                        isPlaceholder
                                            ? undefined
                                            : 'noopener noreferrer'
                                    }
                                    whileHover={
                                        reduceMotion
                                            ? undefined
                                            : { y: -4, scale: 1.06 }
                                    }
                                    whileTap={
                                        reduceMotion
                                            ? undefined
                                            : { scale: 0.94 }
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition-colors duration-300 hover:border-orange-300/50 hover:bg-orange-400 hover:text-[#13231b]"
                                >
                                    <Icon size={17} />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Information links */}
                <motion.div variants={fadeUp}>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                        <span className="h-6 w-1 rounded-full bg-orange-400" />
                        {t('footer.ti3')}
                    </h3>

                    <ul className="space-y-3.5">
                        {informationLinks.map((label, index) => (
                            <li key={`${label}-${index}`}>
                                <a
                                    href={
                                        index === 5
                                            ? '#footer-contact'
                                            : '#'
                                    }
                                    className={linkClass}
                                >
                                    <FaArrowRight
                                        className="shrink-0 text-[10px] text-orange-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                                    />
                                    <span>{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Travel categories */}
                <motion.div variants={fadeUp}>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                        <span className="h-6 w-1 rounded-full bg-orange-400" />
                        {t('footer.ti10')}
                    </h3>

                  <ul className="space-y-3.5">
    {experienceLinks.map((label, index) => (
        <li key={`${label}-${index}`}>
            <button
                type="button"
                className={`w-full text-left flex items-center ${linkClass}`}
            >
                <FaArrowRight className="shrink-0 text-[10px] text-orange-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 mr-2" />
                <span>{label}</span>
            </button>
        </li>
    ))}
</ul>
                </motion.div>

                {/* Contact information */}
                <motion.div id="footer-contact" variants={fadeUp}>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                        <span className="h-6 w-1 rounded-full bg-orange-400" />
                        {t('footer.ti17')}
                    </h3>

                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-orange-300">
                                <FaMapMarkerAlt size={15} />
                            </span>
                            <div>
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                                    Địa điểm
                                </p>
                                <address className="not-italic text-sm leading-6 text-white/70">
                                    {t('footer.ti18')}
                                </address>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-orange-300">
                                <FaPhoneAlt size={14} />
                            </span>
                            <div>
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                                    Điện thoại
                                </p>
                                <a
                                    href="tel:+080xxxxxx"
                                    className="text-sm text-white/70 transition-colors hover:text-orange-300"
                                >
                                    {t('footer.ti19')} +84 xxxx xxxx
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-orange-300">
                                <FaEnvelope size={15} />
                            </span>
                            <div className="min-w-0">
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                                    Email
                                </p>
                                <a
                                    href="mailto:huykeii47@gmail.com"
                                    className="break-all text-sm text-white/70 transition-colors hover:text-orange-300"
                                >
                                    huykeii47@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom bar */}
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} ROAM Travel. All rights reserved.
                    </p>

                    <p>
                        Designed and developed by{' '}
                        <span className="font-bold tracking-wide text-orange-300">
                            Kei
                        </span>
                        .
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
