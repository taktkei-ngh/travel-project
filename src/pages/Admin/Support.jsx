import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Table, Tag, Select } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import SupportService from '~/services/SupportService';
import dayjs from 'dayjs';

const ITEM_PER_PAGE = 7;

const Support = () => {
    const [form] = Form.useForm();
    const [supports, setSupports] = useState([]);
    const [filteredSupports, setFilteredSupports] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [supportId, setSupportId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchSupports();
    }, []);

    const fetchSupports = async () => {
        try {
            const res = await SupportService.getAllSupports();

            const sortedSupports = res.data.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setSupports(sortedSupports);
            setFilteredSupports(sortedSupports);
        } catch (err) {
            console.error(err);
            message.error("Có lỗi khi lấy danh sách yêu cầu hỗ trợ.");
        }
    };

    const handleOpenModal = (record) => {
        setSupportId(record.id);
        form.setFieldsValue({
            email: record.email,
            subject: "",
            message: ""
        });
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const response = await SupportService.respondToSupport({
                id: supportId,
                email: values.email,
                subject: values.subject,
                responseMessage: values.message,
            });

            if (response?.code === 200) {
                const updateStatusResponse = await SupportService.updateSupportStatus(supportId, 'resolved');

                if (updateStatusResponse?.code === 200) {
                    message.success("Phản hồi thành công, email đã được gửi và trạng thái đã được cập nhật!");

                    const updated = (prev) =>
                        prev.map((support) =>
                            support.id === supportId ? { ...support, status: 'resolved' } : support
                        );

                    setSupports(updated);
                    setFilteredSupports(updated);

                    handleCloseModal();
                } else {
                    message.error("Cập nhật trạng thái thất bại!");
                }
            } else {
                message.error("Phản hồi thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi phản hồi:", error?.response?.data || error.message);
            message.error("Phản hồi thất bại!");
        }
    };

    const applySearchFilter = (text, status = filterStatus, list = supports) => {
        const value = text.toLowerCase();
        const filtered = list.filter((support) => {
            const name = (support.username || support.name || "").toLowerCase();
            const email = (support.email || "").toLowerCase();
            const matchesText = name.includes(value) || email.includes(value);
            const matchesStatus = status === "all" || (support.status || '').toLowerCase() === status;
            return matchesText && matchesStatus;
        });
        setFilteredSupports(filtered);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        applySearchFilter(value, filterStatus);
    };

    const handleStatusChange = (value) => {
        setFilterStatus(value);
        applySearchFilter(searchText, value);
    };

    const columns = [
        {
            title: "Tên khách hàng",
            key: "customerName",
            render: (_, record) => record.username || record.name || "Chưa có"
        },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Tiêu đề", dataIndex: "subject", key: "subject" },
        { title: "Nội dung", dataIndex: "message", key: "message" },
        {
            title: "Ngày gửi",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusColors = {
                    pending: "volcano",
                    resolved: "blue",
                };
                return (
                    <Tag color={statusColors[status?.toLowerCase()] || "default"}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button icon={<MailOutlined />} type="link" onClick={() => handleOpenModal(record)}>
                    Gửi thư
                </Button>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-2">
            <h2 className="text-2xl font-bold mb-4">KHÁCH HÀNG CẦN HỖ TRỢ & TƯ VẤN</h2>

            <div className="flex flex-wrap gap-2 mb-4">
                <Input
                    placeholder="Tìm theo tên hoặc email"
                    value={searchText}
                    onChange={handleSearchChange}
                    className="w-full sm:w-80"
                />
                <Select
                    value={filterStatus}
                    onChange={handleStatusChange}
                    className="w-full sm:w-40"
                    options={[
                        { value: "all", label: "Tất cả trạng thái" },
                        { value: "pending", label: "Đang chờ" },
                        { value: "resolved", label: "Đã xử lý" }
                    ]}
                />
            </div>

            <Table
                dataSource={filteredSupports}
                columns={columns}
                pagination={{ pageSize: ITEM_PER_PAGE }}
                rowKey="id"
            />

            <Modal
                title="GỬI THƯ PHẢN HỒI KHÁCH HÀNG"
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="send" type="primary" onClick={handleSubmit} icon={<MailOutlined />}>
                        Gửi
                    </Button>,
                    <Button key="close" onClick={handleCloseModal}>
                        Đóng
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="To Email:" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item label="Tiêu đề" name="subject" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Form.Item label="Nội dung" name="message" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
                        <Input.TextArea rows={4} placeholder="Nhập nội dung thư" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Support;