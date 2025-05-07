import { useState, useEffect } from 'react';
import { FaEdit, FaAngleDown, FaCalendar } from 'react-icons/fa';
import { validateDob } from './utils';
import { message, DatePicker } from 'antd';
import dayjs from 'dayjs';

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
                            <input 
                                type="text" 
                                value={editedUser.hometown} 
                                disabled={!isEditing}
                                onChange={(e) => handleInputChange('hometown', e.target.value)}
                                placeholder="Nhập quê quán"
                            />
                            <div className={`info_item_edit ${isEditing ? 'editing' : ''}`}>
                                {isEditing ? <FaEdit style={{opacity: 0.8, cursor: 'default'}} /> : <FaEdit />}
                            </div>
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