import './grid.css'
import '../../../app/globals.css'
import '../../../app/TaiKhoanCaNhan/style.css';

import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'antd/dist/reset.css';

import { BsPerson } from 'react-icons/bs';
import { MdOutlineMail } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaFacebookF } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import EditInfo from './EditInfo';
import ContactEditModal from './ContactEditModal';

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

export default function TaiKhoanCaNhan() {
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/user/me');
                console.log('User data:', response.data.data.user_info);
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

    const handleSave = async (editedUser) => {
        try {
            // Gọi API để cập nhật thông tin
            const response = await api.put('/user', editedUser);
            // Cập nhật state với dữ liệu mới từ server
            setUser(prevUser => ({
                ...prevUser, // Giữ lại tất cả các trường cũ
                ...response.data.data // Cập nhật các trường mới từ server
            }));
            console.log('User data after update:', response.data.data);
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin:', err);
        }
    };

    const handleContactSave = async (changes) => {
        try {
            const response = await api.put('/user', changes);
            setUser(prevUser => ({
                ...prevUser,
                ...response.data.data
            }));
            console.log('User data after contact update:', response.data.data);
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin liên hệ:', err);
            throw err;
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>Không tìm thấy thông tin người dùng</p>;
        
    return (
        <>
            <div className="grid wide">
                <div className="row">
                    <div className="col l-12 medium-12 c-12">
                        <div className="info_container container_css">
                            <EditInfo department={department} user={user} onSave={handleSave} />
                        </div>
                    </div>

                    <div className="col l-6 medium-6 c-12">
                        <div className="role_container container_css">
                            <div className="role_header">
                                Chức vụ đương nhiệm
                            </div>
                            <div className="role_body">
                                <div className="role_item">
                                    <div className="role_item_icon">
                                        <BsPerson />
                                    </div>
                                    <div className="role_item_content">
                                        Đang cập nhật
                                    </div>
                                </div>
                                <div className="role_item">
                                    <div className="role_item_icon">
                                        <BsPerson />
                                    </div>
                                    <div className="role_item_content">
                                        Đang cập nhật
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col l-6 medium-6 c-12">
                        <div className="contact_container container_css">
                            <div className="contact_header">Liên hệ</div>
                            <div className="contact_body">
                                <div className="contact_item">
                                    <div className="contact_item_icon" onClick={() => window.open(`mailto:${user.email}`, '_blank')}>
                                        <MdOutlineMail />   
                                    </div>
                                    <div className="contact_item_content" onClick={() => window.open(`mailto:${user.email}`, '_blank')}>
                                        {user.email}
                                    </div>
                                </div>
                                <div className="contact_item" >
                                    <div className="contact_item_icon" onClick={() => window.open(`tel:${user.phone_number}`, '_blank')}>
                                        <FaPhoneAlt />
                                    </div>
                                    <div className="contact_item_content" onClick={() => window.open(`tel:${user.phone_number}`, '_blank')}>
                                        {user.phone_number?.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                                    </div>
                                </div>
                                <div className="contact_item">
                                    <div className="contact_item_icon" onClick={() => window.open(`${user.facebook_link}`, '_blank')}>
                                        <FaFacebookF />
                                    </div>
                                    <div className="contact_item_content" onClick={() => window.open(`${user.facebook_link}`, '_blank')}>
                                        Facebook
                                    </div>
                                </div>
                            </div>
                            <div className="contact_edit">
                                <div className="contact_edit_button" onClick={() => setIsContactModalOpen(true)}>
                                    <div className="contact_edit_button_icon">
                                        <FaEdit />
                                    </div>
                                    <div className="contact_edit_button_text">
                                        Sửa
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <ContactEditModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                user={user}
                onSave={handleContactSave}
            />
        </>
    )
}
