
const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? token : null;
}
const getInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}
export {
    getToken,
    getInfo
}