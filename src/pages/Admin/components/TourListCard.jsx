import React, { useState } from 'react';
import { Button, Card, Modal } from 'antd';

const TourListCard = ({ tour }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    return (
        <>
            <Card title={tour.name} bordered={false} style={{ backgroundColor: "#fff" }}>
                <p><strong>Điểm đến:</strong> {tour.destination}</p>
                <p><strong>Giá:</strong> {tour.price} USD</p>
                <p><strong>Thời gian:</strong> {tour.duration}</p>
                <Button type="primary" onClick={showModal}>Xem chi tiết</Button>
            </Card>

            <Modal title="Chi tiết Tour" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <p><strong>Tên Tour:</strong> {tour.name}</p>
                <p><strong>Điểm đến:</strong> {tour.destination}</p>
                <p><strong>Giá:</strong> {tour.price} USD</p>
                <p><strong>Thời gian:</strong> {tour.duration}</p>
                <p><strong>Đánh giá:</strong> {tour.rating} ⭐</p>
            </Modal>
        </>
    );
};

export default TourListCard;