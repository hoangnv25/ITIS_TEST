import { useState, useEffect } from 'react';
import { FaEdit, FaAngleDown, FaCalendar } from 'react-icons/fa';
import { validateDob } from './utils';
import { message, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

export default function EditInfo({ department, user, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ 
        ...user,
        dob: {
            day: 1,
            month: 1,
            year: 2000
        }
    });

    const displayDob = (dob) => {
        if (!dob) return '';
        const dobString = String(dob).padStart(8, '0');
        return `${dobString.slice(6, 8)}/${dobString.slice(4, 6)}/${dobString.slice(0, 4)}`;
    };

    useEffect(() => {
        if (user?.dob) {
            try {
                const dobString = String(user.dob).padStart(8, '0');
                setEditedUser(prev => ({
                    ...prev,
                    dob: {
                        day: parseInt(dobString.slice(6, 8)),
                        month: parseInt(dobString.slice(4, 6)),
                        year: parseInt(dobString.slice(0, 4))
                    }
                }));
            } catch (error) {
                console.error('Error parsing dob:', error);
            }
        }
    }, [user]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        
        const changes = {};
        
        if (editedUser.hometown !== user.hometown) {
            changes.hometown = editedUser.hometown;
        }
        if (editedUser.class_name !== user.class_name) {
            changes.class_name = editedUser.class_name;
        }
        if (editedUser.student_id !== user.student_id) {
            changes.student_id = editedUser.student_id;
        }
        
        const currentDob = parseInt(`${editedUser.dob.year}${String(editedUser.dob.month).padStart(2, '0')}${String(editedUser.dob.day).padStart(2, '0')}`);
        if (currentDob !== user.dob) {
            if (validateDob(editedUser.dob.day, editedUser.dob.month, editedUser.dob.year)) {
                changes.dob = editedUser.dob;
            } else {
                console.error('Không thể cập nhật ngày sinh do dữ liệu không hợp lệ');
            }
        }

        console.log('Request body:', JSON.stringify(changes, null, 2));
        if (Object.keys(changes).length > 0) {
            message.success('Cập nhật thông tin thành công');
            onSave(changes);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateChange = (date) => {
        if (date) {
            setEditedUser(prev => ({
                ...prev,
                dob: {
                    day: date.date(),
                    month: date.month() + 1,
                    year: date.year()
                }
            }));
        }
    };

    const getInitialDate = () => {
        if (user?.dob) {
            const dobString = String(user.dob).padStart(8, '0');
            return dayjs(`${dobString.slice(0, 4)}-${dobString.slice(4, 6)}-${dobString.slice(6, 8)}`);
        }
        return dayjs('2000-01-01');
    };

    return (
        <>
             <div className="info_header">
                <div className="info_header_left">
                    <div className="info_avatar">
                        {(user?.last_name?.split(' ') || []).map(word => word.charAt(0).toUpperCase()).join('') + 
                         (user?.first_name?.split(' ') || []).map(word => word.charAt(0).toUpperCase()).join('')}
                    </div>
                    <div className="info_name_container">
                        <div className="info_name"> {user?.last_name || ''} {user?.first_name || ''} </div>
                        <div className='info_department'> {department?.name || ''} </div>
                    </div>
                </div>
                <div className="info_header_right c_hide">
                    {isEditing ? (
                        <button className="save_button" onClick={handleSaveClick}>Lưu</button>
                    ) : (
                        <button className="edit_button" onClick={handleEditClick}>Sửa</button>
                    )}
                </div>
            </div>

            <div className="info_body">
                <div className="info_body_left l-6 medium-6 c-12">
                    <div className='info_item'>
                        <div className='info_item_title'>Ngày sinh</div>
                            <DatePicker
                                className='info_item_content date_picker'
                                disabled={!isEditing}
                                value={editedUser.dob ? dayjs(`${editedUser.dob.year}-${String(editedUser.dob.month).padStart(2,'0')}-${String(editedUser.dob.day).padStart(2,'0')}`) : getInitialDate()}
                                onChange={handleDateChange}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày sinh"
                                suffixIcon={
                                    <div className={`info_item_edit ${isEditing ? 'editing' : ''}`}>
                                        {isEditing ? <FaCalendar style={{opacity: 0.8, cursor: 'default'}} /> : <FaCalendar />}
                                    </div>
                                }
                            />
                    </div>
                    <div className='info_item'>
                        <div className='info_item_title'>Giới tính</div>
                        <div className='info_item_content'>
                            <input 
                                type="text" 
                                disabled={true}
                                placeholder="Giới tính"
                            />
                            <div className="info_item_edit">
                                <FaAngleDown />
                            </div>
                        </div>
                    </div>
                    <div className='info_item'>
                        <div className='info_item_title'>Quê quán</div>
                        <div className='info_item_content'>
                            <Select
                                className='info_item_content select_css kanit-regular'
                                showSearch
                                value={editedUser.hometown}
                                disabled={!isEditing}
                                placeholder="Nhập quê quán"
                                onChange={(value) => handleInputChange('hometown', value)}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                suffixIcon={isEditing ? <FaAngleDown style={{opacity: 0.8, cursor: 'default'}} /> : <FaAngleDown />}
                            >
                                <Option className="kanit-regular" value="An Giang">An Giang</Option>
                                <Option className="kanit-regular" value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</Option>
                                <Option className="kanit-regular" value="Bắc Giang">Bắc Giang</Option>
                                <Option className="kanit-regular" value="Bắc Kạn">Bắc Kạn</Option>
                                <Option className="kanit-regular" value="Bạc Liêu">Bạc Liêu</Option>
                                <Option className="kanit-regular" value="Bắc Ninh">Bắc Ninh</Option>
                                <Option className="kanit-regular" value="Bến Tre">Bến Tre</Option>
                                <Option className="kanit-regular" value="Bình Định">Bình Định</Option>
                                <Option className="kanit-regular" value="Bình Dương">Bình Dương</Option>
                                <Option className="kanit-regular" value="Bình Phước">Bình Phước</Option>
                                <Option className="kanit-regular" value="Bình Thuận">Bình Thuận</Option>
                                <Option className="kanit-regular" value="Cà Mau">Cà Mau</Option>
                                <Option className="kanit-regular" value="Cần Thơ">Cần Thơ</Option>
                                <Option className="kanit-regular" value="Cao Bằng">Cao Bằng</Option>
                                <Option className="kanit-regular" value="Đà Nẵng">Đà Nẵng</Option>
                                <Option className="kanit-regular" value="Đắk Lắk">Đắk Lắk</Option>
                                <Option className="kanit-regular" value="Đắk Nông">Đắk Nông</Option>
                                <Option className="kanit-regular" value="Điện Biên">Điện Biên</Option>
                                <Option className="kanit-regular" value="Đồng Nai">Đồng Nai</Option>
                                <Option className="kanit-regular" value="Đồng Tháp">Đồng Tháp</Option>
                                <Option className="kanit-regular" value="Gia Lai">Gia Lai</Option>
                                <Option className="kanit-regular" value="Hà Giang">Hà Giang</Option>
                                <Option className="kanit-regular" value="Hà Nam">Hà Nam</Option>
                                <Option className="kanit-regular" value="Hà Nội">Hà Nội</Option>
                                <Option className="kanit-regular" value="Hà Tĩnh">Hà Tĩnh</Option>
                                <Option className="kanit-regular" value="Hải Dương">Hải Dương</Option>
                                <Option className="kanit-regular" value="Hải Phòng">Hải Phòng</Option>
                                <Option className="kanit-regular" value="Hậu Giang">Hậu Giang</Option>
                                <Option className="kanit-regular" value="Hòa Bình">Hòa Bình</Option>
                                <Option className="kanit-regular" value="Hưng Yên">Hưng Yên</Option>
                                <Option className="kanit-regular" value="Khánh Hòa">Khánh Hòa</Option>
                                <Option className="kanit-regular" value="Kiên Giang">Kiên Giang</Option>
                                <Option className="kanit-regular" value="Kon Tum">Kon Tum</Option>
                                <Option className="kanit-regular" value="Lai Châu">Lai Châu</Option>
                                <Option className="kanit-regular" value="Lâm Đồng">Lâm Đồng</Option>
                                <Option className="kanit-regular" value="Lạng Sơn">Lạng Sơn</Option>
                                <Option className="kanit-regular" value="Lào Cai">Lào Cai</Option>
                                <Option className="kanit-regular" value="Long An">Long An</Option>
                                <Option className="kanit-regular" value="Nam Định">Nam Định</Option>
                                <Option className="kanit-regular" value="Nghệ An">Nghệ An</Option>
                                <Option className="kanit-regular" value="Ninh Bình">Ninh Bình</Option>
                                <Option className="kanit-regular" value="Ninh Thuận">Ninh Thuận</Option>
                                <Option className="kanit-regular" value="Phú Thọ">Phú Thọ</Option>
                                <Option className="kanit-regular" value="Phú Yên">Phú Yên</Option>
                                <Option className="kanit-regular" value="Quảng Bình">Quảng Bình</Option>
                                <Option className="kanit-regular" value="Quảng Nam">Quảng Nam</Option>
                                <Option className="kanit-regular" value="Quảng Ngãi">Quảng Ngãi</Option>
                                <Option className="kanit-regular" value="Quảng Ninh">Quảng Ninh</Option>
                                <Option className="kanit-regular" value="Quảng Trị">Quảng Trị</Option>
                                <Option className="kanit-regular" value="Sóc Trăng">Sóc Trăng</Option>
                                <Option className="kanit-regular" value="Sơn La">Sơn La</Option>
                                <Option className="kanit-regular" value="Tây Ninh">Tây Ninh</Option>
                                <Option className="kanit-regular" value="Thái Bình">Thái Bình</Option>
                                <Option className="kanit-regular" value="Thái Nguyên">Thái Nguyên</Option>
                                <Option className="kanit-regular" value="Thanh Hóa">Thanh Hóa</Option>
                                <Option className="kanit-regular" value="Thừa Thiên Huế">Thừa Thiên Huế</Option>
                                <Option className="kanit-regular" value="Tiền Giang">Tiền Giang</Option>
                                <Option className="kanit-regular" value="TP Hồ Chí Minh">TP Hồ Chí Minh</Option>
                                <Option className="kanit-regular" value="Trà Vinh">Trà Vinh</Option>
                                <Option className="kanit-regular" value="Tuyên Quang">Tuyên Quang</Option>
                                <Option className="kanit-regular" value="Vĩnh Long">Vĩnh Long</Option>
                                <Option className="kanit-regular" value="Vĩnh Phúc">Vĩnh Phúc</Option>
                                <Option className="kanit-regular" value="Yên Bái">Yên Bái</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="info_body_right l-6 medium-6 c-12">
                    <div className='info_item'>
                        <div className='info_item_title'>Mã lớp</div>
                        <div className='info_item_content'>
                            <input 
                                type="text" 
                                value={editedUser.class_name} 
                                disabled={!isEditing}
                                onChange={(e) => handleInputChange('class_name', e.target.value)}
                                placeholder="Nhập mã lớp"
                            />
                            <div className={`info_item_edit ${isEditing ? 'editing' : ''}`}>
                                {isEditing ? <FaEdit style={{opacity: 0.8, cursor: 'default'}} /> : <FaEdit />}
                            </div>
                        </div>
                    </div>
                    <div className='info_item'>
                        <div className='info_item_title'>Mã sinh viên</div>
                        <div className='info_item_content'>
                            <input 
                                type="text" 
                                value={editedUser.student_id} 
                                disabled={!isEditing}
                                onChange={(e) => handleInputChange('student_id', e.target.value)}
                                placeholder="Nhập mã sinh viên"
                            />   
                            <div className={`info_item_edit ${isEditing ? 'editing' : ''}`}>
                                {isEditing ? <FaEdit style={{opacity: 0.8, cursor: 'default'}} /> : <FaEdit />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="edit_buttons l_m_hide">
                {isEditing ? (
                    <button className="save_button" onClick={handleSaveClick}>Lưu</button>
                ) : (
                    <button className="edit_button" onClick={handleEditClick}>Chỉnh sửa</button>
                )}
            </div>
        </>
    );
}