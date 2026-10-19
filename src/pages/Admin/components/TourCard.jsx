import React from 'react';

const TourCard = ({ tour, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold">{tour.name}</h3>
      <p>Giá: {tour.price}</p>
      <p>Thời gian: {tour.duration}</p>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => onEdit(tour)}
        >
          Sửa
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => onDelete(tour.id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default TourCard;
