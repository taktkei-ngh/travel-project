import React from 'react';

const AboutCard = ({ imageSrc, title, description }) => {
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
      <img className="w-full h-56 object-cover" src={imageSrc} alt={title} />
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default AboutCard;