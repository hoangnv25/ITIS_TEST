import { useState, useEffect } from 'react';
import { FaEdit, FaAngleDown } from 'react-icons/fa';
import { validateDob } from './utils';
import { message } from 'antd';

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
    const [dobInput, setDobInput] = useState('');

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
                setDobInput(dobString.replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1'));
            } catch (error) {
                console.error('Error parsing dob:', error);
            }
        } else {
            setDobInput('dd/mm/yyyy');
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
        // Chỉ gửi những trường đã thay đổi
        if (Object.keys(changes).length > 0) {
            message.success('Cập nhật thông tin thành công');
            onSave(changes);
        }
    };

    const handleInputChange = (field, value) => {
        if (field.startsWith('dob.')) {
            const dobField = field.split('.')[1];
            setEditedUser(prev => ({
                ...prev,
                dob: {
                    ...prev.dob,
                    [dobField]: parseInt(value) || 0
                }
            }));
        } else {
            setEditedUser(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleDobChange = (e) => {
        let value = e.target.value;
        // Chỉ cho phép nhập số và dấu /
        value = value.replace(/[^\d/]/g, '');
        
        // Xử lý khi xóa
        if (value.length < dobInput.length) {
            setDobInput(value);
            return;
        }

        // Thêm dấu / tự động
        if (value.length === 2 && !value.includes('/')) {
            value = value + '/';
        }
        if (value.length === 5 && value.split('/').length === 2) {
            value = value + '/';
        }

        // Giới hạn độ dài
        if (value.length > 10) return;

        setDobInput(value);

        // Cập nhật editedUser khi đủ 10 ký tự
        if (value.length === 10) {
            const [day, month, year] = value.split('/');
            setEditedUser(prev => ({
                ...prev,
                dob: {
                    day: parseInt(day),
                    month: parseInt(month),
                    year: parseInt(year)
                }
            }));
        }
    };

    const displayDob = user.dob ? 
        String(user.dob).padStart(8, '0').replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1') : 
        '01/01/2000';

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
                        <div className='info_item_content'>
                            <input 
                                type="text" 
                                value={isEditing ? dobInput : displayDob}
                                disabled={!isEditing}
                                onChange={handleDobChange}
                                placeholder="dd/mm/yyyy"
                                className="dob-input"
                            />
                            <div className={`info_item_edit ${isEditing ? 'editing' : ''}`}>
                                {isEditing ? <FaEdit style={{opacity: 0.8, cursor: 'default'}} /> : <FaEdit />}
                            </div>
                        </div>
                    </div>
                    <div className='info_item'>
                        <div className='info_item_title'>Giới tính</div>
                        <div className='info_item_content'>
                            {/* <input 
                                type="text" 
                                placeholder="Giới tính" 
                                disabled={!isEditing}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                            />
                            <div className={`info_item_edit ${isEditing ? 'editing' : ''}`}>
                                {isEditing ? <FaAngleDown style={{opacity: 0.8, cursor: 'default'}} /> : <FaAngleDown />}
                            </div> */}
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
                    <button className="edit_button" onClick={handleEditClick}>Sửa</button>
                )}
            </div>
        </>
    );
}