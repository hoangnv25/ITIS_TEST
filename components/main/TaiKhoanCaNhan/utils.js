export const validateDob = (day, month, year) => {
    if (!day || !month || !year) {
        console.error('Ngày sinh không hợp lệ: thiếu thông tin');
        return false;
    }

    const numDay = parseInt(day);
    const numMonth = parseInt(month);
    const numYear = parseInt(year);

    if (isNaN(numDay) || isNaN(numMonth) || isNaN(numYear)) {
        console.error('Ngày sinh không hợp lệ: giá trị không phải số');
        return false;
    }

    if (numDay < 1 || numDay > 31) {
        console.error('Ngày sinh không hợp lệ: ngày phải từ 1-31');
        return false;
    }

    if (numMonth < 1 || numMonth > 12) {
        console.error('Ngày sinh không hợp lệ: tháng phải từ 1-12');
        return false;
    }

    if (numYear < 1900 || numYear > new Date().getFullYear()) {
        console.error('Ngày sinh không hợp lệ: năm không hợp lệ');
        return false;
    }

    return true;
}; 