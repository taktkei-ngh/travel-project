import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const PromotionCard = ({ promotion, onDelete, onEdit }) => {
    return (
        <tr className="border-b">
            <td className="p-3 text-center">{promotion.id}</td>
            <td className="p-3">
                <img src={promotion.image} alt={promotion.name} className="w-16 h-16 object-cover rounded" />
            </td>
            <td className="p-3">{promotion.name}</td>
            <td className="p-3">{promotion.code}</td>
            <td className="p-3 text-green-500 font-semibold">{promotion.status}</td>
            <td className="p-3">{promotion.startDate}</td>
            <td className="p-3">{promotion.endDate}</td>
            <td className="p-3 text-center">{promotion.quantity}</td>
            <td className="p-3 flex justify-center gap-2">
                <button onClick={() => onEdit(promotion)} className="p-2 bg-blue-500 text-white rounded">
                    <Pencil size={18} />
                </button>
                <button onClick={() => onDelete(promotion.id)} className="p-2 bg-red-500 text-white rounded">
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

export default PromotionCard;
