'use client';

import { Avatar, Card, Descriptions, Typography, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Update from './Update';
import '../../../app/TaiKhoanCaNhan/style.css';

const { Title, Text } = Typography;

// Tạo instance axios với baseURL và headers mặc định
const api = axios.create({
  baseURL: 'https://dev.lcdkhoacntt1-ptit.tech/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function TaiKhoanCaNhanMain() {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    dob: '',
    hometown: '',
    student_id: '',
    class_name: '',
    academic_year: '',
    facebook_link: ''
  });
  const [department, setDepartment] = useState({ name: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/me');
        setUser(response.data.data.user_info);
        setDepartment(response.data.data.department);
        setError('');
      } catch (err) {
        console.error('Lỗi khi gọi API:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Không tìm thấy thông tin người dùng</p>;

  return (
    <div className="flex justify-center px-4">
      <Card style={{ width: '100%', maxWidth: 800, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div className="text-center">
          <Avatar size={80} style={{ backgroundColor: '#3f51b5' }}>
            {user.first_name.charAt(0).toUpperCase()}
            {user.last_name.charAt(0).toUpperCase()}
          </Avatar>
          <Title level={4} className="mt-2">{`${user.last_name} ${user.first_name}`}</Title>
          <Text type="secondary">{department?.name}</Text>
        </div>

        <Descriptions title={<Title level={5}>Thông tin cá nhân</Title>} column={2} className="mt-4">
          <Descriptions.Item label="Họ và tên">
            {user.last_name} {user.first_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {String(user.dob).replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1')}
          </Descriptions.Item>
          <Descriptions.Item label="Quê quán">{user.hometown}</Descriptions.Item>
        </Descriptions>

        <Descriptions title={<Title level={5}>Thông tin học tập</Title>} column={2} className="mt-4">
          <Descriptions.Item label="Mã sinh viên">{user.student_id}</Descriptions.Item>
          <Descriptions.Item label="Lớp">{user.class_name}</Descriptions.Item>
          <Descriptions.Item label="Khóa">{user.academic_year}</Descriptions.Item>
        </Descriptions>

        <div className="mt-4">
          <Title level={5}>Liên kết xã hội</Title>
          <Button type="primary" href={user.facebook_link} target="_blank">
            Facebook
          </Button>
        </div>

        <div className="mt-2">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Sửa
          </Button>
        </div>

        <Modal
          title="Chỉnh sửa thông tin"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          {/* <Update /> */}
        </Modal>
      </Card>
    </div>
  );
}
