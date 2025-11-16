import dayjs from 'dayjs';

export const getCurrentDate = () => {
    const date = new Date();
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}