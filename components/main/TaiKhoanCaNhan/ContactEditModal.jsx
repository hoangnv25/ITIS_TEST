import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { FaEdit } from 'react-icons/fa';

export default function ContactEditModal({ isOpen, onClose, user, onSave }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            // Chỉ gửi những trường có giá trị
            const changes = {};
            if (values.email) changes.email = values.email;
            if (values.phone_number) changes.phone_number = values.phone_number;
            if (values.facebook_link) changes.facebook_link = values.facebook_link;

            if (Object.keys(changes).length === 0) {
                message.warning('Vui lòng nhập ít nhất một trường để cập nhật');
                return;
            }

            await onSave(changes);
            message.success('Cập nhật thông tin liên hệ thành công');
            onClose();
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin liên hệ"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    email: user.email,
                    phone_number: user.phone_number,
                    facebook_link: user.facebook_link
                }}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Nhập email mới" />
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label="Số điện thoại"
                    rules={[
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại mới" />
                </Form.Item>

                <Form.Item
                    name="facebook_link"
                    label="Link Facebook"
                    rules={[
                        { type: 'url', message: 'Link Facebook không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Nhập link Facebook mới" />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
} 