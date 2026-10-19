import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import config from '~/config';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer
            className="bg-cover bg-center text-black"
            style={{ backgroundImage: `url(${config.imageConfig.getImage('1mBfO86XrrCLWz7HQwhHucdx-C70svPdl')})` }}
        >
            <div
                className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                {/* Về Chúng Tôi */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
                        {t('footer.ti1')}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                        {t('footer.ti2')}
                    </p>
                    <div className="flex space-x-3 mt-4 sm:mt-6">
                        <a
                            href="#"
                            className="text-white bg-orange-500 p-2 sm:p-3 rounded-full hover:bg-orange-600 transition duration-300"
                            aria-label="Twitter"
                        >
                            <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <a
                            href="https://www.facebook.com/profile.php?id=61574947133985"
                            className="text-white bg-orange-500 p-2 sm:p-3 rounded-full hover:bg-orange-600 transition duration-300"
                            aria-label="Facebook"
                        >
                            <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-white bg-orange-500 p-2 sm:p-3 rounded-full hover:bg-orange-600 transition duration-300"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                    </div>
                </div>

                {/* Thông Tin */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
                        {t('footer.ti3')}
                    </h3>
                    <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-90">
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti4')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti5')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti6')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti7')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti8')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti9')}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Kinh Nghiệm */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
                        {t('footer.ti10')}
                    </h3>
                    <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-90">
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti11')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti12')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti13')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti14')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti15')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                {t('footer.ti16')}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Có Câu Hỏi? */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
                        {t('footer.ti17')}
                    </h3>
                    <address className="not-italic text-xs sm:text-sm opacity-90 space-y-2 sm:space-y-3">
                        <p>{t('footer.ti18')}</p>
                        <p>
                            {t('footer.ti19')}{' '}
                            <a
                                href="tel:+080xxxxxx"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                +84 xxxx xxxx
                            </a>
                        </p>
                        <p>
                            Email:{' '}
                            <a
                                href="mailto:pacific.musketeers.tni@gmail.com"
                                className="hover:text-orange-400 transition duration-300"
                            >
                                pacific.musketeers.tni@gmail.com
                            </a>
                        </p>
                    </address>
                </div>
            </div>

            <div
                className="text-center text-black text-xs sm:text-sm mt-8 sm:mt-12 border-t border-gray-600 pt-4 sm:pt-6 opacity-80 px-4">
                <p>{t('footer.ti20')}</p>
                <p className="mt-1">{t('footer.ti21')}</p>
            </div>
        </footer>
    );
};

export default Footer;