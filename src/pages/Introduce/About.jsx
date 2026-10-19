import React from 'react';
import {
    FaCampground,
    FaCity,
    FaHiking,
    FaMapMarkedAlt,
    FaMountain,
    FaShip,
    FaStar,
    FaUmbrellaBeach,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import config from '~/config';

const About = () => {
  const { t } = useTranslation();
  const services = [
    {
      icon: <FaHiking className="text-white text-3xl" />,
      title: t("about.ti1"),
      description: t("about.ti2"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaUmbrellaBeach className="text-white text-3xl" />,
      title: t("about.ti3"),
      description: t("about.ti4"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaCity className="text-white text-3xl" />,
      title: t("about.ti5"),
      description: t("about.ti6"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaMapMarkedAlt className="text-white text-3xl" />,
      title: t("about.ti7"),
      description: t("about.ti8"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaMountain className="text-white text-3xl" />,
      title: t("about.ti9"),
      description: t("about.ti10"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaShip className="text-white text-3xl" />,
      title: t("about.ti11"),
      description: t("about.ti12"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaCampground className="text-white text-3xl" />,
      title: t("about.ti13"),
      description: t("about.ti14"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      icon: <FaCampground className="text-white text-3xl" />,
      title: t("about.ti15"),
      description: t("about.ti16"),
      image: config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Dương Thiên Lý",
      review: t("about.ti17"),
      rating: 5,
      avatar:config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      name: "Trần Thanh Tâm",
      review: t("about.ti18"),
      rating: 4.5,
      avatar:config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      name: "Lê Văn Chung",
      review: t("about.ti19"),
      rating: 5,
      avatar:config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      name: "Phạm Thu Hường",
      review: t("about.ti20"),
      rating: 4.8,
      avatar:config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      name: "Bùi Quốc Huy",
      review: t("about.ti21"),
      rating: 5,
      avatar:config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    },
    {
      name: "Nguyễn Đình Tuấn",
      review: t("about.ti22"),
      rating: 5,
      avatar:config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')
    }
  ];

  return (
    <div className="bg-gray-100 py-16 px-6 lg:px-20">
      <h2 className="text-4xl font-bold text-black text-center">{t("about.ti23")}</h2>
      {/* Giới thiệu */}
      <div className="container mx-auto px-6 py-12">
  <div className="flex flex-col lg:flex-row items-center">
    {/* Danh sách hình ảnh (bên trái) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-1/2">
      {/* Hoạt động */}
      <div className="relative bg-blue-700 text-white p-6 rounded-lg overflow-hidden shadow-lg">
        <img src={config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')} alt="Hoạt động" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative">
          <div className="bg-orange-500 p-3 rounded-lg inline-block mb-4">
            <i className="fas fa-water text-white text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold">{t("about.ti24")}</h3>
          <p>{t("about.ti25")}</p>
        </div>
      </div>

      {/* Sắp xếp chuyến đi */}
      <div className="relative bg-green-700 text-white p-6 rounded-lg overflow-hidden shadow-lg">
        <img src={config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')} alt="Sắp xếp chuyến đi" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative">
          <div className="bg-orange-500 p-3 rounded-lg inline-block mb-4">
            <i className="fas fa-plane text-white text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold">{t("about.ti26")}</h3>
          <p>M{t("about.ti25")}</p>
        </div>
      </div>

      {/* Hướng dẫn viên riêng */}
      <div className="relative bg-teal-700 text-white p-6 rounded-lg overflow-hidden shadow-lg">
        <img src={config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')} alt="Hướng dẫn viên riêng" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative">
          <div className="bg-orange-500 p-3 rounded-lg inline-block mb-4">
            <i className="fas fa-user text-white text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold">{t("about.ti27")}</h3>
          <p>{t("about.ti25")}</p>
        </div>
      </div>

      {/* Quản lý địa điểm */}
      <div className="relative bg-red-700 text-white p-6 rounded-lg overflow-hidden shadow-lg">
        <img src={config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')} alt="Quản lý địa điểm" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative">
          <div className="bg-orange-500 p-3 rounded-lg inline-block mb-4">
            <i className="fas fa-map text-white text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold">{t("about.ti28")}</h3>
          <p>{t("about.ti25")}</p>
        </div>
      </div>
    </div>

    {/* Phần chữ (bên phải) */}
    <div className="lg:w-1/2 lg:pl-12 mt-10 lg:mt-0 text-left">
      <motion.p 
        className="text-xl italic text-orange-600 mb-2"
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }}
      >
        {t("about.ti29")}
      </motion.p>
      <motion.h2 
        className="text-5xl font-extrabold text-gray-900 leading-tight mb-4"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        {t("about.ti30")}
      </motion.h2>
      <p className="text-gray-700 max-w-3xl">
        {t("about.ti31")}
      </p>
      <p className="text-gray-700 max-w-3xl mt-4">
        {t("about.ti32")}
      </p>
      <motion.button 
        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
      >
        {t("about.ti33")}
      </motion.button>
    </div>
  </div>
</div>

{/* Phần "Về chúng tôi" */}
<section className="relative w-full h-screen flex flex-col items-center justify-end overflow-hidden pb-16">
      {/* Hình ảnh lớn full màn hình */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center px-6 lg:px-16 w-full">
        {/* Video Play Button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <button className="w-16 h-16 flex items-center justify-center bg-white text-red-500 rounded-full shadow-lg transition-transform transform hover:scale-110">
            ▶
          </button>
        </div>

        {/* Hình ảnh bên trái */}
        <div className="relative lg:w-1/2 flex justify-center mt-16 lg:mt-0">
          <div className="relative w-96 h-96">
            <img
              src={config.imageConfig.getImage('11GF_uq0FoYzMvy-KBBItsjfigikNOzoH')}
              alt="Large Image"
              className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg"
            />
            <div className="absolute bottom-[-20px] left-[-30px] border-4 border-white rounded-lg shadow-xl transform rotate-3">
              <img
                src={config.imageConfig.getImage('1iD_Pa2qZnOyEn6VN6EHXd_9nGw9B_3PL')}
                alt="Small Floating"
                className="w-48 h-56 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="lg:w-1/2 lg:pl-20 text-left mt-16 lg:mt-0 text-white">
          <motion.p
            className="text-xl italic text-orange-500 mb-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("about.ti34")}
          </motion.p>
          <motion.h2
            className="text-5xl font-extrabold leading-tight mb-4 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("about.ti35")}
          </motion.h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {t("about.ti36")}
          </p>
        </div>
      </div>
    </section>
    
      {/* Dịch vụ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12 w-full max-w-7xl px-6 lg:px-0">
        {services.map((service, index) => (
          <motion.div 
            key={index} 
            className="relative overflow-hidden rounded-2xl shadow-xl group bg-white transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <img src={service.image} alt={service.title} className="w-full h-56 object-cover brightness-75 transition duration-300 group-hover:brightness-50" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end items-center text-center p-6 transition-opacity duration-300 group-hover:from-opacity-60">
              <div className="mb-3 bg-orange-500 p-3 rounded-full text-white text-xl transition transform group-hover:scale-110 shadow-lg">
                {service.icon}
              </div>
              <h3 className="text-white text-lg font-semibold group-hover:text-orange-400 transition duration-300">
                {service.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2 group-hover:text-white transition duration-300">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Nhận xét khách hàng */}
      <div className="mt-10 relative bg-cover bg-center py-16" style={{ backgroundImage: `url('${config.imageConfig.getImage('1JjaqjdwMsg22toEBdQBMgAlDTcfIxMDa')})` }}>
      {/* Lớp phủ màu xanh */}
      <div className="absolute inset-0 bg-green-900 opacity-40"></div>

      <div className="relative z-10 text-center mb-12">
        <h2 className="text-lg italic text-orange-300">{t("about.ti37")}</h2>
        <h2 className="text-4xl font-bold text-white">{t("about.ti38")}</h2>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-center mb-4">
              {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                <FaStar key={i} className="text-orange-500 text-lg mx-1" />
              ))}
              {testimonial.rating % 1 !== 0 && <FaStar className="text-orange-500 text-lg mx-1 opacity-50" />}
            </div>
            <p className="text-gray-700 italic">{testimonial.review}</p>

            <div className="flex items-center justify-center mt-6">
              <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-gray-300" />
              <div className="ml-3 text-left">
                <h4 className="text-gray-800 font-semibold">{testimonial.name}</h4>
                <p className="text-orange-500 text-sm">{testimonial.job}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
    </div>
    {/* Phần giới thiệu công ty */}
    <section className="relative bg-cover bg-center py-24 text-white text-center" style={{ backgroundImage: `url('${config.imageConfig.getImage('1JjaqjdwMsg22toEBdQBMgAlDTcfIxMDa')}')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 px-6">
          <h2 className="text-5xl font-bold mb-4">{t("about.ti39")}</h2>
            <p className="text-lg mb-6">{t("about.ti40")}</p>
            <a href="#" className="inline-block bg-yellow-500 text-black py-3 px-8 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300">{t("about.ti41")}</a>
        </div>
    </section>
    </div>
  );
};

export default About;
