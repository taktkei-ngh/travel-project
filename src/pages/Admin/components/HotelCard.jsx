import React, { useState } from 'react';
import { Button, Image, message, Popconfirm, Space, Spin, Table, Tag, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const HotelCard = ({ hotels = [], onEdit, onDelete, onUpdateImage, loading }) => {
    const [fileLists, setFileLists] = useState({});
    const [uploadingId, setUploadingId] = useState(null);

    const handleUpdateImage = async (id) => {
        const fileList = fileLists[id] || [];
        if (fileList.length === 0) {
            message.warning("Vui lòng chọn ảnh mới!");
            return;
        }
        setUploadingId(id);
        try {
            await onUpdateImage(id);
            message.success("Cập nhật ảnh thành công!");
            setFileLists(prev => ({ ...prev, [id]: [] }));
        } catch (error) {
            message.error(error.message || "Lỗi khi cập nhật ảnh!");
        } finally {
            setUploadingId(null);
        }
    };

    const getUploadProps = (id) => ({
        onRemove: () => setFileLists(prev => ({ ...prev, [id]: [] })),
        beforeUpload: (file) => {
            setFileLists(prev => ({ ...prev, [id]: [file] }));
            return false;
        },
        fileList: fileLists[id] || [],
        maxCount: 1
    });

    const columns = [
        {
            title: "Tên khách sạn",
            dataIndex: "name",
            key: "name",
            render: (name) => name || <Tag color="orange">Chưa có tên</Tag>
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                <Tag color={rating >= 4 ? 'green' : rating >= 3 ? 'blue' : 'red'}>
                    {rating ? `${rating}/5` : "Chưa có"}
                </Tag>
            )
        },
        {
            title: "Chi phí",
            dataIndex: "cost",
            key: "cost",
            render: (cost) => cost ? `${cost.toLocaleString("vi-VN")} VND` : "N/A"
        },
        {
            title: "Loại",
            dataIndex: "typeHotel",
            key: "typeHotel",
            render: (type) => <Tag color="blue">{type || "Không xác định"}</Tag>
        },
        {
            title: "Hình ảnh",
            dataIndex: "imageURL",
            key: "imageURL",
            render: (url, record) => (
                <Space direction="vertical" align="center">
                    {url ? (
                        <Image
                            width={80}
                            src={url}
                            alt="Khách sạn"
                            style={{ borderRadius: 4 }}
                            preview
                        />
                    ) : (
                        <Tag color="gray">Không có ảnh</Tag>
                    )}
                    <Upload {...getUploadProps(record.id)}>
                        <Button
                            size="small"
                            icon={<UploadOutlined />}
                            disabled={uploadingId === record.id || loading}
                        >
                            Đổi ảnh
                        </Button>
                    </Upload>
                    {(fileLists[record.id]?.length > 0) && uploadingId !== record.id && (
                        <Button
                            size="small"
                            type="link"
                            onClick={() => handleUpdateImage(record.id)}
                            disabled={loading}
                        >
                            Lưu ảnh
                        </Button>
                    )}
                    {uploadingId === record.id && <Spin size="small" />}
                </Space>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit?.(record)}
                        disabled={loading}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => onDelete?.(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={loading}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={loading}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={hotels}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            locale={{
                emptyText: 'Không có dữ liệu khách sạn'
            }}
        />
    );
};

export default HotelCard;