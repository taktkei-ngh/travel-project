import React from 'react';
import { Button } from 'react-bootstrap';

const TourStartCard = ({ id, ngayKhoiHanh, onDelete }) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{ngayKhoiHanh}</td>
      <td>
        <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
          Xóa
        </Button>
      </td>
    </tr>
  );
};

export default TourStartCard;